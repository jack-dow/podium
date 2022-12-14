import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ExerciseCreateSchema, ExerciseUpdateSchema } from '../schemas/exercise';
import { ObjectWithId } from '../schemas/util';
import { publicProcedure, router } from '../trpc';

/**
 * Default selector for Exercise.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultExerciseSelect = Prisma.validator<Prisma.ExerciseSelect>()({
  id: true,
  name: true,
  createdAt: true,
  instructions: true,
  userId: true,
});

export const exerciseRouter = router({
  all: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.exercise.findMany({
        select: defaultExerciseSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'asc',
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),

  byId: publicProcedure.input(ObjectWithId).query(async ({ input }) => {
    const { id } = input;

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      select: defaultExerciseSelect,
    });

    if (!exercise) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No exercise found with id '${id}'`,
      });
    }
    return exercise;
  }),

  create: publicProcedure.input(ExerciseCreateSchema).mutation(async ({ input }) => {
    const exercise = await prisma.exercise.create({
      data: input,
      select: defaultExerciseSelect,
    });

    return exercise;
  }),

  update: publicProcedure.input(ExerciseUpdateSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input;
    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: updates,
      select: defaultExerciseSelect,
    });

    return updatedExercise;
  }),

  delete: publicProcedure.input(z.string().uuid()).mutation(async ({ input: id }) => {
    await prisma.exercise.delete({ where: { id } });
  }),
});
