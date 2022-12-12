import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ObjectWithId } from '../schemas/util';
import { publicProcedure, router } from '../trpc';

/**
 * Default selector for Template Set.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultTemplateSetSelect = Prisma.validator<Prisma.TemplateSetSelect>()({
  id: true,
  templateId: true,
  templateExerciseId: true,
  createdAt: true,
  position: true,
  type: true,
  reps: true,
  userId: true,
});

export const templateSetRouter = router({
  byId: publicProcedure.input(ObjectWithId).query(async ({ input }) => {
    const { id } = input;
    const templateSet = await prisma.templateSet.findUnique({
      where: { id },
      select: defaultTemplateSetSelect,
    });

    if (!templateSet) {
      throw new TRPCError({
        code: 'NOT_FOUND',
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
});
