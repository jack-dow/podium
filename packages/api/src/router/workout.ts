import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { WorkoutCreateSchema, WorkoutUpdateSchema } from '../schemas/workout';
import { Id, ObjectWithId } from '../schemas/util';
import { publicProcedure, router } from '../trpc';
import { defaultWorkoutExerciseSelect } from './workoutExercise';
import { defaultWorkoutSetSelect } from './workoutSet';

/**
 * Default selector for Workout.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultWorkoutSelect = Prisma.validator<Prisma.WorkoutSelect>()({
  id: true,
  name: true,
  createdAt: true,
  userId: true,
});

const workoutSelectWithRelations = {
  ...defaultWorkoutSelect,
  workoutExercises: { select: defaultWorkoutExerciseSelect },
  workoutSets: { select: defaultWorkoutSetSelect },
};

export const workoutRouter = router({
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

      const items = await prisma.workout.findMany({
        select: defaultWorkoutSelect,
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
    const workout = await prisma.workout.findUnique({
      where: { id },
      select: workoutSelectWithRelations,
    });

    if (!workout) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No workout with id '${id}'`,
      });
    }
    return workout;
  }),

  create: publicProcedure.input(WorkoutCreateSchema).mutation(async ({ input }) => {
    const { workoutExercises, workoutSets, ...workout } = input;

    await prisma.workout.create({
      data: workout,
    });
    await prisma.workoutExercise.createMany({
      data: workoutExercises,
    });
    await prisma.workoutSet.createMany({
      data: workoutSets,
    });
  }),

  update: publicProcedure.input(WorkoutUpdateSchema).mutation(async ({ input }) => {
    const { workoutExercises, workoutSets, ...workout } = input;
    const transactions = [];

    // Handle workout updates
    if (workout.name) {
      transactions.push(
        prisma.workout.update({
          where: { id: workout.id },
          data: { name: workout.name },
        }),
      );
    }

    // Handle workout exercise deletions
    if (workoutExercises.deleted) {
      transactions.push(
        prisma.workoutExercise.deleteMany({
          where: { id: { in: workoutExercises.deleted } },
        }),
      );
    }

    // Handle workout exercise updates
    for (const updatedTemplateExerciseId of workoutExercises.updated) {
      const updatedTemplateExercise = workoutExercises.all.find((el) => el.id === updatedTemplateExerciseId);

      if (updatedTemplateExercise) {
        transactions.push(
          prisma.workoutExercise.update({
            where: { id: updatedTemplateExercise.id },
            data: { notes: updatedTemplateExercise.notes, position: updatedTemplateExercise.position },
          }),
        );
      }
    }

    // Handle workout set deletions
    if (workoutSets.deleted) {
      transactions.push(
        prisma.workoutSet.deleteMany({
          where: { id: { in: workoutSets.deleted } },
        }),
      );
    }

    // Handle workout set updates
    for (const updatedTemplateSetId of workoutSets.updated) {
      const updatedTemplateSet = workoutSets.all.find((el) => el.id === updatedTemplateSetId);

      if (updatedTemplateSet) {
        transactions.push(
          prisma.workoutSet.update({
            where: { id: updatedTemplateSet.id },
            data: {
              reps: updatedTemplateSet.reps,
              position: updatedTemplateSet.position,
              type: updatedTemplateSet.type,
            },
          }),
        );
      }
    }

    // Handle workout exercise and set creations
    async function createNewTemplateExercisesAndSets() {
      if (workoutExercises.new) {
        await prisma.workoutExercise.createMany({
          data: workoutExercises.all.filter((el) => workoutExercises.new.includes(el.id)),
        });
      }
      if (workoutSets.new) {
        await prisma.workoutSet.createMany({
          data: workoutSets.all.filter((el) => workoutSets.new.includes(el.id)),
        });
      }
    }

    transactions.push(createNewTemplateExercisesAndSets());

    await Promise.all(transactions);
  }),

  delete: publicProcedure.input(Id).mutation(async ({ input: id }) => {
    await prisma.workout.delete({
      where: { id },
    });
  }),
});
