import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ObjectWithId } from '../schemas/util';
import { publicProcedure, router } from '../trpc';

/**
 * Default selector for Workout Set.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultWorkoutSetSelect = Prisma.validator<Prisma.WorkoutSetSelect>()({
  id: true,
  workoutId: true,
  workoutExerciseId: true,
  createdAt: true,
  position: true,
  type: true,
  reps: true,
  userId: true,
});

export const workoutSetRouter = router({
  byId: publicProcedure.input(ObjectWithId).query(async ({ input }) => {
    const { id } = input;
    const workoutSet = await prisma.workoutSet.findUnique({
      where: { id },
      select: defaultWorkoutSetSelect,
    });

    if (!workoutSet) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No workout exercise with id '${id}'`,
      });
    }
    return workoutSet;
  }),

  byWorkoutId: publicProcedure.input(z.object({ workoutId: z.string() })).query(async ({ input }) => {
    const { workoutId } = input;
    const workoutSets = await prisma.workoutSet.findMany({
      where: { workoutId },
      select: defaultWorkoutSetSelect,
    });

    return workoutSets;
  }),

  byWorkoutExerciseId: publicProcedure.input(z.object({ workoutExerciseId: z.string() })).query(async ({ input }) => {
    const { workoutExerciseId } = input;
    const workoutSets = await prisma.workoutSet.findMany({
      where: { workoutExerciseId },
      select: defaultWorkoutSetSelect,
    });

    return workoutSets;
  }),
});
