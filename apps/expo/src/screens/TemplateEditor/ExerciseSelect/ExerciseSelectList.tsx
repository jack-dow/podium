import type { RefObject } from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
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

import type { TemplateExercisesPositions } from '../TemplateEditorContext';
import { useTheme } from '@/themes';
import type { ExerciseId } from '@/contexts/ExercisesContext';
import { trpc } from '@/utils/trpc';
import { useTemplateAPI, useTemplateExercise, useTemplateExercisePositions } from '@/providers/FullTemplateProvider';

const EXERCISE_ITEM_HEIGHT = 64;
const EXERCISE_ITEM_GUTTER = 24;

function clamp(value: number, lowerBound: number, upperBound: number) {
  'worklet';
  return Math.max(lowerBound, Math.min(value, upperBound));
}

export function ExerciseSelectList() {
  const theme = useTheme();
  const templateExercisesPositions = useTemplateExercisePositions();

  const positions = useSharedValue<TemplateExercisesPositions>({});

  useEffect(() => {
    if (Object.keys(templateExercisesPositions).length !== Object.keys(positions.value).length) {
      const newPositions = JSON.parse(JSON.stringify(templateExercisesPositions));
      positions.value = newPositions;
    }
  }, [templateExercisesPositions, positions]);

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

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{
          position: 'relative',
        }}
        contentContainerStyle={{
          height: Object.keys(templateExercisesPositions).length * (EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER),
          // backgroundColor: '#aaa',
        }}
      >
        <View
          style={{
            position: 'absolute',
            height:
              Object.keys(templateExercisesPositions).length * (EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER) -
              EXERCISE_ITEM_GUTTER,
            paddingLeft: 32,
            width: 1,
            borderRightWidth: theme.borderWeights.light,
            borderRightColor: theme.colors.border.divider,
          }}
        />
        {Object.keys(templateExercisesPositions).map((templateExerciseId) => (
          <MoveableExerciseItem
            positions={positions}
            key={templateExerciseId}
            scrollViewRef={scrollViewRef}
            templateExerciseId={templateExerciseId}
            scrollY={scrollY}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

interface MoveableExerciseItemProps {
  positions: SharedValue<TemplateExercisesPositions>;
  scrollY: SharedValue<number>;
  templateExerciseId: ExerciseId;
  scrollViewRef: RefObject<Animated.ScrollView>;
}
function MoveableExerciseItem({ positions, templateExerciseId }: MoveableExerciseItemProps) {
  const { templateExercise, isLoading, isError } = useTemplateExercise(templateExerciseId);
  const { syncTemplateExercisePositions } = useTemplateAPI();

  const { colors, spacing, fontSizes, radii, fontWeights, shadows } = useTheme();

  const isGestureActive = useSharedValue(false);
  const translateY = useSharedValue(
    (positions.value[templateExerciseId] || 0) * (EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER),
  );

  const animationConfig = {
    easing: Easing.inOut(Easing.ease),
    duration: 200,
  };

  useAnimatedReaction(
    () => positions.value[templateExerciseId],
    (newPosition) => {
      if (!isGestureActive.value) {
        translateY.value = withTiming(newPosition * (EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER), animationConfig);
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
        Math.floor(translateY.value / (EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER)),
        0,
        Object.keys(positions.value).length - 1,
      );
      const oldPosition = positions.value[templateExerciseId];

      if (newPosition !== oldPosition) {
        const idToSwap = Object.keys(positions.value).find((key) => positions.value[key] === newPosition);
        if (idToSwap) {
          // Spread operator is not supported in worklets
          // And Object.assign doesn't seem to be working on alpha.6
          const newPositions = { ...positions.value };
          newPositions[templateExerciseId] = newPosition;
          newPositions[idToSwap] = oldPosition;
          positions.value = newPositions;
        }
      }
    },
    onFinish() {
      const newPosition = positions.value[templateExerciseId] * (EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER);
      translateY.value = withTiming(newPosition, animationConfig, () => {
        isGestureActive.value = false;
      });
      runOnJS(syncTemplateExercisePositions)(positions.value);
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '80%',
      opacity: isGestureActive.value ? 0.6 : 1,
      zIndex: isGestureActive.value ? 10 : 0,
      height: EXERCISE_ITEM_HEIGHT,
      transform: [{ translateY: translateY.value }],
    };
  });

  const innerStyle = useAnimatedStyle(() => {
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
    <Animated.View style={style}>
      <PanGestureHandler onGestureEvent={onGestureEvent} activateAfterLongPress={150}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <View
            style={{
              height: EXERCISE_ITEM_HEIGHT,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Animated.View style={[innerStyle, { ...shadows.base }]}>
              <Text style={{ fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.text.primary.normal }}>
                {templateExercise?.exercise?.name[0].toUpperCase()}
              </Text>
            </Animated.View>

            <View style={{ marginLeft: spacing.sm }}>
              <Text
                style={{
                  color: colors.text.primary.normal,
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                }}
              >
                {isLoading ? 'Loading...' : templateExercise?.exercise?.name}
              </Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}
