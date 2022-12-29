import { z } from 'zod';
import { WorkoutExerciseCreateSchema } from './workoutExercise';
import { WorkoutSetCreateSchema } from './workoutSet';
import { Id, ObjectWithId } from './util';

const Name = z.string().min(1).max(64);

export const WorkoutCreateSchema = ObjectWithId.extend({
  name: Name,
  userId: Id,
  workoutExercises: z.array(WorkoutExerciseCreateSchema),
  workoutSets: z.array(WorkoutSetCreateSchema),
});

export const WorkoutUpdateSchema = ObjectWithId.extend({
  name: Name.optional(),
  userId: Id,
  workoutExercises: z.object({
    all: z.array(WorkoutExerciseCreateSchema),
    new: z.array(Id),
    updated: z.array(Id),
    deleted: z.array(Id),
  }),
  workoutSets: z.object({
    all: z.array(WorkoutSetCreateSchema),
    new: z.array(Id),
    updated: z.array(Id),
    deleted: z.array(Id),
  }),
});
