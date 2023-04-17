export * from "./hooks/exercises";
export * from "./hooks/templates";

export type { InsertExerciseSchema, UpdateExerciseSchema } from "./schema/exercises";
export { insertExerciseSchema, updateExerciseSchema } from "./schema/exercises";

export type {
  InsertTemplateSchema,
  UpdateTemplateSchema,
  InsertTemplateExerciseSchema,
  UpdateTemplateExerciseSchema,
  InsertTemplateSetSchema,
  UpdateTemplateSetSchema,
} from "./schema/templates";
export { insertTemplateSchema, updateTemplateSchema } from "./schema/templates";
