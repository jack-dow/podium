import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { View } from 'react-native';
import type { Exercise } from '@podium/db';
import { atom, useAtom } from 'jotai';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ExerciseSelectList } from './SelectList';
import { Label } from '@/components/ui/inputs/Label';
import { ExerciseSelectBottomSheet } from '@/components/ExerciseSelectBottomSheet';
import {
  useWorkoutAPI,
  useWorkoutExerciseIdsByExerciseId,
  useWorkoutExercises,
  useWorkoutName,
} from '@/stores/local/WorkoutProvider';
import type { ActiveWorkoutTabParamList } from '@/components/ActiveWorkout';
import { Button } from '@/components/ui/buttons/Button';
import { BottomSheetInput } from '@/components/ui/inputs/BottomSheetInput';
import { Alert } from '@/components/ui/feedback/Alert';

export const activeWorkoutStepsCompletedAtom = atom(0);

type ExerciseSelectTabProps = BottomTabScreenProps<ActiveWorkoutTabParamList, 'ExerciseSelect'>;

export function ExercisePreview({ navigation, route }: ExerciseSelectTabProps) {
  const name = useWorkoutName();
  const { setName } = useWorkoutAPI();
  const workoutExercises = useWorkoutExercises();

  const [nameError, setNameError] = useState<string | null>(null);
  const [workoutExercisesError, setExercisesError] = useState<string | null>(null);

  const [, setStepsCompleted] = useAtom(activeWorkoutStepsCompletedAtom);

  const handleNextStepPress = () => {
    // Handling errors
    if (!name) {
      setNameError('Please enter a name for your workout.');
      return;
    }
    if (workoutExercises.length === 0) {
      setExercisesError('Please select at least one exercise.');
      return;
    }

    // If no errors, go to next step
    if (!nameError && !workoutExercisesError) {
      setStepsCompleted(1);
      navigation.navigate('SetsAndReps', { isWorkoutNew: route.params.isWorkoutNew });
    }
  };

  return (
    <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }} className="my-base flex-1 space-y-lg px-base">
      {/* Displaying errors */}
      {(nameError || workoutExercisesError) && (
        <Alert intent="danger">
          <Alert.Title>There&apos;s a problem with your workout</Alert.Title>
          <Alert.Content>
            {nameError && <Alert.ListItem>{nameError}</Alert.ListItem>}
            {workoutExercisesError && <Alert.ListItem>{workoutExercisesError}</Alert.ListItem>}
          </Alert.Content>
        </Alert>
      )}

      <View>
        <Label>Name</Label>
        <BottomSheetInput
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (nameError) setNameError(null);
          }}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <ExerciseSelectBottomSheet
        renderItem={(exercise) => <ExerciseSelectBottomSheetItem key={exercise.id} exercise={exercise} />}
      />

      <ExerciseSelectList />

      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <View />
        <Button onPress={handleNextStepPress}>
          <Button.Text>Next Step</Button.Text>
        </Button>
      </View>
    </BottomSheetScrollView>
  );
}

function ExerciseSelectBottomSheetItem({ exercise }: { exercise: Exercise }) {
  const workoutExerciseIds = useWorkoutExerciseIdsByExerciseId(exercise.id);
  const { addWorkoutExercise, removeWorkoutExercise } = useWorkoutAPI();

  const handleAddPress = () => {
    if (!workoutExerciseIds || (workoutExerciseIds && workoutExerciseIds.size < 10)) addWorkoutExercise(exercise);
  };

  const handleDeletePress = () => {
    if (workoutExerciseIds && workoutExerciseIds.size > 0) {
      removeWorkoutExercise(Array.from(workoutExerciseIds)[workoutExerciseIds.size - 1] ?? '');
    }
  };

  return (
    <ExerciseSelectBottomSheet.Item
      value={workoutExerciseIds?.size ?? 0}
      exercise={exercise}
      onAddPress={handleAddPress}
      onDeletePress={handleDeletePress}
    />
  );
}
