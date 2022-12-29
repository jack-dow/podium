import { z } from 'zod';
import { Id, ObjectWithId } from './util';

const Notes = z.string().min(0).max(400).nullish();
const Position = z.number();

export const WorkoutExerciseCreateSchema = ObjectWithId.extend({
  workoutId: Id,
  exerciseId: Id,
  userId: Id,
  createdAt: z.date(),
  notes: Notes,
  position: Position,
});

export const WorkoutExerciseUpdateSchema = ObjectWithId.extend({
  notes: Notes,
  position: Position.optional(),
});
