import { Prisma, prisma } from '@podium/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../trpc';

/**
 * Default selector for Users.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultProfileSelect = Prisma.validator<Prisma.profilesSelect>()({
  id: true,
  name: true,
  plan: true,
  email: true,
});

export const profilesRouter = t.router({
  byId: t.procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const profile = await prisma.profiles.findUnique({
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
  create: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(70),
        email: z.string().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const profile = await prisma.profiles.create({
        data: input,
        select: defaultProfileSelect,
      });
      return profile;
    }),
});
