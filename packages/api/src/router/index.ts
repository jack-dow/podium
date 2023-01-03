import { router } from '../trpc';

import { exerciseRouter } from './exercise';

import { profileRouter } from './profile';

import { templateRouter } from './template';
import { templateExerciseRouter } from './templateExercise';
import { templateSetRouter } from './templateSet';

import { workoutRouter } from './workout';
import { workoutExerciseRouter } from './workoutExercise';
import { workoutSetRouter } from './workoutSet';

export const appRouter = router({
  exercise: exerciseRouter,
  profile: profileRouter,
  template: templateRouter,
  templateExercise: templateExerciseRouter,
  templateSet: templateSetRouter,
  workout: workoutRouter,
  workoutExercise: workoutExerciseRouter,
  workoutSet: workoutSetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
