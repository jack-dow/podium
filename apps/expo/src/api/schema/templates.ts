import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { validator } from "../validator";
import { exercises } from "./exercises";

/** ***************** **/
// Template Exercises //
/** *************** **/
export const templateExercises = sqliteTable("template_exercises", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id"),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  notes: text("notes"),
});

export const defaultTemplateExerciseSelect = validator(templateExercises, {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  exerciseId: true,
  templateId: true,
  order: true,
  notes: true,
});

export const insertTemplateExerciseSchema = createInsertSchema(templateExercises).omit({
  createdAt: true,
  updatedAt: true,
});
export type InsertTemplateExerciseSchema = z.infer<typeof insertTemplateExerciseSchema>;

export const updateTemplateExerciseSchema = insertTemplateExerciseSchema.pick({ order: true, notes: true }).partial();
export type UpdateTemplateExerciseSchema = z.infer<typeof updateTemplateExerciseSchema>;

/** ************ **/
// Template Sets //
/** ********** **/
export const templateSets = sqliteTable("template_sets", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id"),
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
  templateExerciseId: text("template_exercise_id")
    .notNull()
    .references(() => templateExercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  type: text("type", { enum: ["warmup", "working", "backoff", "dropset", "failure", "cooldown"] }).notNull(),
  repetitions: text("repetitions").notNull(),
  comments: text("comments"),
});

export const defaultTemplateSetSelect = validator(templateSets, {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  templateId: true,
  templateExerciseId: true,
  order: true,
  type: true,
  repetitions: true,
  comments: true,
});

export const insertTemplateSetSchema = createInsertSchema(templateSets).omit({ createdAt: true, updatedAt: true });
export type InsertTemplateSetSchema = z.infer<typeof insertTemplateSetSchema>;

export const updateTemplateSetSchema = insertTemplateSetSchema
  .pick({
    order: true,
    type: true,
    repetitions: true,
    comments: true,
  })
  .partial();
export type UpdateTemplateSetSchema = z.infer<typeof updateTemplateSetSchema>;

/** ***********/
// Templates //
/** *********/
export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
});

export const defaultTemplateSelect = validator(templates, {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  name: true,
});

export const insertTemplateSchema = createInsertSchema(templates)
  .omit({ createdAt: true, updatedAt: true })
  .extend({
    templateExercises: z.map(
      z.string(),
      insertTemplateExerciseSchema.extend({ templateSets: z.map(z.string(), insertTemplateSetSchema) }),
    ),
  });
export type InsertTemplateSchema = z.infer<typeof insertTemplateSchema>;

export const updateTemplateSchema = createInsertSchema(templates)
  .pick({ name: true })
  .extend({
    actions: z.object({
      templateExercises: z.record(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("INSERT"),
            payload: insertTemplateExerciseSchema,
          }),
          z.object({
            type: z.literal("UPDATE"),
            payload: updateTemplateExerciseSchema,
          }),
          z.object({
            type: z.literal("DELETE"),
            payload: z.string().cuid2(),
          }),
        ]),
      ),
      templateSets: z.record(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("INSERT"),
            payload: insertTemplateSetSchema,
          }),
          z.object({
            type: z.literal("UPDATE"),
            payload: updateTemplateSetSchema,
          }),
          z.object({
            type: z.literal("DELETE"),
            payload: z.string().cuid2(),
          }),
        ]),
      ),
    }),
  });
export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>;
