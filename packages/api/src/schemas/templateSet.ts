import { z } from 'zod';
import { Id, ObjectWithId } from './util';

const Reps = z.string();
const Position = z.number();
const Type = z.enum(['warmup', 'working', 'failure', 'dropset', 'backoff', 'cooldown']);

export const TemplateSetCreateSchema = ObjectWithId.extend({
  templateExerciseId: Id,
  templateId: Id,
  userId: Id,
  reps: Reps,
  position: Position,
  type: Type,
});

export const TemplateSetUpdateSchema = ObjectWithId.extend({
  reps: Reps.optional(),
  position: Position.optional(),
  type: Type.optional(),
});
