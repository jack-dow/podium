import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ObjectWithId } from '../schemas/util';
import { publicProcedure, router } from '../trpc';
import { defaultExerciseSelect } from './exercise';

/**
 * Default selector for Workout Exercise.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultWorkoutExerciseSelect = Prisma.validator<Prisma.WorkoutExerciseSelect>()({
  id: true,
  workoutId: true,
  exerciseId: true,
  createdAt: true,
  position: true,
  notes: true,
  userId: true,
  exercise: { select: defaultExerciseSelect },
});

export const workoutExerciseRouter = router({
  byId: publicProcedure.input(ObjectWithId).query(async ({ input }) => {
    const { id } = input;
    const workoutExercise = await prisma.workoutExercise.findUnique({
      where: { id },
      select: defaultWorkoutExerciseSelect,
    });

    if (!workoutExercise) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No workout exercise with id '${id}'`,
      });
    }
    return workoutExercise;
  }),

  byWorkoutId: publicProcedure.input(z.object({ workoutId: z.string() })).query(async ({ input }) => {
    const { workoutId } = input;
    const workoutExercise = await prisma.workoutExercise.findMany({
      where: { workoutId },
      select: defaultWorkoutExerciseSelect,
    });

    return workoutExercise;
  }),
});
