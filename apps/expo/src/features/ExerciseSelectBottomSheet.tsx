import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import { MotiView } from "moti";
import { MotiPressable, useMotiPressable } from "moti/interactions";
import { styled } from "nativewind";
import type { Exercise } from "@podium/expo-api";
import theme from "@podium/tailwind-config/theme";

import { BottomSheet, Loader, Text } from "~/ui";
import { useExercises } from "~/api";
import { MinusSmallIcon, PlusSmallIcon, SearchIcon } from "~/assets/icons/mini";

const StyledMotiPressable = styled(MotiPressable);
const StyledMotiView = styled(MotiView);

type ExerciseSelectBottomSheetRootProps = {
  renderItem: (exercises: Exercise) => JSX.Element;
  visible: boolean;
  hide: () => void;
};

const ExerciseSelectBottomSheetRoot = ({ renderItem, visible, hide }: ExerciseSelectBottomSheetRootProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: exercises, isLoading, isError } = useExercises();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(null);

  const ref = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (exercises && exercises.length > 0 && filteredExercises === null) {
      setFilteredExercises(exercises);
    }
  }, [exercises, filteredExercises]);

  const handleSearchInput = (text: string) => {
    setSearchTerm(text);
    setFilteredExercises(exercises?.filter((e) => e.name.toLowerCase().includes(text.toLowerCase())) ?? []);
  };

  useEffect(() => {
    if (visible) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet snapPoints={["35%", "65%"]} ref={ref} hide={hide}>
      <BottomSheet.Container scrollView>
        <View className="flex-row items-center pb-md">
          <BottomSheet.Input
            placeholder="Search exercises"
            rightIcon={<SearchIcon />}
            value={searchTerm}
            onChangeText={handleSearchInput}
            className="mr-md h-[42px] flex-1"
          />
        </View>

        {isLoading && (
          <View className="my-md items-center">
            <Loader />
          </View>
        )}

        {isError && (
          <View className="my-md">
            <Text>An unknown error occurred...</Text>
          </View>
        )}

        {filteredExercises && filteredExercises.map((exercise) => renderItem(exercise))}
      </BottomSheet.Container>
    </BottomSheet>
  );
};

type BottomSheetItemProps = {
  value: number;
  onCreatePress: (exercise: Exercise, value: number) => void;
  onDeletePress: (exerciseId: string, value: number) => void;
  exercise: Exercise;
};

function BottomSheetItem({ value, onCreatePress, onDeletePress, exercise }: BottomSheetItemProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-primary-normal">
      <Text weight="medium">{exercise.name}</Text>

      <View className="items-baseline bg-white p-md">
        <View className="flex-row overflow-hidden rounded-lg bg-tertiary shadow-inner">
          <StyledMotiPressable onPress={() => onDeletePress(exercise.id, value)} className="bg-transparent p-sm pr-md">
            <AddDeleteButtonChild>
              <MinusSmallIcon muted />
            </AddDeleteButtonChild>
          </StyledMotiPressable>

          <View className="items-center justify-center">
            <Text weight="semibold" className="text-base text-primary-normal">
              {value}
            </Text>
          </View>

          <StyledMotiPressable onPress={() => onCreatePress(exercise, value)} className="bg-transparent p-sm pl-md">
            <AddDeleteButtonChild>
              <PlusSmallIcon muted />
            </AddDeleteButtonChild>
          </StyledMotiPressable>
        </View>
      </View>
    </View>
  );
}

function AddDeleteButtonChild({ children }: { children: React.ReactNode }) {
  const state = useMotiPressable(({ pressed }) => {
    "worklet";

    return {
      backgroundColor: pressed ? theme.backgroundColor.interactive.tertiary.active : theme.backgroundColor.white,
    };
  }, []);
  return (
    <StyledMotiView
      state={state}
      transition={{ type: "timing", duration: 150 }}
      className="h-lg w-lg items-center justify-center rounded-md shadow"
    >
      {children}
    </StyledMotiView>
  );
}

export const ExerciseSelectBottomSheet = Object.assign(ExerciseSelectBottomSheetRoot, {
  Item: BottomSheetItem,
});
