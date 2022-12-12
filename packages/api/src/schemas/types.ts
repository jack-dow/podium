import type { z } from 'zod';
import type { ExerciseCreateSchema, ExerciseUpdateSchema } from './exercise';
import type { TemplateCreateSchema, TemplateUpdateSchema } from './template';
import type { TemplateExerciseCreateSchema, TemplateExerciseUpdateSchema } from './templateExercise';
import type { TemplateSetCreateSchema, TemplateSetUpdateSchema } from './templateSet';

export type ExerciseCreate = z.infer<typeof ExerciseCreateSchema>;
export type ExerciseUpdate = z.infer<typeof ExerciseUpdateSchema>;

export type TemplateCreate = z.infer<typeof TemplateCreateSchema>;
export type TemplateUpdate = z.infer<typeof TemplateUpdateSchema>;

export type TemplateExerciseCreate = z.infer<typeof TemplateExerciseCreateSchema>;
export type TemplateExerciseUpdate = z.infer<typeof TemplateExerciseUpdateSchema>;

export type TemplateSetCreate = z.infer<typeof TemplateSetCreateSchema>;
export type TemplateSetUpdate = z.infer<typeof TemplateSetUpdateSchema>;
