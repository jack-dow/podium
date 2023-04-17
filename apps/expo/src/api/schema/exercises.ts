import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { type z } from "zod";

import { validator } from "../validator";

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
  instructions: text("instructions"),
});

export const defaultExerciseSelect = validator(exercises, {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  name: true,
  instructions: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({ createdAt: true, updatedAt: true });
export type InsertExerciseSchema = z.infer<typeof insertExerciseSchema>;

export const updateExerciseSchema = insertExerciseSchema.pick({ name: true, instructions: true }).partial();
export type UpdateExerciseSchema = z.infer<typeof updateExerciseSchema>;
