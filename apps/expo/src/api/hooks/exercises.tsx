import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm/expressions";

import { db } from "../drizzle";
import {
  defaultExerciseSelect,
  exercises,
  updateExerciseSchema,
  type InsertExerciseSchema,
  type UpdateExerciseSchema,
} from "../schema/exercises";
import { type QueryOutput } from "./types";

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const result = await db.select(defaultExerciseSelect).from(exercises).all();
      return result;
    },
  });
}

export type Exercise = QueryOutput<typeof useExercise>;

export function useExercise(id?: string) {
  return useQuery({
    queryKey: ["exercise", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const result = await db.select(defaultExerciseSelect).from(exercises).where(eq(exercises.id, id!)).get();
      return result;
    },
  });
}

export function useExerciseInsertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InsertExerciseSchema) => {
      await db
        .insert(exercises)
        .values({ ...input, createdAt: new Date(), updatedAt: new Date() })
        .run();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

export function useExerciseUpdateMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateExerciseSchema) => {
      if (!id) return;

      const updates = updateExerciseSchema.parse(input);

      await db
        .update(exercises)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(exercises.id, id))
        .run();
    },
    onSuccess: async () => {
      if (!id) return;

      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
      await queryClient.invalidateQueries({ queryKey: ["exercise", id] });
    },
  });
}

export function useExerciseDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db.delete(exercises).where(eq(exercises.id, id)).run();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}
