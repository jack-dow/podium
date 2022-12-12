import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TemplateCreateSchema, TemplateUpdateSchema } from '../schemas/template';
import { ObjectWithId } from '../schemas/util';
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
    const promises = [];

    promises.push(
      prisma.$transaction([
        // Template
        prisma.template.update({
          where: { id: template.id },
          data: { name: template.name },
        }),
        prisma.templateExercise.deleteMany({
          where: { id: { in: templateExercises.deleted } },
        }),
        prisma.templateSet.deleteMany({
          where: { id: { in: templateSets.deleted } },
        }),
      ]),
    );

    async function createNewTemplateExercisesAndSets() {
      await prisma.templateExercise.deleteMany({
        where: { id: { in: templateExercises.deleted } },
      });
      prisma.templateSet.createMany({
        data: templateSets.new,
      });
    }

    promises.push(createNewTemplateExercisesAndSets());

    for (const updatedTemplateExercise of templateExercises.updated) {
      promises.push(
        prisma.templateExercise.update({
          where: { id: updatedTemplateExercise.id },
          data: updatedTemplateExercise,
        }),
      );
    }
    for (const updatedTemplateSet of templateSets.updated) {
      promises.push(
        prisma.templateSet.update({
          where: { id: updatedTemplateSet.id },
          data: updatedTemplateSet,
        }),
      );
    }

    await Promise.all(promises);
  }),
});
