import { z } from 'zod';
import { TemplateExerciseCreateSchema } from './templateExercise';
import { TemplateSetCreateSchema } from './templateSet';
import { Id, ObjectWithId } from './util';

const Name = z.string().min(1).max(64);

export const TemplateCreateSchema = ObjectWithId.extend({
  name: Name,
  userId: Id,
  templateExercises: z.array(TemplateExerciseCreateSchema),
  templateSets: z.array(TemplateSetCreateSchema),
});

export const TemplateUpdateSchema = ObjectWithId.extend({
  name: Name.optional(),
  userId: Id,
  templateExercises: z.object({
    all: z.array(TemplateExerciseCreateSchema),
    new: z.array(Id),
    updated: z.array(Id),
    deleted: z.array(Id),
  }),
  templateSets: z.object({
    all: z.array(TemplateSetCreateSchema),
    new: z.array(Id),
    updated: z.array(Id),
    deleted: z.array(Id),
  }),
});
