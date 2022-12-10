import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
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

export const templateSetCreateSchema = z.object({
  id: z.string().uuid().optional(),
  templateExerciseId: z.string().uuid(),
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
  reps: z.string(),
  position: z.number(),
  type: z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']),
  // type: z.nativeEnum(set).parse(0),
});

export const templateSetUpdateSchema = z.object({
  id: z.string().uuid(),
  reps: z.string().optional(),
  position: z.number().optional(),
  type: z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']).optional(),
});

export const templateSetRouter = router({
  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
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
  byTemplateId: publicProcedure
    .input(
      z.object({
        templateId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { templateId } = input;

      const templateSets = await prisma.templateSet.findMany({
        where: { templateId },
        select: defaultTemplateSetSelect,
      });

      return templateSets;
    }),

  byTemplateExerciseId: publicProcedure
    .input(
      z.object({
        templateExerciseId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { templateExerciseId } = input;

      const templateSets = await prisma.templateSet.findMany({
        where: { templateExerciseId },
        select: defaultTemplateSetSelect,
      });

      return templateSets;
    }),

  // create: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string().uuid().optional(),
  //       templateExerciseId: z.string().uuid(),
  //       templateId: z.string().uuid(),
  //       userId: z.string().uuid(),
  //       reps: z.string(),
  //       position: z.number(),
  //       type: z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']),
  //       // type: z.nativeEnum(set).parse(0),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const templateSet = await prisma.templateSet.create({
  //       data: input,
  //       select: defaultTemplateSetSelect,
  //     });
  //     return templateSet;
  //   }),

  // createMany: publicProcedure
  //   .input(
  //     z.array(
  //       z.object({
  //         id: z.string().uuid().optional(),
  //         templateExerciseId: z.string().uuid(),
  //         templateId: z.string().uuid(),
  //         userId: z.string().uuid(),
  //         reps: z.string(),
  //         position: z.number(),
  //         type: z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ input }) => {
  //     const templateSet = await prisma.templateSet.createMany({
  //       data: input,
  //     });
  //     return templateSet;
  //   }),

  // update: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string().uuid(),
  //       reps: z.string().optional(),
  //       position: z.number().optional(),
  //       type: z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']).optional(),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const { id, ...updates } = input;
  //     const updatedTemplateSet = await prisma.templateSet.update({
  //       where: { id },
  //       data: updates,
  //       select: defaultTemplateSetSelect,
  //     });
  //     return updatedTemplateSet;
  //   }),

  // updateMany: publicProcedure
  //   .input(
  //     z.array(
  //       z.object({
  //         id: z.string().uuid(),
  //         reps: z.string().optional(),
  //         position: z.number().optional(),
  //         type: z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']).optional(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ input }) => {
  //     for (const updatedTemplateSet of input) {
  //       const { id, ...updates } = updatedTemplateSet;
  //       await prisma.templateSet.update({
  //         where: { id },
  //         data: updates,
  //       });
  //     }
  //   }),

  // delete: publicProcedure.input(z.string().uuid()).mutation(async ({ input: id }) => {
  //   const deletedTemplateSet = await prisma.templateSet.delete({ where: { id } });
  //   return deletedTemplateSet;
  // }),

  // deleteMany: publicProcedure.input(z.array(z.string().uuid())).mutation(async ({ input }) => {
  //   const deletedTemplateSets = await prisma.templateSet.deleteMany({ where: { id: { in: input } } });
  //   return deletedTemplateSets;
  // }),
});
