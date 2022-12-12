import { z } from 'zod';
import { Id } from './util';

const Name = z.string().min(1).max(64);
const Instructions = z.string().min(0).max(400);

export const ExerciseCreateSchema = z.object({
  id: Id.optional(),
  userId: Id,
  name: Name,
  instructions: Instructions,
});

export const ExerciseUpdateSchema = z.object({
  id: Id,
  name: Name.optional(),
  instructions: Instructions,
});
