import { z } from 'zod';
import { TemplateExerciseCreateSchema, TemplateExerciseUpdateSchema } from './templateExercise';
import { TemplateSetCreateSchema, TemplateSetUpdateSchema } from './templateSet';
import { Id, ObjectWithId } from './util';

export const TemplateCreateSchema = ObjectWithId.extend({
  name: z.string().min(1).max(64),
  userId: Id,
  templateExercises: z.array(TemplateExerciseCreateSchema),
  templateSets: z.array(TemplateSetCreateSchema),
});

export const TemplateUpdateSchema = ObjectWithId.extend({
  name: z.string().min(1).max(64),
  userId: Id,
  templateExercises: z.object({
    new: z.array(TemplateExerciseCreateSchema),
    updated: z.array(TemplateExerciseUpdateSchema),
    deleted: z.array(Id),
  }),
  templateSets: z.object({
    new: z.array(TemplateSetCreateSchema),
    updated: z.array(TemplateSetUpdateSchema),
    deleted: z.array(Id),
  }),
});
