import type { BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Portal } from '@gorhom/portal';

import type { Exercise } from '@podium/db';
import { useTheme } from '@/themes';
import { Input } from '@/components/ui/inputs/Input';
import { Button } from '@/components/ui/buttons/Button';
import { SearchIcon } from '@/assets/icons/mini/Search';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { trpc } from '@/utils/trpc';
import { Loader } from '@/components/ui/feedback/Loader';
import { useTemplateAPI, useTemplateExercisesIdsByExerciseId } from '@/providers/FullTemplateProvider';

export const ExerciseSelectBottomSheet = () => {
  const { data, isLoading, isError } = trpc.exercise.all.useQuery({ limit: 50 });
  const [isOpen, setIsOpen] = useState(false);

  const { spacing, colors } = useTheme();

  const ref = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const handleSheetOpen = useCallback(() => {
    ref.current?.expand();
    setIsOpen(true);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log(index);
  }, []);

  const handleSheetClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      return (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          style={[props.style, { backgroundColor: colors.background.overlay }]}
        />
      );
    },
    [colors.background.overlay],
  );

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Button onPress={handleSheetOpen}>
        <Button.Text>Select Exercises</Button.Text>
      </Button>
      <Portal>
        <BottomSheet
          ref={ref}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onClose={handleSheetClose}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <BottomSheetScrollView style={{ padding: spacing.base, marginBottom: spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Input
                placeholder="Search exercises"
                rightIcon={<SearchIcon />}
                style={{ flex: 1, marginRight: spacing.md }}
                styles={{
                  input: { height: 42 },
                }}
              />
              <Button onPress={() => ref?.current?.close()} style={{ height: 42 }}>
                <Button.Text>Add</Button.Text>
              </Button>
            </View>

            {isLoading && (
              <View style={{ justifyContent: 'center', marginVertical: spacing.md }}>
                <Loader />
              </View>
            )}

            {isError && (
              <View>
                <Text>An unknown error occurred...</Text>
              </View>
            )}

            {data?.items.map((exercise) => {
              return <ExerciseSelectBottomSheetItem key={exercise.id} exercise={exercise} isSheetOpen={isOpen} />;
            })}
          </BottomSheetScrollView>
        </BottomSheet>
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

  const { spacing, colors, borderWeights } = useTheme();

  const handleItemPress = () => {
    if (isSelected) {
      if (templateExerciseIds && templateExerciseIds.length > 0) {
        removeTemplateExercise(templateExerciseIds[templateExerciseIds.length - 1]);
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
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: borderWeights.light,
        borderBottomColor: colors.border.primary.normal,
      }}
    >
      <Pressable onPress={handleItemPress} style={{ flex: 1, paddingVertical: spacing.base }}>
        <Text>{exercise.name}</Text>
      </Pressable>
      <Checkbox size="sm" checked={isSelected} onPress={handleItemPress} />
    </View>
  );
}
