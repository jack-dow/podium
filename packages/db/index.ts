import { Prisma, PrismaClient, set } from '@prisma/client';
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export * from '@prisma/client';

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export type TemplateWithExercisesAndSets = Prisma.TemplateGetPayload<{
  include: {
    templateExercises: { include: { exercise: true } };
    templateSets: true;
  };
}>;

export type TemplateExerciseWithExercise = Prisma.TemplateExerciseGetPayload<{
  include: { exercise: true };
}>;

export type WorkoutWithExercisesAndSets = Prisma.WorkoutGetPayload<{
  include: {
    workoutExercises: { include: { exercise: true } };
    workoutSets: true;
  };
}>;

export type WorkoutExerciseWithExercise = Prisma.WorkoutExerciseGetPayload<{
  include: { exercise: true };
}>;
