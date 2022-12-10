import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { atom, useAtom } from 'jotai';

import { Input } from '@ui/inputs/Input';
import { Button } from '@ui/buttons/Button';
import { Alert } from '@ui/feedback/Alert';

import { ExerciseSelectBottomSheet } from './BottomSheet';
import { ExerciseSelectList } from './SelectList';
import { useTemplateAPI, useTemplateExerciseIds, useTemplateName } from '@/stores/local/TemplateProvider';
import type { TabNavigationParamList } from '@/screens/TemplateEditor';
import { Label } from '@/components/ui/inputs/Label';

type ExerciseSelectTabProps = BottomTabScreenProps<TabNavigationParamList, 'ExerciseSelect'>;

export const stepsCompletedAtom = atom(0);

export const ExerciseSelectTab = ({ route, navigation }: ExerciseSelectTabProps) => {
  const name = useTemplateName();
  const { setName } = useTemplateAPI();
  const exercises = useTemplateExerciseIds();

  const [, setStepsCompleted] = useAtom(stepsCompletedAtom);

  const [nameError, setNameError] = useState<string | null>(null);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  useEffect(() => {
    if (!name || exercises.length === 0) {
      setStepsCompleted(0);
    }
  }, [name, exercises.length, setStepsCompleted]);

  useEffect(() => {
    if (exercisesError && exercises.length > 0) setExercisesError(null);
  }, [exercises.length, exercisesError]);

  const handleNextStepPress = () => {
    // Handling errors
    if (!name) {
      setNameError('Please enter a name for your template.');
      return;
    }
    if (exercises.length === 0) {
      setExercisesError('Please select at least one exercise.');
      return;
    }

    // If no errors, go to next step
    if (!nameError && !exercisesError) {
      setStepsCompleted(1);
      navigation.navigate('SetsAndReps', { isTemplateNew: route.params.isTemplateNew });
    }
  };

  return (
    <ScrollView className="space-y-lg">
      {/* Displaying errors */}
      {(nameError || exercisesError) && (
        <Alert intent="danger">
          <Alert.Title>There&apos;s a problem with your template</Alert.Title>
          <Alert.Content>
            {nameError && <Alert.ListItem>{nameError}</Alert.ListItem>}
            {exercisesError && <Alert.ListItem>{exercisesError}</Alert.ListItem>}
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

      <ExerciseSelectBottomSheet />

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
