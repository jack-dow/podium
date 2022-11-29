import type { TemplateSet } from '@podium/db';
import { Text, View } from 'react-native';
import { createContext, useContext } from 'react';
import type { ExerciseId } from './ExercisesContext';
import createStore from '@/store';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import { Loader } from '@/components/ui/feedback/Loader';

type TemplateSetId = string;
// type TemplateId = string;

interface TemplateSetsContextProps {
  getTemplateSets?(): TemplateSetId[];
  getTemplateSet?(templateSetId: TemplateSetId): TemplateSet | null;
  addTemplateSet?(templateSet: TemplateSet): void;
  getExerciseTemplateSets?(exerciseId: ExerciseId): TemplateSetId[] | null;
}

const TemplateSetsContext = createContext<TemplateSetsContextProps>({});

interface TemplateSetsState {
  all: Record<TemplateSetId, TemplateSet>;
  byExerciseId: Record<ExerciseId, Array<TemplateSetId>>;

  updated: Array<TemplateSetId>;
  deleted: Array<TemplateSetId>;
}

interface TemplateSetsProviderProps {
  templateSets: TemplateSet[];
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
}

export function TemplateSetsProvider({ children, templateSets, isLoading, isError }: TemplateSetsProviderProps) {
  const store = createStore<TemplateSetsState>({ all: {}, byExerciseId: {}, updated: [], deleted: [] });

  function addTemplateSet(templateSet: TemplateSet) {
    store.setState((state) => {
      const { id, exerciseId } = templateSet;
      state.all[id] = templateSet;

      if (!(exerciseId in state.byExerciseId)) state.byExerciseId[exerciseId] = [];
      state.byExerciseId[exerciseId].push(id);

      state.updated.push(id);
    });
  }

  function getTemplateSets() {
    const templateSets = store.useStore((state) => state.all);

    return Object.keys(templateSets);
  }

  function getTemplateSet(templateSetId: TemplateSetId): TemplateSet | null {
    const templateSets = store.useStore((state) => state.all);

    if (templateSetId in templateSets) return templateSets[templateSetId];

    return null;
  }

  function getExerciseTemplateSets(exerciseId: ExerciseId): TemplateSetId[] | null {
    const byExerciseId = store.useStore((state) => state.byExerciseId);
    return byExerciseId[exerciseId] ?? null;
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <Text>An unknown error occurred...</Text>
        </View>
      </SafeAreaView>
    );
  }

  for (const templateSet of templateSets) {
    store.setState((state) => {
      const { id, exerciseId } = templateSet;
      state.all[id] = templateSet;

      if (!(exerciseId in state.byExerciseId)) state.byExerciseId[exerciseId] = [];
      state.byExerciseId[exerciseId].push(id);
    });
  }

  return (
    <TemplateSetsContext.Provider value={{ getTemplateSets, getTemplateSet, addTemplateSet, getExerciseTemplateSets }}>
      {children}
    </TemplateSetsContext.Provider>
  );
}

const noProviderError =
  '[Template Sets Context] A template sets context hook was called without a provider present above in the tree. Please fix this.';

export function useTemplateSets(): ExerciseId[] {
  const { getTemplateSets } = useContext(TemplateSetsContext);

  if (!getTemplateSets) throw new Error(noProviderError);

  return getTemplateSets();
}

export function useTemplateSet(templateSetId: TemplateSetId): TemplateSet | null {
  const { getTemplateSet } = useContext(TemplateSetsContext);

  if (!getTemplateSet) throw new Error(noProviderError);

  return getTemplateSet(templateSetId);
}

export function useAddTemplateSet(templateSet: TemplateSet): void {
  const { addTemplateSet } = useContext(TemplateSetsContext);

  if (!addTemplateSet) throw new Error(noProviderError);

  addTemplateSet(templateSet);
}

export function useExerciseTemplateSets(exerciseId: ExerciseId): TemplateSetId[] | null {
  const { getExerciseTemplateSets } = useContext(TemplateSetsContext);

  if (!getExerciseTemplateSets) throw new Error(noProviderError);

  return getExerciseTemplateSets(exerciseId);
}
