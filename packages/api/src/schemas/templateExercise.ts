import { z } from 'zod';
import { Id, ObjectWithId } from './util';

const Notes = z.string().min(0).max(400).nullish();
const Position = z.number();

export const TemplateExerciseCreateSchema = ObjectWithId.extend({
  templateId: Id,
  exerciseId: Id,
  userId: Id,
  notes: Notes,
  position: Position,
});

export const TemplateExerciseUpdateSchema = ObjectWithId.extend({
  notes: Notes,
  position: Position.optional(),
});
