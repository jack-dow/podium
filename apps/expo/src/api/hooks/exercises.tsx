import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";

import { db } from "../drizzle";
import { exercises, updateExerciseSchema, type InsertExerciseSchema, type UpdateExerciseSchema } from "../schema";

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => await db.select({ id: exercises.id, name: exercises.name }).from(exercises).all(),
  });
}

export function useExercise(id?: string) {
  return useQuery({
    queryKey: ["exercise", id],
    enabled: Boolean(id),
    queryFn: async () => await db.select().from(exercises).where(eq(exercises.id, id!)).get(),
  });
}

export function useExerciseInsertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InsertExerciseSchema) => await db.insert(exercises).values(input).run(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

export function useExerciseUpdateMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateExerciseSchema) => {
      if (!id) return null;

      const fields = updateExerciseSchema.parse(input);

      return await db.update(exercises).set(fields).where(eq(exercises.id, id)).run();
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
    mutationFn: async (id: string) => await db.delete(exercises).where(eq(exercises.id, id)).run(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}
