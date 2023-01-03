import type { WorkoutExerciseWithExercise, WorkoutSet } from '@podium/db';
import type { WorkoutCreate, WorkoutUpdate } from '@podium/api';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Pressable, ScrollView, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { useMemo, useState } from 'react';
import { atom, useAtom } from 'jotai';

import { Button } from '@ui/buttons/Button';
import { Anchor } from '@ui/navigation/Anchor';
import { Dialog } from '@ui/overlays/Dialog';
import { Text } from '@ui/typography/Text';

import clsx from 'clsx';

import { MotiPressable } from 'moti/interactions';
import theme from '@podium/tailwindcss/theme';
import { styled } from 'nativewind';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { ActiveWorkoutTabParamList } from '../ActiveWorkout';
import { TrashIcon } from '@/assets/icons/mini/Trash';
import { ChevronDownIcon } from '@/assets/icons/mini/ChevronDown';
import {
  useWorkoutAPI,
  useWorkoutExercises,
  useWorkoutIsNew,
  useWorkoutSet,
  useWorkoutSetIdsByWorkoutExerciseId,
} from '@/stores/local/WorkoutProvider';
import { trpc } from '@/trpc';

const StyledMotiPressable = styled(MotiPressable);

type SetsAndRepsTabProps = BottomTabScreenProps<ActiveWorkoutTabParamList, 'SetsAndReps'>;

export const workoutSubmittedAtom = atom(false);

export const SetsAndRepsTab = (_: SetsAndRepsTabProps) => {
  const [, setWorkoutSubmitted] = useAtom(workoutSubmittedAtom);
  const workoutExercises = useWorkoutExercises();
  const isWorkoutNew = useWorkoutIsNew();
  const { getSubmittableWorkout } = useWorkoutAPI();

  const workoutCreateMutation = trpc.workout.create.useMutation();
  const workoutUpdateMutation = trpc.workout.update.useMutation();

  const handleSubmit = () => {
    if (isWorkoutNew) {
      const workout = getSubmittableWorkout() as WorkoutCreate;
      workoutCreateMutation.mutate(workout, {
        onSuccess: () => setWorkoutSubmitted(true),
      });
    } else {
      const workout = getSubmittableWorkout() as WorkoutUpdate;
      workoutUpdateMutation.mutate(workout, { onSuccess: () => setWorkoutSubmitted(true) });
    }
  };

  return (
    <BottomSheetScrollView className="my-base space-y-lg">
      <View>
        {Object.values(workoutExercises).map((workoutExercise) => (
          <ExerciseCard key={workoutExercise.id} workoutExercise={workoutExercise} />
        ))}
      </View>

      <View className="flex-row justify-between px-base pb-base">
        <View />
        <Button
          loading={isWorkoutNew ? workoutCreateMutation.isLoading : workoutUpdateMutation.isLoading}
          onPress={handleSubmit}
        >
          <Button.Text>
            {isWorkoutNew && (workoutCreateMutation.isLoading ? 'Creating Workout...' : 'Create Workout')}
            {!isWorkoutNew && (workoutUpdateMutation.isLoading ? 'Updating Workout...' : 'Update Workout')}
          </Button.Text>
        </Button>
      </View>
    </BottomSheetScrollView>
  );
};

function ExerciseCard({ workoutExercise }: { workoutExercise: WorkoutExerciseWithExercise }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { addWorkoutSet, removeWorkoutExercise } = useWorkoutAPI();
  const workoutSetIds = useWorkoutSetIdsByWorkoutExerciseId(workoutExercise.id)!;

  const handleWorkoutDelete = () => {
    removeWorkoutExercise(workoutExercise.id);
    setIsDeleteModalOpen(false);
  };

  const handleModalCancel = () => setIsDeleteModalOpen(false);

  return (
    <View
      className={clsx(
        'mx-base space-y-md rounded-md bg-secondary p-md shadow',
        workoutExercise.position > 0 && 'mt-base',
      )}
    >
      <View className="flex-row items-center justify-between">
        <Text weight="medium" className="text-lg">
          {workoutExercise.exercise.name}
        </Text>

        <Anchor intent="danger" onPress={() => setIsDeleteModalOpen(true)}>
          Delete
        </Anchor>

        <Dialog open={isDeleteModalOpen} onClose={handleModalCancel} intent="danger">
          <Dialog.Icon />
          <Dialog.Content>
            <Dialog.Title>Delete {`"${workoutExercise.exercise.name}"`}</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this exercise? This action cannot be undone.
            </Dialog.Description>
          </Dialog.Content>
          <Dialog.Actions>
            <Button intent="danger" onPress={handleWorkoutDelete}>
              <Button.Text>Delete</Button.Text>
            </Button>
            <Button intent="tertiary" onPress={handleModalCancel} className="mt-md">
              <Button.Text>Cancel</Button.Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>

      <View>
        <View className="flex-row pb-sm">
          <View className="w-[12%] items-center justify-center pr-md">
            <Text weight="medium" className="text-center text-sm">
              Set
            </Text>
          </View>

          <View className="w-[38%] items-center justify-center pr-md">
            <Text weight="medium" className="text-center text-sm">
              Weight (kg)
            </Text>
          </View>

          <View className="w-[38%] items-center justify-center pr-md">
            <Text weight="medium" className="text-center text-sm">
              Reps
            </Text>
          </View>

          <View className="w-[12%] items-center justify-center" />
        </View>

        <View className="space-y-md">
          {Array.from(workoutSetIds).map((workoutSetId) => (
            <View key={workoutSetId} className="flex-row justify-between">
              <ExerciseCardSet
                workoutSetId={workoutSetId}
                workoutSetIdsLength={workoutSetIds.size}
                handleWorkoutExerciseDelete={() => setIsDeleteModalOpen(true)}
              />
            </View>
          ))}
        </View>
        <View className="py-md">
          {workoutSetIds.size < 10 && (
            <Anchor onPress={() => addWorkoutSet(workoutExercise.id)}>Add another set</Anchor>
          )}
        </View>
      </View>
    </View>
  );
}

