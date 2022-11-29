import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StylesAsProp } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { NewTemplateSet, set } from '@podium/db';
import 'react-native-get-random-values';

import { useImmer } from 'use-immer';
import { createContext, useContext, useEffect, useState } from 'react';
import type { TabNavigationParamList } from './index';
import { Button } from '@/components/ui/buttons/Button';
import type { ExerciseId } from '@/contexts/ExercisesContext';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';
import { trpc } from '@/utils/trpc';
import { Anchor } from '@/components/ui/navigation/Anchor';
import { TrashIcon } from '@/assets/icons/mini/Trash';
import {
  useTemplateAPI,
  useTemplateExercise,
  useTemplateExerciseIds,
  useTemplateSet,
  useTemplateSetIds,
  useTemplateSetIdsByTemplateExerciseId,
  useTemplateSubmissionInformation,
} from '@/providers/FullTemplateProvider';
import { ChevronDownIcon } from '@/assets/icons/mini/ChevronDown';
import { Modal } from '@/components/ui/overlays/Modal';
import { Dialog } from '@/components/ui/overlays/Dialog';
import { useAuthSession } from '@/stores/global/auth';

type SetsAndRepsTabProps = BottomTabScreenProps<TabNavigationParamList, 'SetsAndReps'>;

export const SetsAndRepsTab = ({ navigation }: SetsAndRepsTabProps) => {
  const userId = useAuthSession()!.user.id;
  const template = useTemplateSubmissionInformation();
  const templateExerciseIds = useTemplateExerciseIds();
  const theme = useTheme();

  const templateUpsertMutation = trpc.template.upsert.useMutation();

  const templateExerciseCreateMutation = trpc.templateExercise.createMany.useMutation();
  const templateExerciseUpdateMutation = trpc.templateExercise.updateMany.useMutation();
  const templateExerciseDeleteMutation = trpc.templateExercise.deleteMany.useMutation();

  const templateSetCreateMutation = trpc.templateSet.createMany.useMutation();
  const templateSetUpdateMutation = trpc.templateSet.updateMany.useMutation();
  const templateSetDeleteMutation = trpc.templateSet.deleteMany.useMutation();

  const isLoading =
    templateUpsertMutation.isLoading ||
    templateExerciseCreateMutation.isLoading ||
    templateExerciseUpdateMutation.isLoading ||
    templateExerciseDeleteMutation.isLoading ||
    templateSetCreateMutation.isLoading ||
    templateSetUpdateMutation.isLoading ||
    templateSetDeleteMutation.isLoading;

  function handleSubmit() {
    templateUpsertMutation.mutate({ id: template.id, name: template.name, userId });

    templateExerciseCreateMutation.mutate(Object.values(template.templateExercise.new));
    templateExerciseUpdateMutation.mutate(Object.values(template.templateExercise.updated));
    templateExerciseDeleteMutation.mutate(template.templateExercise.deleted);

    templateSetCreateMutation.mutate(Object.values(template.templateSet.new));
    templateSetUpdateMutation.mutate(Object.values(template.templateSet.updated));
    templateSetDeleteMutation.mutate(template.templateSet.deleted);
  }

  return (
    <ScrollView style={{ marginBottom: theme.spacing.lg }}>
      <View style={{ marginBottom: theme.spacing.lg }}>
        {templateExerciseIds.map((templateExerciseId) => (
          <ExerciseCard key={templateExerciseId} templateExerciseId={templateExerciseId} />
        ))}
      </View>

      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <View />
        <Button loading={isLoading} onPress={handleSubmit}>
          <Button.Text>Create Template</Button.Text>
        </Button>
      </View>
    </ScrollView>
  );
};

