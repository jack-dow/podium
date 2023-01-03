import { z } from 'zod';
import { Id, ObjectWithId } from './util';

const Reps = z.string();
const Position = z.number();
const Type = z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']);
const Weight = z.string();

export const WorkoutSetCreateSchema = ObjectWithId.extend({
  workoutExerciseId: Id,
  workoutId: Id,
  createdAt: z.date(),
  userId: Id,
  reps: Reps,
  position: Position,
  weight: Weight,
  type: Type,
});

export const WorkoutSetUpdateSchema = ObjectWithId.extend({
  reps: Reps.optional(),
  position: Position.optional(),
  weight: Weight.optional(),
  type: Type.optional(),
});
