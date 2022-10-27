import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../trpc';

/**
 * Default selector for Users.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultExerciseSelect = Prisma.validator<Prisma.exercisesSelect>()({
  id: true,
  name: true,
  created_at: true,
  instructions: true,
  user: true,
});

export const exercisesRouter = t.router({
  all: t.procedure
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

      const items = await prisma.exercises.findMany({
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
          created_at: 'desc',
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

  byId: t.procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const exercise = await prisma.exercises.findUnique({
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

  create: t.procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        user: z.string().uuid(),
        name: z.string().min(1).max(64),
        instructions: z.string().min(0).max(400).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const exercise = await prisma.exercises.create({
        data: input,
        select: defaultExerciseSelect,
      });
      return exercise;
    }),

  update: t.procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        user: z.string().uuid().optional(),
        name: z.string().min(1).max(64).optional(),
        instructions: z.string().min(0).max(400).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const updatedExercise = await prisma.exercises.update({
        where: { id: input.id },
        data: input,
        select: defaultExerciseSelect,
      });
      return updatedExercise;
    }),

  delete: t.procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedExercise = await prisma.exercises.delete({
        where: { id: input.id },
        select: defaultExerciseSelect,
      });
      return deletedExercise;
    }),
});
