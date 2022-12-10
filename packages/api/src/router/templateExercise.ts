import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { defaultExerciseSelect } from './exercise';

/**
 * Default selector for Template Exercise.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultTemplateExerciseSelect = Prisma.validator<Prisma.TemplateExerciseSelect>()({
  id: true,
  templateId: true,
  exerciseId: true,
  createdAt: true,
  position: true,
  notes: true,
  userId: true,
  exercise: { select: defaultExerciseSelect },
});

const id = z.string().uuid();

export const templateExerciseCreateSchema = z.object({
  id: id.optional(),
  templateId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  userId: z.string().uuid(),
  notes: z.string().min(0).max(400).nullish(),
  position: z.number(),
});

export const templateExerciseUpdateSchema = z.object({
  id,
  notes: z.string().min(0).max(400).nullish(),
  position: z.number().optional(),
});

export const templateExerciseRouter = router({
  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const { id } = input;
    const templateExercise = await prisma.templateExercise.findUnique({
      where: { id },
      select: defaultTemplateExerciseSelect,
    });

    if (!templateExercise) {
      throw new TRPCError({
        code: 'NOT_FOUND',
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

  // create: publicProcedure.input(templateExerciseCreateSchema).mutation(async ({ input }) => {
  //   const templateExercise = await prisma.templateExercise.create({
  //     data: input,
  //     select: defaultExerciseSelect,
  //   });
  //   return templateExercise;
  // }),

  // createMany: publicProcedure.input(z.array(templateExerciseCreateSchema)).mutation(async ({ input }) => {
  //   const templateExercises = await prisma.templateExercise.createMany({
  //     data: input,
  //   });
  //   return templateExercises;
  // }),

  // update: publicProcedure.input(templateExerciseUpdateSchema).mutation(async ({ input }) => {
  //   const { id, ...updates } = input;
  //   const updatedTemplateExercise = await prisma.templateExercise.update({
  //     where: { id },
  //     data: updates,
  //     select: defaultTemplateExerciseSelect,
  //   });
  //   return updatedTemplateExercise;
  // }),

  // updateMany: publicProcedure.input(z.array(templateExerciseUpdateSchema)).mutation(async ({ input }) => {
  //   for (const updatedTemplateExercise of input) {
  //     const { id, ...updates } = updatedTemplateExercise;
  //     await prisma.templateExercise.update({
  //       where: { id },
  //       data: updates,
  //       select: defaultTemplateExerciseSelect,
  //     });
  //   }
  // }),

  // delete: publicProcedure.input(id).mutation(async ({ input: id }) => {
  //   const deletedTemplateExercise = await prisma.templateExercise.delete({ where: { id } });
  //   return deletedTemplateExercise;
  // }),

  // deleteMany: publicProcedure.input(z.array(id)).mutation(async ({ input: ids }) => {
  //   const deletedTemplateExercises = await prisma.templateExercise.deleteMany({ where: { id: { in: ids } } });
  //   return deletedTemplateExercises;
  // }),
});

