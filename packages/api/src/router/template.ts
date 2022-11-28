import type { Template, TemplateExercise, TemplateSet } from '@podium/db';
import { Prisma, prisma } from '@podium/db';
import { z } from 'zod';
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
});

export const templateRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;

      const template = await prisma.template.findUnique({
        where: { id },
        select: {
          ...defaultTemplateSelect,
          templateExercises: { select: defaultTemplateExerciseSelect },
          templateSets: { select: defaultTemplateSetSelect },
        },
      });

      return template;
    }),

  upsert: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(64),
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, name } = input;
      const upsertedTemplate = await prisma.template.upsert({
        where: { id },
        update: { name },
        create: input,
        select: defaultTemplateSelect,
      });
      return upsertedTemplate;
    }),
});
