import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { atom, useAtom } from 'jotai';

import { Input } from '@ui/inputs/Input';
import { Button } from '@ui/buttons/Button';
import { Alert } from '@ui/feedback/Alert';

import type { Exercise } from '@podium/db';
import { ExerciseSelectList } from './SelectList';

import type { TemplateEditorTabParamList } from '@/screens/TemplateEditor';

import {
  useTemplateAPI,
  useTemplateExerciseIdsByExerciseId,
  useTemplateExercises,
  useTemplateName,
} from '@/stores/local/TemplateProvider';
import { Label } from '@/components/ui/inputs/Label';
import { ExerciseSelectBottomSheet } from '@/components/ExerciseSelectBottomSheet';

type ExerciseSelectTabProps = BottomTabScreenProps<TemplateEditorTabParamList, 'ExerciseSelect'>;

export const stepsCompletedAtom = atom(0);

export const ExerciseSelectTab = ({ route, navigation }: ExerciseSelectTabProps) => {
  const name = useTemplateName();
  const { setName } = useTemplateAPI();
  const templateExerciseIds = useTemplateExercises();

  const [, setStepsCompleted] = useAtom(stepsCompletedAtom);

  const [nameError, setNameError] = useState<string | null>(null);
  const [templateExercisesError, setExercisesError] = useState<string | null>(null);

  useEffect(() => {
    if (!name || templateExerciseIds.length === 0) {
      setStepsCompleted(0);
    } else if (name && templateExerciseIds.length > 0) {
      setStepsCompleted(1);
    }
  }, [name, templateExerciseIds.length, setStepsCompleted]);

  useEffect(() => {
    if (templateExercisesError && templateExerciseIds.length > 0) setExercisesError(null);
  }, [templateExerciseIds.length, templateExercisesError]);

  const handleNextStepPress = () => {
    // Handling errors
    if (!name) {
      setNameError('Please enter a name for your template.');
      return;
    }
    if (templateExerciseIds.length === 0) {
      setExercisesError('Please select at least one exercise.');
      return;
    }

    // If no errors, go to next step
    if (!nameError && !templateExercisesError) {
      setStepsCompleted(1);
      navigation.navigate('SetsAndReps', { isTemplateNew: route.params.isTemplateNew });
    }
  };

  return (
    <ScrollView className="my-base space-y-lg px-base">
      {/* Displaying errors */}
      {(nameError || templateExercisesError) && (
        <Alert intent="danger">
          <Alert.Title>There&apos;s a problem with your template</Alert.Title>
          <Alert.Content>
            {nameError && <Alert.ListItem>{nameError}</Alert.ListItem>}
            {templateExercisesError && <Alert.ListItem>{templateExercisesError}</Alert.ListItem>}
          </Alert.Content>
        </Alert>
      )}

      <View>
        <Label>Name</Label>
        <Input
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
    </ScrollView>
  );
};

function ExerciseSelectBottomSheetItem({ exercise }: { exercise: Exercise }) {
  const templateExerciseIds = useTemplateExerciseIdsByExerciseId(exercise.id);
  const { addTemplateExercise, removeTemplateExercise } = useTemplateAPI();

  const handleAddPress = () => {
    if (!templateExerciseIds || (templateExerciseIds && templateExerciseIds.size < 10)) addTemplateExercise(exercise);
  };

  const handleDeletePress = () => {
    if (templateExerciseIds && templateExerciseIds.size > 0) {
      removeTemplateExercise(Array.from(templateExerciseIds)[templateExerciseIds.size - 1] ?? '');
    }
  };
  return (
    <ExerciseSelectBottomSheet.Item
      value={templateExerciseIds?.size ?? 0}
      exercise={exercise}
      onAddPress={handleAddPress}
      onDeletePress={handleDeletePress}
    />
  );
}
