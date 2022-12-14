import type { TemplateSet } from '@podium/db';
import type { TemplateCreate, TemplateUpdate } from '@podium/api';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Pressable, ScrollView, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { useState } from 'react';
import { atom, useAtom } from 'jotai';

import { Button } from '@ui/buttons/Button';
import { Anchor } from '@ui/navigation/Anchor';
import { Dialog } from '@ui/overlays/Dialog';
import { Text } from '@ui/typography/Text';

import type { TabNavigationParamList } from '@/screens/TemplateEditor';

import { TrashIcon } from '@/assets/icons/mini/Trash';
import { ChevronDownIcon } from '@/assets/icons/mini/ChevronDown';
import {
  useTemplateAPI,
  useTemplateExercise,
  useTemplateExerciseIds,
  useTemplateIsNew,
  useTemplateSet,
  useTemplateSetIdsByTemplateExerciseId,
} from '@/stores/local/TemplateProvider';
import { trpc } from '@/trpc';

type SetsAndRepsTabProps = BottomTabScreenProps<TabNavigationParamList, 'SetsAndReps'>;

export const templateSubmittedAtom = atom(false);

export const SetsAndRepsTab = (_: SetsAndRepsTabProps) => {
  const [, setTemplateSubmitted] = useAtom(templateSubmittedAtom);
  const templateExerciseIds = useTemplateExerciseIds();
  const isTemplateNew = useTemplateIsNew();
  const { getSubmittableTemplate } = useTemplateAPI();

  const templateCreateMutation = trpc.template.create.useMutation();
  const templateUpdateMutation = trpc.template.update.useMutation();

  const handleSubmit = () => {
    if (isTemplateNew) {
      const template = getSubmittableTemplate() as TemplateCreate;
      templateCreateMutation.mutate(template, {
        onSuccess: () => setTemplateSubmitted(true),
      });
    } else {
      const template = getSubmittableTemplate() as TemplateUpdate;
      templateUpdateMutation.mutate(template, { onSuccess: () => setTemplateSubmitted(true) });
    }
  };

  return (
    <ScrollView className="mb-lg space-y-lg">
      <View>
        {templateExerciseIds.map((templateExerciseId) => (
          <ExerciseCard key={templateExerciseId} templateExerciseId={templateExerciseId} />
        ))}
      </View>

      <View className="flex-row justify-between">
        <View />
        <Button
          loading={isTemplateNew ? templateCreateMutation.isLoading : templateUpdateMutation.isLoading}
          onPress={handleSubmit}
        >
          <Button.Text>
            {isTemplateNew && (templateCreateMutation.isLoading ? 'Creating Template...' : 'Create Template')}
            {!isTemplateNew && (templateUpdateMutation.isLoading ? 'Updating Template...' : 'Update Template')}
          </Button.Text>
        </Button>
      </View>
    </ScrollView>
  );
};

function ExerciseCard({ templateExerciseId }: { templateExerciseId: string }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { addTemplateSet, removeTemplateExercise } = useTemplateAPI();
  const { templateExercise, isLoading: isTemplateExerciseLoading } = useTemplateExercise(templateExerciseId);
  const templateSetIds = useTemplateSetIdsByTemplateExerciseId(templateExerciseId);

  const handleTemplateDelete = () => {
    removeTemplateExercise(templateExerciseId);
    setIsDeleteModalOpen(false);
  };

  const handleModalCancel = () => setIsDeleteModalOpen(false);

  return (
    <View className="mb-md space-y-md rounded-md bg-secondary p-md shadow">
      <View className="flex-row items-center justify-between">
        <Text weight="medium" className="text-lg">
          {isTemplateExerciseLoading ? 'Loading...' : templateExercise?.exercise?.name}
        </Text>

        <Anchor intent="danger" onPress={() => setIsDeleteModalOpen(true)}>
          Delete
        </Anchor>

        <Dialog open={isDeleteModalOpen} onClose={handleModalCancel} intent="danger">
          <Dialog.Icon />
          <Dialog.Content>
            <Dialog.Title>
              Delete {templateExercise?.exercise?.name ? `"${templateExercise.exercise.name}"` : 'Template Exercise'}
            </Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this exercise? This action cannot be undone.
            </Dialog.Description>
          </Dialog.Content>
          <Dialog.Actions>
            <Button intent="danger" onPress={handleTemplateDelete}>
              <Button.Text>Delete</Button.Text>
            </Button>
            <Button intent="tertiary" onPress={handleModalCancel} className="mt-md">
              <Button.Text>Cancel</Button.Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>

      <View>
        <View className="flex-row justify-between pb-sm">
          <View className="w-[10%] items-center justify-center">
            <Text weight="medium" className="text-center text-base">
              Set
            </Text>
          </View>
          <View className="w-[30%] items-center justify-center">
            <Text weight="medium" className="text-center text-base">
              Type
            </Text>
          </View>
          <View className="w-[40%] items-center justify-center">
            <Text weight="medium" className="text-center text-base">
              Reps
            </Text>
          </View>
          <View className="w-[20%] items-center justify-center" />
        </View>

        <View className="space-y-md">
          {templateSetIds &&
            templateSetIds.map((setId, index) => (
              <View key={setId} className="flex-row justify-between">
                <ExerciseCardSet
                  setId={setId}
                  position={index}
                  templateSetIdsLength={templateSetIds.length}
                  handleTemplateExerciseDelete={() => setIsDeleteModalOpen(true)}
                />
              </View>
            ))}
        </View>
        <View className="py-md">
          {!templateSetIds ||
            (templateSetIds && templateSetIds.length < 10 && (
              <Anchor onPress={() => addTemplateSet(templateExerciseId)}>Add another set</Anchor>
            ))}
        </View>
      </View>
    </View>
  );
}

