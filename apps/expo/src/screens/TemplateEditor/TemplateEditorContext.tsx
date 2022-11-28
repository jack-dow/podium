import type { Template, TemplateExercise } from '@podium/db';

import { createContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { ExerciseId } from '@/contexts/ExercisesContext';

type Position = number;
export type TemplateExercisesPositions = Record<ExerciseId, Position>;
export type TemplateExercises = Record<ExerciseId, TemplateExercise>;

interface TemplateEditorContextProps extends Partial<Template> {
  id: string;
  /** Variable used to determine what steps should be enabled/disabled */
  stepsCompleted: number;
  setStepsCompleted(newStepsCompleted: number): void;

  /** Reanimated 2 shared values which is an object with exerciseId/position key/value pairs */
  positions: SharedValue<TemplateExercisesPositions>;
  addExercise(exerciseId: ExerciseId): void;
  removeExercise(exerciseId: ExerciseId): void;
  syncExercisePositions(positions: SharedValue<TemplateExercisesPositions>): void;

  exercises: ExerciseId[];

  // /** Array of selected exercises in their correct order. */
  // exercises: ExerciseId[];
}

export const TemplateEditorContext = createContext<TemplateEditorContextProps>({
  id: '',
  stepsCompleted: 0,
  setStepsCompleted: () => {},

  exercises: [],
  positions: { value: {} },
  addExercise: () => {},
  removeExercise: () => {},
  syncExercisePositions: () => {},
});
