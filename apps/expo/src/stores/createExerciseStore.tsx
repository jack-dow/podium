import type { Exercise } from '@podium/db';
import createStore from '@/store';

type ExerciseId = string;
interface ExerciseStore {
  /** Store of all exercises in a id/exercise key/value pair */
  all: Record<ExerciseId, Exercise>;

  /** An id array of all the new or updated exercises */
  updated: ExerciseId[];

  /** An id array of all the deleted exercises */
  deleted: ExerciseId[];
}

export function createExerciseStore() {
  const store = createStore<ExerciseStore>({ all: {}, updated: [], deleted: [] });

  function addExercise(exercise: Exercise): ExerciseStore {
    return store.setState((draft) => {
      const { id } = exercise;
      draft.all[id] = exercise;
    });
  }

  function getExercises(): ExerciseStore['all'] {
    const exercises = store.useStore((state) => state.all);
    return exercises;
  }

  function getExercise(exerciseId: ExerciseId): Exercise | null {
    const exercise = store.useStore((state) => state.all[exerciseId] ?? null);
    return exercise;
  }

  return { useStore: store.useStore, getExercises, getExercise, addExercise };
}