interface ExerciseCardSetProps {
  setId: string;
  position: number;
  /** Used to determine if delete button should be disabled or not */
  templateSetIdsLength: number;
  handleTemplateExerciseDelete: () => void;
}

function ExerciseCardSet({
  setId,
  position,
  templateSetIdsLength,
  handleTemplateExerciseDelete,
}: ExerciseCardSetProps) {
  const { updateTemplateSet, removeTemplateSet } = useTemplateAPI();
  const { templateSet, isLoading, isError } = useTemplateSet(setId);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  if (isLoading) {
    <View>
      <Text>Loading...</Text>
    </View>;
  }

  if (isError) {
    <View>
      <Text>An error occurred...</Text>
    </View>;
  }

  return (
    <>
      <View className="w-[10%] items-center justify-center">
        <Text weight="medium" className="text-sm">
          {position + 1}
        </Text>
      </View>

      <View className="w-[30%] items-center justify-center">
        <Text weight="medium" className="text-sm capitalize">
          {templateSet?.type}
        </Text>
        {/* <Pressable className="flex-row items-center" onPress={() => setIsTypeModalOpen(!isTypeModalOpen)}>
          <Text weight="medium" className="text-sm capitalize">
            {templateSet?.type}
          </Text>
          <ChevronDownIcon intent="primary" />
        </Pressable> */}
        {/* <SetTypeChangeModal
          open={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onSetChange={(newSetType) => updateTemplateSet({ id: setId, type: newSetType })}
        /> */}
      </View>

      <View className="w-[40%] items-center justify-center">
        <TextInput
          placeholder="10-12"
          className="w-full rounded-md bg-tertiary py-sm px-md text-center text-sm"
          maxLength={7}
          value={templateSet?.reps}
          onChangeText={(value) => updateTemplateSet({ id: setId, reps: value })}
          onBlur={() => {
            const validInput = templateSet?.reps?.match(/^([0-9]+-)?([0-9]+)$/);
            if (validInput && validInput.length > 0) return updateTemplateSet({ id: setId, reps: validInput[0] });
            updateTemplateSet({ id: setId, reps: '' });
          }}
        />
      </View>

      <View className="w-[20%] items-center justify-center">
        <Button
          className="h-[30px] w-[46px] justify-center"
          intent="tertiary"
          onPress={() => {
            if (templateSetIdsLength === 1) return handleTemplateExerciseDelete();
            removeTemplateSet(setId);
          }}
        >
          <TrashIcon size="sm" />
        </Button>
      </View>
    </>
  );
}

// A record of the set types in the form of Record<SetType, SetLabel>
const setTypes: Record<TemplateSet['type'], string> = {
  backoff: 'Backoff set',
  cooldown: 'Cooldown set',
  dropset: 'Dropset',
  failure: 'Till failure',
  warmup: 'Warmup set',
  working: 'Working set',
};
type TemplateSetTypes = TemplateSet['type'];

interface SetTypeChangeModalProps {
  open: boolean;
  onClose: () => void;
  onSetChange: (newSetType: TemplateSetTypes) => void;
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
                onSetChange(setType as TemplateSetTypes);
                onClose();
              }}
            >
              <View className="mr-sm h-[32px] w-[32px] items-center justify-center rounded-full">
                <Text weight="medium" className="text-sm ">
                  {setType === 'working' ? 1 : setType[0]?.toUpperCase()}
                </Text>
              </View>
              <Text className="capitalize">{setTypes[setType as TemplateSetTypes]}</Text>
            </Pressable>
          );
        })}
      </View>
    </Dialog>
  );
}
