// src/server/router/index.ts
import { TRPCError } from '@trpc/server';
import { t } from '../trpc';

import { exercisesRouter } from './exercises';
import { profilesRouter } from './profiles';

export const appRouter = t.router({
  exercises: exercisesRouter,
  profiles: profilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
