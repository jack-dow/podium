import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Prisma, prisma } from "../prisma";
import { CreatedAt, Id } from "../schema-utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

const TemplateSetRepetitions = z.string();
const TemplateSetOrder = z.number();
const TemplateSetType = z.string();
const TemplateSetComments = z.string().min(0).max(1000).nullable();

export const TemplateSetSchema = z.object({
  id: Id,
  userId: Id.nullable(),
  templateId: Id,
  templateExerciseId: Id,
  createdAt: CreatedAt,
  order: TemplateSetOrder,
  type: TemplateSetType,
  repetitions: TemplateSetRepetitions,
  comments: TemplateSetComments,
});

/**
 * Default selector for Template Set.
 *
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultTemplateSetSelect = Prisma.validator<Prisma.TemplateSetSelect>()({
  id: true,
  userId: true,
  templateId: true,
  templateExerciseId: true,
  createdAt: true,
  updatedAt: true,
  order: true,
  type: true,
  repetitions: true,
  comments: true,
});

export const TemplateSetCreateSchema = z.object({
  id: Id,
  userId: Id.nullable(),
  templateExerciseId: Id,
  templateId: Id,
  createdAt: CreatedAt,
  repetitions: TemplateSetRepetitions,
  order: TemplateSetOrder,
  type: TemplateSetType,
  comments: TemplateSetComments,
});

export const TemplateSetUpdateSchema = z.object({
  id: Id,
  repetitions: TemplateSetRepetitions.optional(),
  order: TemplateSetOrder.optional(),
  type: TemplateSetType.optional(),
  comments: TemplateSetComments.optional(),
});

/** Template Set router definition  */
export const templateSetRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({ id: Id })).query(async ({ input }) => {
    const { id } = input;
    const templateSet = await prisma.templateSet.findUnique({
      where: { id },
      select: defaultTemplateSetSelect,
    });

    if (!templateSet) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No template exercise with id '${id}'`,
      });
    }
    return templateSet;
  }),

  byTemplateId: publicProcedure.input(z.object({ templateId: z.string() })).query(async ({ input }) => {
    const { templateId } = input;
    const templateSets = await prisma.templateSet.findMany({
      where: { templateId },
      select: defaultTemplateSetSelect,
    });

    return templateSets;
  }),

  byTemplateExerciseId: publicProcedure.input(z.object({ templateExerciseId: z.string() })).query(async ({ input }) => {
    const { templateExerciseId } = input;
    const templateSets = await prisma.templateSet.findMany({
      where: { templateExerciseId },
      select: defaultTemplateSetSelect,
    });

    return templateSets;
  }),

  create: publicProcedure.input(TemplateSetCreateSchema).mutation(async ({ input }) => {
    await prisma.templateSet.create({
      data: input,
      select: defaultTemplateSetSelect,
    });
  }),

  update: publicProcedure.input(TemplateSetUpdateSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input;

    await prisma.templateSet.update({
      where: { id },
      data: updates,
      select: defaultTemplateSetSelect,
    });
  }),

  delete: publicProcedure.input(z.object({ id: Id })).mutation(async ({ input }) => {
    await prisma.templateSet.delete({ where: { id: input.id } });
  }),
});
