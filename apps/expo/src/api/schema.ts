import { type InferModel } from "drizzle-orm";
import { foreignKey, index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  instructions: text("instructions"),
  userId: text("user_id"),
});

export type Exercise = InferModel<typeof exercises>;

export const insertExerciseSchema = createInsertSchema(exercises);
export type InsertExerciseSchema = z.infer<typeof insertExerciseSchema>;

export const updateExerciseSchema = insertExerciseSchema.pick({ name: true, instructions: true });
export type UpdateExerciseSchema = z.infer<typeof updateExerciseSchema>;
