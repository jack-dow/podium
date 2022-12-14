import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TemplateCreateSchema, TemplateUpdateSchema } from '../schemas/template';
import { Id, ObjectWithId } from '../schemas/util';
import { publicProcedure, router } from '../trpc';
import { defaultTemplateExerciseSelect } from './templateExercise';
import { defaultTemplateSetSelect } from './templateSet';

/**
 * Default selector for Template.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultTemplateSelect = Prisma.validator<Prisma.TemplateSelect>()({
  id: true,
  name: true,
  createdAt: true,
  userId: true,
});

const templateSelectWithRelations = {
  ...defaultTemplateSelect,
  templateExercises: { select: defaultTemplateExerciseSelect },
  templateSets: { select: defaultTemplateSetSelect },
};

export const templateRouter = router({
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

      const items = await prisma.template.findMany({
        select: defaultTemplateSelect,
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
    const template = await prisma.template.findUnique({
      where: { id },
      select: templateSelectWithRelations,
    });

    if (!template) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No template with id '${id}'`,
      });
    }
    return template;
  }),

  create: publicProcedure.input(TemplateCreateSchema).mutation(async ({ input }) => {
    const { templateExercises, templateSets, ...template } = input;

    await prisma.template.create({
      data: template,
    });
    await prisma.templateExercise.createMany({
      data: templateExercises,
    });
    await prisma.templateSet.createMany({
      data: templateSets,
    });
  }),

  update: publicProcedure.input(TemplateUpdateSchema).mutation(async ({ input }) => {
    const { templateExercises, templateSets, ...template } = input;
    const transactions = [];

    // Handle template updates
    if (template.name) {
      transactions.push(
        prisma.template.update({
          where: { id: template.id },
          data: { name: template.name },
        }),
      );
    }

    // Handle template exercise deletions
    if (templateExercises.deleted) {
      transactions.push(
        prisma.templateExercise.deleteMany({
          where: { id: { in: templateExercises.deleted } },
        }),
      );
    }

    // Handle template exercise updates
    for (const updatedTemplateExerciseId of templateExercises.updated) {
      const updatedTemplateExercise = templateExercises.all.find((el) => el.id === updatedTemplateExerciseId);

      if (updatedTemplateExercise) {
        transactions.push(
          prisma.templateExercise.update({
            where: { id: updatedTemplateExercise.id },
            data: { notes: updatedTemplateExercise.notes, position: updatedTemplateExercise.position },
          }),
        );
      }
    }

    // Handle template set deletions
    if (templateSets.deleted) {
      transactions.push(
        prisma.templateSet.deleteMany({
          where: { id: { in: templateSets.deleted } },
        }),
      );
    }

    // Handle template set updates
    for (const updatedTemplateSetId of templateSets.updated) {
      const updatedTemplateSet = templateSets.all.find((el) => el.id === updatedTemplateSetId);

      if (updatedTemplateSet) {
        transactions.push(
          prisma.templateSet.update({
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

    // Handle template exercise and set creations
    async function createNewTemplateExercisesAndSets() {
      if (templateExercises.new) {
        await prisma.templateExercise.createMany({
          data: templateExercises.all.filter((el) => templateExercises.new.includes(el.id)),
        });
      }
      if (templateSets.new) {
        await prisma.templateSet.createMany({
          data: templateSets.all.filter((el) => templateSets.new.includes(el.id)),
        });
      }
    }

    transactions.push(createNewTemplateExercisesAndSets());

    await Promise.all(transactions);
  }),

  delete: publicProcedure.input(Id).mutation(async ({ input: id }) => {
    await prisma.template.delete({
      where: { id },
    });
  }),
});
