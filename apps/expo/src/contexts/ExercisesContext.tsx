import type { Exercise } from '@podium/db';
import { Text, View } from 'react-native';
import { createContext, useContext } from 'react';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import { Loader } from '@/components/ui/feedback/Loader';
import createStore from '@/store';

export type ExerciseId = string;

interface ExercisesContextProps {
  getExercises?(): ExerciseId[];
  getExercise?(exerciseId: ExerciseId): Exercise | null;
}

const ExercisesContext = createContext<ExercisesContextProps>({});

interface ExercisesState {
  /** Store of all exercises in a id/exercise key/value pair */
  all: Record<ExerciseId, Exercise>;

  /** An id array of all the new or updated exercises */
  updated: ExerciseId[];

  /** An id array of all the deleted exercises */
  deleted: ExerciseId[];
}

interface ExercisesProviderProps {
  exercises: Exercise[];
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
}

export function ExercisesProvider({ children, exercises, isLoading, isError }: ExercisesProviderProps) {
  const store = createStore<ExercisesState>({ all: {}, updated: [], deleted: [] });

  function getExercises() {
    const exercises = store.useStore((state) => state.all);

    return Object.keys(exercises);
  }

  function getExercise(exerciseId: ExerciseId): Exercise | null {
    const exercises = store.useStore((state) => state.all);

    if (exerciseId in exercises) return exercises[exerciseId];

    return null;
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

  for (const exercise of exercises) {
    store.setState((draft) => {
      const { id } = exercise;
      draft.all[id] = exercise;
    });
  }

  return <ExercisesContext.Provider value={{ getExercise, getExercises }}>{children}</ExercisesContext.Provider>;
}

const noProviderError =
  '[Exercises Context] An exercises context hook was called without a provider present above in the tree. Please fix this.';

export function useExercises(): ExerciseId[] {
  const { getExercises } = useContext(ExercisesContext);

  if (!getExercises) throw new Error(noProviderError);

  return getExercises();
}

export function useExercise(exerciseId: ExerciseId): Exercise | null {
  const { getExercise } = useContext(ExercisesContext);

  if (!getExercise) throw new Error(noProviderError);

  return getExercise(exerciseId);
}
