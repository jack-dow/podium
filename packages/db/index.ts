import type { Template, TemplateExercise, TemplateSet } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { env } from './env';





declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export * from '@prisma/client';

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