function ExerciseCard({ templateExerciseId }: { templateExerciseId: ExerciseId }) {
  const { addTemplateSet } = useTemplateAPI();
  const { templateExercise, isLoading: isTemplateExerciseLoading } = useTemplateExercise(templateExerciseId);
  const templateSetIds = useTemplateSetIdsByTemplateExerciseId(templateExerciseId);

  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View
      style={{
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background.secondary,
        marginBottom: theme.spacing.md,
        borderRadius: theme.radii.md,
        ...theme.shadows.base,
      }}
    >
      <View style={{ marginBottom: theme.spacing.md }}>
        <Text style={{ fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.medium }}>
          {isTemplateExerciseLoading ? 'Loading...' : templateExercise?.exercise?.name}
        </Text>
      </View>
      <View>
        <View style={[styles.grid, { marginBottom: theme.spacing.md }]}>
          <View style={[styles.set, styles.row]}>
            <Text style={[styles.subheading]}>Set</Text>
          </View>
          <View style={[styles.type, styles.row]}>
            <Text style={[styles.subheading]}>Type</Text>
          </View>
          <View style={[styles.reps, styles.row]}>
            <Text style={[styles.subheading]}>Reps</Text>
          </View>
          <View style={[styles.delete, styles.row]} />
        </View>
        <View style={{ marginBottom: theme.spacing.sm }}>
          {templateSetIds &&
            templateSetIds.map((setId, index) => (
              <View key={setId} style={[styles.grid, { marginBottom: theme.spacing.md }]}>
                <ExerciseCardSet setId={setId} position={index} />
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
}

function ExerciseCardSet({ setId, position }: ExerciseCardSetProps) {
  const numOfSets = useTemplateSetIds().length;
  const { removeTemplateSet } = useTemplateAPI();
  const { templateSet, isLoading, isError, setTemplateSet } = useTemplateSet(setId);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const theme = useTheme();
  const styles = useStyles(theme);
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
      <View style={[styles.set, styles.row]}>
        <Text style={{ fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.medium }}>{position + 1}</Text>
      </View>
      <View style={[styles.type, styles.row]}>
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setIsTypeModalOpen(!isTypeModalOpen)}
        >
          <Text
            style={{
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontWeights.medium,
              textTransform: 'capitalize',
            }}
          >
            {templateSet?.type}
          </Text>

          <ChevronDownIcon variant="primary" />
        </Pressable>
        <SetTypeChangeModal
          open={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onSetChange={(newSetType) => setTemplateSet({ type: newSetType })}
        />
      </View>
      <View style={[styles.reps, styles.row]}>
        <TextInput
          placeholder="10-12"
          style={{
            width: '100%',
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.radii.md,
            fontSize: theme.fontSizes.sm,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            textAlign: 'center',
          }}
          maxLength={7}
          value={templateSet?.reps}
          onChangeText={(value) => setTemplateSet({ reps: value })}
          onBlur={() => {
            const validInput = templateSet?.reps.match(/^([0-9]+-)?([0-9]+)$/);
            if (validInput && validInput.length > 0) return setTemplateSet({ reps: validInput[0] });
            setTemplateSet({ reps: '' });
          }}
        />
      </View>
      <View style={[styles.delete, styles.row]}>
        <Button
          style={{ justifyContent: 'center', width: 46, height: 30 }}
          variant="tertiary"
          size="sm"
          onPress={() => removeTemplateSet(setId)}
          disabled={numOfSets === 1}
        >
          <TrashIcon size="sm" />
        </Button>
      </View>
    </>
  );
}

interface SetTypeChangeModalProps {
  open: boolean;
  onClose: () => void;
  onSetChange: (newSerType: keyof typeof set) => void;
}

function SetTypeChangeModal({ open, onClose, onSetChange }: SetTypeChangeModalProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  const sets = Object.keys(theme.colors.sets) as Array<keyof Theme['colors']['sets']>;
  return (
    <Dialog open={open} onClose={onClose} position="center" fullWidth={false}>
      <View>
        {sets.map((setType) => {
          return (
            <Pressable
              key={setType}
              style={[styles.dialogItem]}
              onPress={() => {
                onSetChange(setType);
                onClose();
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.sets[setType].background,
                  width: 32,
                  height: 32,
                  borderRadius: theme.radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',

                  marginRight: theme.spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontWeights.medium,
                    color: theme.colors.sets[setType].text,
                  }}
                >
                  {setType === 'working' ? 1 : setType[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ textTransform: 'capitalize' }}>{setType} Set</Text>
            </Pressable>
          );
        })}
      </View>
    </Dialog>
  );
}

const useStyles = (theme: Theme) => {
  return StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flex: 9,
      justifyContent: 'space-between',
    },
    subheading: {
      textAlign: 'center',
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
    },
    set: {
      flex: 1,
    },
    type: {
      flex: 3,
    },
    reps: {
      flex: 4,
    },
    delete: {
      flex: 2,
    },
    row: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
    dialogItem: {
      paddingVertical: theme.spacing.md,
      borderBottomWidth: theme.borderWeights.light,
      borderBottomColor: theme.colors.border.divider,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};
