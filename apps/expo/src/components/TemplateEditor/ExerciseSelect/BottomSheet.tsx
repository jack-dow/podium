import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ViewProps } from 'react-native';
import { Pressable, View } from 'react-native';
import type { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import GorhomBottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { styled } from 'nativewind';
import type { Exercise } from '@podium/db';

import { Input } from '@ui/inputs/Input';
import { Button } from '@ui/buttons/Button';
import { Loader } from '@ui/feedback/Loader';
import { Text } from '@ui/typography/Text';
import { Checkbox } from '@ui/inputs/Checkbox';
import { trpc } from '@/trpc';

import { useTemplateAPI, useTemplateExercisesIdsByExerciseId } from '@/stores/local/TemplateProvider';
import { SearchIcon } from '@/assets/icons/mini/Search';

const StyledBackdrop = styled(BottomSheetBackdrop);

const BottomSheet = ({ style }: { style?: ViewProps['style'] }) => {
  const { data, isLoading, isError } = trpc.exercise.all.useQuery({ limit: 50 });
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const handleSheetOpen = useCallback(() => {
    ref.current?.expand();
    setIsOpen(true);
  }, []);

  const handleSheetChanges = useCallback((_index: number) => {
    // console.log(index);
  }, []);

  const handleSheetClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <StyledBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} className="bg-overlay" />;
  }, []);

  return (
    <View style={style}>
      <Button onPress={handleSheetOpen}>
        <Button.Text>Select Exercises</Button.Text>
      </Button>

      <Portal>
        <GorhomBottomSheet
          ref={ref}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onClose={handleSheetClose}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <BottomSheetScrollView className="mb-lg p-base">
            <View className="flex-row items-center">
              <Input placeholder="Search exercises" rightIcon={<SearchIcon />} className="mr-md h-[42px] flex-1" />
              <Button onPress={() => ref?.current?.close()} className="h-[42px]">
                <Button.Text>Add</Button.Text>
              </Button>
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

            {data?.items.map((exercise) => {
              return <ExerciseSelectBottomSheetItem key={exercise.id} exercise={exercise} isSheetOpen={isOpen} />;
            })}
          </BottomSheetScrollView>
        </GorhomBottomSheet>
      </Portal>
    </View>
  );
};

interface ExerciseSelectBottomSheetItemProps {
  exercise: Exercise;
  isSheetOpen: boolean;
}
function ExerciseSelectBottomSheetItem({ exercise, isSheetOpen }: ExerciseSelectBottomSheetItemProps) {
  const templateExerciseIds = useTemplateExercisesIdsByExerciseId(exercise.id);
  const { addTemplateExercise, removeTemplateExercise } = useTemplateAPI();

  const [isSelected, setIsSelected] = useState(false);

  const handleItemPress = () => {
    if (isSelected) {
      if (templateExerciseIds && templateExerciseIds.length > 0) {
        removeTemplateExercise(templateExerciseIds[templateExerciseIds.length - 1] ?? '');
      }
      setIsSelected(false);
    } else {
      addTemplateExercise(exercise.id);
      setIsSelected(true);
    }
  };

  useEffect(() => {
    if (!isSheetOpen) {
      setIsSelected(false);
    }
  }, [isSheetOpen]);

  return (
    <View className="flex-row items-center justify-between border-b border-primary-normal">
      <Pressable onPress={handleItemPress} className="flex-1 py-base">
        <Text>{exercise.name}</Text>
      </Pressable>
      <Checkbox size="sm" checked={isSelected} onPress={handleItemPress} />
    </View>
  );
}

export const ExerciseSelectBottomSheet = styled(BottomSheet);
