import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import type { TemplateSet } from '@podium/db';
import 'react-native-get-random-values';
import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import type { TemplateCreate, TemplateUpdate } from '@podium/api';

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
      templateUpdateMutation.mutate(template, {
        onSuccess: () => setTemplateSubmitted(true),
      });
    }
  };

  return (
    <ScrollView className="mb-lg space-y-lg">
      <View>
        {templateExerciseIds.map((templateExerciseId) => (
          <ExerciseCard key={templateExerciseId} templateExerciseId={templateExerciseId} />
        ))}
      </View>

      <View className="flex-row justify-center">
        <View />
        <Button
          loading={isTemplateNew ? templateCreateMutation.isLoading : templateUpdateMutation.isLoading}
          onPress={handleSubmit}
        >
          <Button.Text>Create Template</Button.Text>
        </Button>
      </View>
    </ScrollView>
  );
};

function ExerciseCard({ templateExerciseId }: { templateExerciseId: string }) {
  const { addTemplateSet } = useTemplateAPI();
  const { templateExercise, isLoading: isTemplateExerciseLoading } = useTemplateExercise(templateExerciseId);
  const templateSetIds = useTemplateSetIdsByTemplateExerciseId(templateExerciseId);

  return (
    <View className="mb-md space-y-md rounded-md bg-secondary p-md shadow">
      <View>
        <Text weight="medium" className="text-lg">
          {isTemplateExerciseLoading ? 'Loading...' : templateExercise?.exercise?.name}
        </Text>
      </View>

      <View>
        <View className="flex-[10] flex-row justify-between">
          <View className="flex-[1] items-center justify-center px-xs">
            <Text weight="medium" className="text-center text-base">
              Set
            </Text>
          </View>
          <View className="flex-[3] items-center justify-center px-xs">
            <Text weight="medium" className="text-center text-base">
              Type
            </Text>
          </View>
          <View className="flex-[4] items-center justify-center px-xs">
            <Text weight="medium" className="text-center text-base">
              Reps
            </Text>
          </View>
          <View className="flex-[2] items-center justify-center px-xs" />
        </View>

        <View className="space-y-md">
          {templateSetIds &&
            templateSetIds.map((setId, index) => (
              <View key={setId} className="flex-[10] flex-row justify-between space-x-xs">
                <ExerciseCardSet setId={setId} position={index} templateSetIdsLength={templateSetIds.length} />
              </View>
            ))}
        </View>
        <Anchor onPress={() => addTemplateSet(templateExerciseId)}>Add another set</Anchor>
      </View>
    </View>
  );
}

interface ExerciseCardSetProps {
  setId: string;
  position: number;
  /** Used to determine if delete button should be disabled or not */
  templateSetIdsLength: number;
}

function ExerciseCardSet({ setId, position, templateSetIdsLength }: ExerciseCardSetProps) {
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
      <View className="flex-[1] items-center justify-center">
        <Text weight="medium" className="text-sm">
          {position + 1}
        </Text>
      </View>

      <View className="flex-[3] items-center justify-center">
        <Pressable className="flex-row items-center" onPress={() => setIsTypeModalOpen(!isTypeModalOpen)}>
          <Text weight="medium" className="text-sm capitalize">
            {templateSet?.type}
          </Text>
          <ChevronDownIcon intent="primary" />
        </Pressable>
        <SetTypeChangeModal
          open={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onSetChange={(newSetType) => updateTemplateSet({ id: setId, type: newSetType })}
        />
      </View>

      <View className="flex-[4] items-center justify-center">
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

      <View className="flex-[2] items-center justify-center">
        <Button
          className="h-[30px] w-[46px] justify-center"
          intent="tertiary"
          onPress={() => removeTemplateSet(setId)}
          disabled={templateSetIdsLength === 1}
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
