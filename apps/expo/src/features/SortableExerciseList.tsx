import { useEffect, type RefObject } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { PanGestureHandler, type PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
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
  type SharedValue,
} from "react-native-reanimated";
import { styled } from "nativewind";

import { Text } from "~/ui";

const EXERCISE_ITEM_HEIGHT = 64;
const EXERCISE_ITEM_GUTTER = 24;
const EXERCISE_ITEM_HEIGHT_WITH_GUTTER = EXERCISE_ITEM_HEIGHT + EXERCISE_ITEM_GUTTER;

function clamp(value: number, lowerBound: number, upperBound: number) {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

type RequiredExerciseProps = {
  id: string;
  order: number;
  name: string;
};

type SortableExerciseListProps = {
  style?: ViewProps["style"];
  exerciseIds: Array<string>;
  useExercise: (exerciseId: string) => RequiredExerciseProps | null;
  onDragEnd: (newOrder: Record<string, number>) => void;
};

function SortableExerciseListRoot({ style, exerciseIds, useExercise, onDragEnd }: SortableExerciseListProps) {
  const order = useSharedValue<Record<string, number>>(
    exerciseIds.reduce((acc, exerciseId, index) => {
      acc[exerciseId] = index;
      return acc;
    }, {} as Record<string, number>),
  );

  // Update the animated order when a template exercise gets added or removed
  useEffect(() => {
    if (Object.keys(exerciseIds).length !== Object.keys(order.value).length) {
      order.value = exerciseIds.reduce((acc, exerciseId, index) => {
        acc[exerciseId] = index;
        return acc;
      }, {} as Record<string, number>);
    }
  }, [exerciseIds, order]);

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

  if (exerciseIds.length === 0) return <View />;

  return (
    <View style={style}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="relative"
        contentContainerStyle={{ height: exerciseIds.length * EXERCISE_ITEM_HEIGHT_WITH_GUTTER }}
      >
        <View
          className="absolute w-px border-r border-divider pl-xl"
          style={{ height: exerciseIds.length * EXERCISE_ITEM_HEIGHT_WITH_GUTTER - EXERCISE_ITEM_GUTTER }}
        />

        {exerciseIds.map((exerciseId) => (
          <MoveableExerciseItem
            order={order}
            key={exerciseId}
            exerciseId={exerciseId}
            useExercise={useExercise}
            scrollViewRef={scrollViewRef}
            scrollY={scrollY}
            onDragEnd={onDragEnd}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

type MoveableExerciseItemProps = {
  order: SharedValue<Record<string, number>>;
  scrollY: SharedValue<number>;
  exerciseId: string;
  useExercise: (exerciseId: string) => RequiredExerciseProps | null;
  scrollViewRef: RefObject<Animated.ScrollView>;
  onDragEnd: (newOrder: Record<string, number>) => void;
};
function MoveableExerciseItem({ order, useExercise, exerciseId, onDragEnd }: MoveableExerciseItemProps) {
  // Don't access exercise within Reanimated worklet. It will cause an error.
  const exercise = useExercise(exerciseId);
  const isGestureActive = useSharedValue(false);
  const translateY = useSharedValue(
    exercise ? (order.value[exercise.id] || exercise.order) * EXERCISE_ITEM_HEIGHT_WITH_GUTTER : 0,
  );

  const animationConfig = {
    easing: Easing.inOut(Easing.ease),
    duration: 200,
  };

  useAnimatedReaction(
    () => order.value[exerciseId],
    (newOrder = 0) => {
      if (!isGestureActive.value) {
        translateY.value = withTiming(newOrder * EXERCISE_ITEM_HEIGHT_WITH_GUTTER, animationConfig);
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

      const newOrder = clamp(
        Math.floor(translateY.value / EXERCISE_ITEM_HEIGHT_WITH_GUTTER),
        0,
        Object.keys(order.value).length - 1,
      );
      const oldPosition = order.value[exerciseId]!;

      if (newOrder !== oldPosition) {
        const idToSwap = Object.keys(order.value).find((key) => order.value[key] === newOrder);
        if (idToSwap) {
          // Spread operator is not supported in worklets
          // And Object.assign doesn't seem to be working on alpha.6
          const newOrderObj = { ...order.value };
          newOrderObj[exerciseId] = newOrder;
          newOrderObj[idToSwap] = oldPosition;
          order.value = newOrderObj;
        }
      }
    },
    onFinish() {
      const newOrder = order.value[exerciseId]! * EXERCISE_ITEM_HEIGHT_WITH_GUTTER;
      translateY.value = withTiming(newOrder, animationConfig, () => (isGestureActive.value = false));
      runOnJS(onDragEnd)(order.value);
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
      backgroundColor: "#fff",
      marginHorizontal: 4,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,

      opacity: isGestureActive.value ? 0.75 : 1,
    };
  });

  return (
    <Animated.View className="absolute top-none left-none w-4/5" style={animatedContainerStyle}>
      <PanGestureHandler onGestureEvent={onGestureEvent} activateAfterLongPress={150}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <View className="flex-row items-center" style={{ height: EXERCISE_ITEM_HEIGHT }}>
            <Animated.View className="shadow" style={animatedCardStyle}>
              <Text weight="bold" className="text-xl text-primary-normal">
                {exercise?.name[0]?.toUpperCase()}
              </Text>
            </Animated.View>

            <View className="ml-sm">
              <Text weight="semibold" className="text-base text-primary-normal">
                {exercise?.name} - {exercise?.order}
              </Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

export const SortableExerciseList = styled(SortableExerciseListRoot);
