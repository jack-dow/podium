import type { RefObject } from 'react';
import type { ViewProps } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { styled } from 'nativewind';

import { Text } from '@ui/typography/Text';
import type { TemplateExerciseWithExercise } from '@podium/db';
import { useTemplateAPI, useTemplateExercises } from '@/stores/local/TemplateProvider';

const EXERCISE_ITEM_HEIGHT = 64;
const EXERCISE_ITEM_GUTTER = 24;
const EXERCISE_ITEM_HEIGHT_WITH_GUTTER = EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER;

function clamp(value: number, lowerBound: number, upperBound: number) {
  'worklet';
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function SelectList({ style }: { style?: ViewProps['style'] }) {
  const templateExercises = useTemplateExercises();

  const positions = useSharedValue<Record<string, number>>(
    Object.values(templateExercises).reduce((acc, templateExercise) => {
      acc[templateExercise.id] = templateExercise.position;
      return acc;
    }, {} as Record<string, number>),
  );

  // Update the animated positions a template exercise gets added or removed
  useEffect(() => {
    if (Object.keys(templateExercises).length !== Object.keys(positions.value).length) {
      positions.value = Object.values(templateExercises).reduce((acc, templateExercise) => {
        acc[templateExercise.id] = templateExercise.position;
        return acc;
      }, {} as Record<string, number>);
    }
  }, [templateExercises, positions]);

  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false),
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
    },
  });

  if (Object.keys(templateExercises).length === 0) return <View />;

  return (
    <View style={style}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="relative"
        contentContainerStyle={{
          height: Object.keys(templateExercises).length * EXERCISE_ITEM_HEIGHT_WITH_GUTTER,
        }}
      >
        <View
          className="absolute w-px border-r border-divider pl-xl"
          style={{
            height: Object.keys(templateExercises).length * EXERCISE_ITEM_HEIGHT_WITH_GUTTER - EXERCISE_ITEM_GUTTER,
          }}
        />
        {Object.values(templateExercises).map((templateExercise) => (
          <MoveableExerciseItem
            positions={positions}
            key={templateExercise.id}
            scrollViewRef={scrollViewRef}
            templateExercise={templateExercise}
            scrollY={scrollY}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

interface MoveableExerciseItemProps {
  positions: SharedValue<Record<string, number>>;
  scrollY: SharedValue<number>;
  templateExercise: TemplateExerciseWithExercise;
  scrollViewRef: RefObject<Animated.ScrollView>;
}
function MoveableExerciseItem({ positions, templateExercise }: MoveableExerciseItemProps) {
  const { setTemplateExercisePositions } = useTemplateAPI();

  const isGestureActive = useSharedValue(false);
  const translateY = useSharedValue(
    (positions.value[templateExercise.id] || templateExercise.position) * EXERCISE_ITEM_HEIGHT_WITH_GUTTER,
  );

  const animationConfig = {
    easing: Easing.inOut(Easing.ease),
    duration: 200,
  };

  useAnimatedReaction(
    () => positions.value[templateExercise.id],
    (newPosition = 0) => {
      if (!isGestureActive.value) {
        translateY.value = withTiming(newPosition * EXERCISE_ITEM_HEIGHT_WITH_GUTTER, animationConfig);
      }
    },
  );

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { y: number }>({
    onStart(_, ctx) {
      ctx.y = translateY.value;
      isGestureActive.value = true;
    },
    onActive({ translationY }, ctx) {
      translateY.value = ctx.y + translationY;

      const newPosition = clamp(
        Math.floor(translateY.value / EXERCISE_ITEM_HEIGHT_WITH_GUTTER),
        0,
        Object.keys(positions.value).length - 1,
      );
      const oldPosition = positions.value[templateExercise.id]!;

      if (newPosition !== oldPosition) {
        const idToSwap = Object.keys(positions.value).find((key) => positions.value[key] === newPosition);
        if (idToSwap) {
          // Spread operator is not supported in worklets
          // And Object.assign doesn't seem to be working on alpha.6
          const newPositions = { ...positions.value };
          newPositions[templateExercise.id] = newPosition;
          newPositions[idToSwap] = oldPosition;
          positions.value = newPositions;
        }
      }
    },
    onFinish() {
      const newPosition = positions.value[templateExercise.id]! * EXERCISE_ITEM_HEIGHT_WITH_GUTTER;
      translateY.value = withTiming(newPosition, animationConfig, () => (isGestureActive.value = false));
      runOnJS(setTemplateExercisePositions)(positions.value);
    },
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: isGestureActive.value ? 0.6 : 1,
      zIndex: isGestureActive.value ? 10 : 0,
      height: EXERCISE_ITEM_HEIGHT,
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      width: 64,
      height: 64,
      backgroundColor: isGestureActive.value ? 'rgba(255,255,255,0.6)' : '#fff',
      marginHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,

      opacity: isGestureActive.value ? 0.6 : 1,
    };
  });

  return (
    <Animated.View className="absolute top-none left-none w-4/5" style={animatedContainerStyle}>
      <PanGestureHandler onGestureEvent={onGestureEvent} activateAfterLongPress={150}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <View className="flex-row items-center" style={{ height: EXERCISE_ITEM_HEIGHT }}>
            <Animated.View className="shadow" style={animatedCardStyle}>
              <Text weight="bold" className="text-xl text-primary-normal">
                {templateExercise.exercise.name[0]?.toUpperCase()}
              </Text>
            </Animated.View>

            <View className="ml-sm">
              <Text weight="semibold" className="text-base text-primary-normal">
                {templateExercise.exercise.name}
              </Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

export const ExerciseSelectList = styled(SelectList);
