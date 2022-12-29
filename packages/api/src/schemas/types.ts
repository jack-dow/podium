import type { z } from 'zod';
import type { ExerciseCreateSchema, ExerciseUpdateSchema } from './exercise';

import type { TemplateCreateSchema, TemplateUpdateSchema } from './template';
import type { TemplateExerciseCreateSchema, TemplateExerciseUpdateSchema } from './templateExercise';
import type { TemplateSetCreateSchema, TemplateSetUpdateSchema } from './templateSet';

import type { WorkoutCreateSchema, WorkoutUpdateSchema } from './workout';
import type { WorkoutExerciseCreateSchema, WorkoutExerciseUpdateSchema } from './workoutExercise';
import type { WorkoutSetCreateSchema, WorkoutSetUpdateSchema } from './workoutSet';

export type ExerciseCreate = z.infer<typeof ExerciseCreateSchema>;
export type ExerciseUpdate = z.infer<typeof ExerciseUpdateSchema>;

export type TemplateCreate = z.infer<typeof TemplateCreateSchema>;
export type TemplateUpdate = z.infer<typeof TemplateUpdateSchema>;

export type TemplateExerciseCreate = z.infer<typeof TemplateExerciseCreateSchema>;
export type TemplateExerciseUpdate = z.infer<typeof TemplateExerciseUpdateSchema>;

export type TemplateSetCreate = z.infer<typeof TemplateSetCreateSchema>;
export type TemplateSetUpdate = z.infer<typeof TemplateSetUpdateSchema>;

export type WorkoutCreate = z.infer<typeof WorkoutCreateSchema>;
export type WorkoutUpdate = z.infer<typeof WorkoutUpdateSchema>;

export type WorkoutExerciseCreate = z.infer<typeof WorkoutExerciseCreateSchema>;
export type WorkoutExerciseUpdate = z.infer<typeof WorkoutExerciseUpdateSchema>;

export type WorkoutSetCreate = z.infer<typeof WorkoutSetCreateSchema>;
export type WorkoutSetUpdate = z.infer<typeof WorkoutSetUpdateSchema>;
