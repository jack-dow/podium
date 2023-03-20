import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Prisma, prisma } from "../prisma";
import { Id } from "../schema-utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  TemplateExerciseCreateSchema,
  TemplateExerciseSchema,
  defaultTemplateExerciseSelect,
} from "./templateExercise";
import { TemplateSetCreateSchema, TemplateSetSchema, defaultTemplateSetSelect } from "./templateSet";

const TemplateName = z.string().min(1).max(64);

export const TemplateCreateSchema = z.object({
  id: Id,
  userId: Id.optional(),
  name: TemplateName,
  templateExercises: z.array(TemplateExerciseSchema),
  templateSets: z.array(TemplateSetSchema),
});

/**
 * Default selector for Template.
 *
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultTemplateSelect = Prisma.validator<Prisma.TemplateSelect>()({
  id: true,
  name: true,
  createdAt: true,
  userId: true,
});

export const TemplateUpdateSchema = z.object({
  id: Id,
  userId: Id.optional(),
  name: TemplateName.optional(),
  templateExercises: z.object({
    new: z.array(TemplateExerciseSchema),
    updated: z.array(TemplateExerciseSchema),
    deleted: z.array(Id),
  }),
  templateSets: z.object({
    new: z.array(TemplateSetSchema),
    updated: z.array(TemplateSetSchema),
    deleted: z.array(Id),
  }),
});

const templateSelectWithRelations = {
  ...defaultTemplateSelect,
  templateExercises: { select: defaultTemplateExerciseSelect },
  templateSets: { select: defaultTemplateSetSelect },
};

/** Template router definition */
export const templateRouter = createTRPCRouter({
  list: publicProcedure
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
          createdAt: "asc",
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

  get: publicProcedure.input(z.object({ id: Id })).query(async ({ input }) => {
    const { id } = input;
    const template = await prisma.template.findUnique({
      where: { id },
      select: templateSelectWithRelations,
    });

    if (!template) {
      throw new TRPCError({
        code: "NOT_FOUND",
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

    const templateExerciseInserts = [];
    for (const templateExercise of templateExercises) {
      templateExerciseInserts.push(
        prisma.templateExercise.create({ data: TemplateExerciseCreateSchema.parse(templateExercise) }),
      );
    }
    await prisma.$transaction(templateExerciseInserts);

    const templateSetInserts = [];
    for (const templateSet of templateSets) {
      templateSetInserts.push(prisma.templateSet.create({ data: TemplateSetCreateSchema.parse(templateSet) }));
    }
    await prisma.$transaction(templateSetInserts);
  }),

  update: publicProcedure.input(TemplateUpdateSchema).mutation(async ({ input }) => {
    const { templateExercises, templateSets, ...template } = input;

    // Handle template updates
    if (template.name) {
      await prisma.template.update({ where: { id: template.id }, data: { name: template.name } });
    }

    // Handle template exercise deletions
    if (templateExercises.deleted) {
      await prisma.templateExercise.deleteMany({ where: { id: { in: templateExercises.deleted } } });
    }

    // Handle template exercise updates
    const templateExerciseUpdates = [];
    for (const updatedTemplateExercise of templateExercises.updated) {
      templateExerciseUpdates.push(
        prisma.templateExercise.update({
          where: { id: updatedTemplateExercise.id },
          data: { notes: updatedTemplateExercise.notes, order: updatedTemplateExercise.order },
        }),
      );
    }

    await prisma.$transaction(templateExerciseUpdates);

    // Handle template set deletions
    if (templateSets.deleted) {
      await prisma.templateSet.deleteMany({ where: { id: { in: templateSets.deleted } } });
    }

    // Handle template set updates
    const templateSetUpdates = [];
    for (const updatedTemplateSet of templateSets.updated) {
      templateSetUpdates.push(
        prisma.templateSet.update({
          where: { id: updatedTemplateSet.id },
          data: {
            repetitions: updatedTemplateSet.repetitions,
            order: updatedTemplateSet.order,
            type: updatedTemplateSet.type,
          },
        }),
      );
    }

    await prisma.$transaction(templateSetUpdates);

    // Handle template exercise creations
    if (templateExercises.new) {
      const templateExerciseInserts = [];
      for (const templateExercise of templateExercises.new) {
        templateExerciseInserts.push(
          prisma.templateExercise.create({ data: TemplateExerciseCreateSchema.parse(templateExercise) }),
        );
      }
      await prisma.$transaction(templateExerciseInserts);
    }

    // Handle template set creations
    if (templateSets.new) {
      const templateSetInserts = [];
      for (const templateSet of templateSets.new) {
        templateSetInserts.push(prisma.templateSet.create({ data: TemplateSetCreateSchema.parse(templateSet) }));
      }
      await prisma.$transaction(templateSetInserts);
    }
  }),

  delete: publicProcedure.input(Id).mutation(async ({ input: id }) => {
    await prisma.template.delete({ where: { id } });
  }),
});
