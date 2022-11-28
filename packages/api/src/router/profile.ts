import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

/**
 * Default selector for Profile.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultProfileSelect = Prisma.validator<Prisma.ProfileSelect>()({
  id: true,
  name: true,
  planId: true,
  email: true,
});

export const profileRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;

      const profile = await prisma.profile.findUnique({
        where: { id },
        select: defaultProfileSelect,
      });

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No profile found with id '${id}'`,
        });
      }

      return profile;
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(70),
        email: z.string().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const profile = await prisma.profile.create({
        data: input,
        select: defaultProfileSelect,
      });

      return profile;
    }),
});
