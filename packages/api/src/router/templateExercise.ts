import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ObjectWithId } from '../schemas/util';
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

export const templateExerciseRouter = router({
  byId: publicProcedure.input(ObjectWithId).query(async ({ input }) => {
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
});
