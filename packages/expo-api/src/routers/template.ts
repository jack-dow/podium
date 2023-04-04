import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Prisma, prisma } from "../prisma";
import { Id } from "../schema-utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  TemplateExerciseCreateSchema,
  TemplateExerciseSchema,
  TemplateExerciseUpdateSchema,
  defaultTemplateExerciseSelect,
} from "./templateExercise";
import {
  TemplateSetCreateSchema,
  TemplateSetSchema,
  TemplateSetUpdateSchema,
  defaultTemplateSetSelect,
} from "./templateSet";

const TemplateName = z.string().min(1).max(64);

export const TemplateCreateSchema = z.object({
  id: Id,
  userId: Id.nullable(),
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
  updatedAt: true,
  userId: true,
});

export const TemplateUpdateSchema = z.object({
  id: Id,
  userId: Id.nullable(),
  name: TemplateName.optional(),
  actions: z.object({
    templateExercises: z.record(
      z.discriminatedUnion("action", [
        z.object({
          action: z.literal("CREATE"),
          payload: TemplateExerciseCreateSchema,
        }),
        z.object({
          action: z.literal("UPDATE"),
          payload: TemplateExerciseUpdateSchema,
        }),
        z.object({
          action: z.literal("DELETE"),
          payload: Id,
        }),
      ]),
    ),
    templateSets: z.record(
      z.discriminatedUnion("action", [
        z.object({
          action: z.literal("CREATE"),
          payload: TemplateSetCreateSchema,
        }),
        z.object({
          action: z.literal("UPDATE"),
          payload: TemplateSetUpdateSchema,
        }),
        z.object({
          action: z.literal("DELETE"),
          payload: Id,
        }),
      ]),
    ),
  }),
});

const templateSelectWithRelations = {
  ...defaultTemplateSelect,
  templateExercises: { select: defaultTemplateExerciseSelect },
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
    const { actions, ...template } = input;

    // Handle template updates
    if (template.name) {
      await prisma.template.update({ where: { id: template.id }, data: { name: template.name } });
    }

    await prisma.$transaction([
      ...Object.values(actions.templateExercises).map((action) => {
        switch (action.action) {
          case "CREATE":
            return prisma.templateExercise.create({ data: TemplateExerciseCreateSchema.parse(action.payload) });
          case "UPDATE":
            return prisma.templateExercise.update({
              where: { id: action.payload.id },
              data: TemplateExerciseUpdateSchema.parse(action.payload),
            });
          case "DELETE":
            return prisma.templateExercise.delete({ where: { id: action.payload } });
        }
      }),
      ...Object.values(actions.templateSets).map((action) => {
        switch (action.action) {
          case "CREATE":
            return prisma.templateSet.create({ data: TemplateSetCreateSchema.parse(action.payload) });
          case "UPDATE":
            return prisma.templateSet.update({
              where: { id: action.payload.id },
              data: TemplateSetUpdateSchema.parse(action.payload),
            });
          case "DELETE":
            return prisma.templateSet.delete({ where: { id: action.payload } });
        }
      }),
    ]);
  }),

  delete: publicProcedure.input(Id).mutation(async ({ input: id }) => {
    await prisma.template.delete({ where: { id } });
  }),
});
