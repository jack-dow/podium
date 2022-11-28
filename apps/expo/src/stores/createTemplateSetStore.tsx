import type { NewTemplateSet, TemplateSet } from '@podium/db';
import createStore from '@/store';

type TemplateSetId = string;
type ExerciseId = string;

interface TemplateSetStore {
  all: Record<TemplateSetId, TemplateSet | NewTemplateSet>;
  byExerciseId: Record<ExerciseId, Array<TemplateSetId>>;

  updated: Array<TemplateSetId>;
  deleted: Array<TemplateSetId>;
}

export function createTemplateSetStore() {
  const store = createStore<TemplateSetStore>({ all: {}, byExerciseId: {}, updated: [], deleted: [] });

  function addTemplateSet(templateSet: NewTemplateSet) {
    store.setState((draft) => {
      const { id, exerciseId } = templateSet;

      draft.all[id] = templateSet;
      if (!draft.byExerciseId[exerciseId]) draft.byExerciseId[exerciseId] = [];
      draft.byExerciseId[exerciseId].push(id);
      draft.updated.push(id);
    });
  }

  function getExerciseTemplateSets(exerciseId: ExerciseId): (TemplateSet | NewTemplateSet)[] | null {
    const templateSets = store.useStore((state) => state.byExerciseId[exerciseId]?.map((id) => state.all[id]) ?? null);
    return templateSets;
  }

  return { useStore: store.useStore, getExerciseTemplateSets, addTemplateSet };
}
