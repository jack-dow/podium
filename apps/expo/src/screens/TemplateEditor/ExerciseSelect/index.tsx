import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, ScrollView, View } from 'react-native';

import { atom, useAtom } from 'jotai';
import type { TabNavigationParamList } from '../index';

import { ExerciseSelectBottomSheet } from './ExerciseSelectBottomSheet';
import { ExerciseSelectList } from './ExerciseSelectList';
import { useTheme } from '@/themes';

import { Input } from '@/components/inputs/Input';
import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/buttons/Button';
import { useTemplateAPI, useTemplateExerciseIds, useTemplateName } from '@/providers/FullTemplateProvider';

type ExerciseSelectTabProps = BottomTabScreenProps<TabNavigationParamList, 'ExerciseSelect'>;

export const stepsCompletedAtom = atom(0);

export const ExerciseSelectTab = ({ navigation }: ExerciseSelectTabProps) => {
  const name = useTemplateName();
  const { setName } = useTemplateAPI();
  const [, setStepsCompleted] = useAtom(stepsCompletedAtom);
  const exercises = useTemplateExerciseIds();

  const { spacing } = useTheme();

  const handleNextStepPress = () => {
    setStepsCompleted(1);
    navigation.navigate('SetsAndReps');
  };

  return (
    <ScrollView style={{ marginBottom: spacing.lg }}>
      {/* Displaying errors */}
      {/* {Object.keys(formErrors).length > 0 && (
        <Alert title="There's a problem with your template" style={{ marginBottom: spacing.lg }}>
          <FlatList
            data={Object.keys(formErrors)}
            renderItem={({ item }) => {
              return <Alert.ListItem>{formErrors[item as keyof typeof formErrors]?.message}</Alert.ListItem>;
            }}
          />
        </Alert>
      )} */}

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        blurOnSubmit={false}
        style={{ marginBottom: spacing.lg }}
      />

      <ExerciseSelectBottomSheet />

      <ExerciseSelectList />

      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <View />
        <Button disabled={!name || exercises.length === 0} onPress={handleNextStepPress}>
          <Button.Text>Next Step</Button.Text>
        </Button>
      </View>
    </ScrollView>
  );
};