interface ExerciseCardSetProps {
  workoutSetId: string;
  /** Used to determine if delete button should be disabled or not */
  workoutSetIdsLength: number;
  handleWorkoutExerciseDelete: () => void;
}

function ExerciseCardSet({ workoutSetId, workoutSetIdsLength, handleWorkoutExerciseDelete }: ExerciseCardSetProps) {
  const workoutSet = useWorkoutSet(workoutSetId)!;
  const { updateWorkoutSet, removeWorkoutSet } = useWorkoutAPI();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  return (
    <View className="flex-row ">
      <View className="w-[12%] items-center justify-center pr-md">
        <Text weight="medium" className="text-sm capitalize">
          {workoutSet?.position + 1}
        </Text>
      </View>

      <View className="w-[38%] items-center justify-center pr-md">
        <TextInput
          className="w-full rounded-md bg-tertiary py-sm px-md text-center text-sm"
          maxLength={7}
          value={workoutSet?.weight}
          keyboardType="numeric"
          onChangeText={(value) => updateWorkoutSet({ id: workoutSet.id, weight: value })}
          onBlur={() => {
            updateWorkoutSet({
              id: workoutSet.id,
              weight: workoutSet.weight ? String(Math.abs(Number(workoutSet.weight))) ?? '' : '',
            });
          }}
        />
      </View>

      <View className="w-[38%] items-center justify-center pr-md">
        <TextInput
          className="w-full rounded-md bg-tertiary py-sm px-md text-center text-sm"
          maxLength={7}
          keyboardType="numeric"
          value={workoutSet?.reps}
          onChangeText={(value) => updateWorkoutSet({ id: workoutSet.id, reps: value })}
          onBlur={() => {
            updateWorkoutSet({
              id: workoutSet.id,
              reps: workoutSet.reps ? String(Math.abs(Number(workoutSet.reps))) ?? '' : '',
            });
          }}
        />
      </View>

      <View className="w-[12%] items-center justify-center">
        <StyledMotiPressable
          className="rounded-md px-md py-sm"
          style={{ borderWidth: 1 }}
          animate={useMemo(
            () =>
              ({ pressed }) => {
                'worklet';
                return {
                  backgroundColor: pressed
                    ? theme.backgroundColor.interactive.tertiary.active
                    : theme.backgroundColor.interactive.tertiary.normal,

                  borderColor: pressed
                    ? theme.borderColor.interactive.tertiary.active
                    : theme.borderColor.interactive.tertiary.normal,
                };
              },
            [],
          )}
          transition={{
            type: 'timing',
            duration: 100,
          }}
          onPress={() => {
            if (workoutSetIdsLength === 1) return handleWorkoutExerciseDelete();
            removeWorkoutSet(workoutSet.id);
          }}
        >
          <TrashIcon size="sm" />
        </StyledMotiPressable>
      </View>
    </View>
  );
}

// A record of the set types in the form of Record<SetType, SetLabel>
const setTypes: Record<WorkoutSet['type'], string> = {
  backoff: 'Backoff set',
  cooldown: 'Cooldown set',
  dropset: 'Dropset',
  failure: 'Till failure',
  warmup: 'Warmup set',
  working: 'Working set',
};
type WorkoutSetTypes = WorkoutSet['type'];

interface SetTypeChangeModalProps {
  open: boolean;
  onClose: () => void;
  onSetChange: (newSetType: WorkoutSetTypes) => void;
}

function SetTypeChangeModal({ open, onClose, onSetChange }: SetTypeChangeModalProps) {
  return (
    <Dialog open={open} onClose={onClose} position="center" fullWidth={false}>
      <View>
        {Object.values(setTypes).map((setType) => {
          return (
            <Pressable
              key={setType}
              className="flex-row items-center border border-divider py-md"
              onPress={() => {
                onSetChange(setType as WorkoutSetTypes);
                onClose();
              }}
            >
              <View className="mr-sm h-[32px] w-[32px] items-center justify-center rounded-full">
                <Text weight="medium" className="text-sm ">
                  {setType === 'working' ? 1 : setType[0]?.toUpperCase()}
                </Text>
              </View>
              <Text className="capitalize">{setTypes[setType as WorkoutSetTypes]}</Text>
            </Pressable>
          );
        })}
      </View>
    </Dialog>
  );
}
