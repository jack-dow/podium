import { router } from '../trpc';
import { exerciseRouter } from './exercise';
import { profileRouter } from './profile';
import { templateExerciseRouter } from './templateExercise';
import { templateRouter } from './template';
import { templateSetRouter } from './templateSet';

export const appRouter = router({
  exercise: exerciseRouter,
  profile: profileRouter,
  template: templateRouter,
  templateExercise: templateExerciseRouter,
  templateSet: templateSetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
