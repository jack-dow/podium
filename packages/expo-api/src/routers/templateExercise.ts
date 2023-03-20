import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Prisma, prisma } from "../prisma";
import { CreatedAt, Id } from "../schema-utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ExerciseSchema, defaultExerciseSelect } from "./exercise";

const TemplateExerciseNotes = z.string().min(0).max(400).nullable();
const TemplateExerciseOrder = z.number();

export const TemplateExerciseSchema = z.object({
  id: Id,
  userId: Id.optional(),
  templateId: Id,
  exerciseId: Id,
  createdAt: CreatedAt,
  order: TemplateExerciseOrder,
  notes: TemplateExerciseNotes,
  exercise: ExerciseSchema,
});

/**
 * Default selector for Template Exercise.
 *
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultTemplateExerciseSelect = Prisma.validator<Prisma.TemplateExerciseSelect>()({
  id: true,
  userId: true,
  templateId: true,
  exerciseId: true,
  createdAt: true,
  order: true,
  notes: true,
  exercise: { select: defaultExerciseSelect },
});

export const TemplateExerciseCreateSchema = z.object({
  id: Id,
  userId: Id.optional(),
  templateId: Id,
  exerciseId: Id,
  createdAt: z.date(),
  notes: TemplateExerciseNotes,
  order: TemplateExerciseOrder,
});

export const TemplateExerciseUpdateSchema = z.object({
  id: Id,
  notes: TemplateExerciseNotes,
  order: TemplateExerciseOrder.optional(),
});

/** Template Exercise router definition */
export const templateExerciseRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({ id: Id })).query(async ({ input }) => {
    const { id } = input;
    const templateExercise = await prisma.templateExercise.findUnique({
      where: { id },
      select: defaultTemplateExerciseSelect,
    });

    if (!templateExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No template exercise with id '${id}'`,
      });
    }
    return templateExercise;
  }),

  byTemplateId: publicProcedure.input(z.object({ templateId: z.string() })).query(async ({ input }) => {
    const { templateId } = input;
    const templateExercise = await prisma.templateExercise.findMany({
      where: { templateId },
      select: defaultTemplateExerciseSelect,
    });

    return templateExercise;
  }),

  create: publicProcedure.input(TemplateExerciseCreateSchema).mutation(async ({ input }) => {
    await prisma.templateExercise.create({ data: input, select: defaultTemplateExerciseSelect });
  }),

  update: publicProcedure.input(TemplateExerciseUpdateSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input;

    await prisma.templateExercise.update({
      where: { id },
      data: updates,
      select: defaultTemplateExerciseSelect,
    });
  }),

  delete: publicProcedure.input(z.object({ id: Id })).mutation(async ({ input }) => {
    await prisma.templateExercise.delete({ where: { id: input.id } });
  }),
});
