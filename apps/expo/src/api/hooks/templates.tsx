import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferColumnsDataTypes } from "drizzle-orm";
import { eq, inArray } from "drizzle-orm/expressions";

import { db } from "../drizzle";
import { defaultExerciseSelect, exercises } from "../schema/exercises";
import {
  defaultTemplateExerciseSelect,
  defaultTemplateSelect,
  defaultTemplateSetSelect,
  templateExercises,
  templateSets,
  templates,
  type InsertTemplateExerciseSchema,
  type InsertTemplateSchema,
  type InsertTemplateSetSchema,
  type UpdateTemplateExerciseSchema,
  type UpdateTemplateSchema,
} from "../schema/templates";
import { type Exercise } from "./exercises";
import { type ExtractMapEntryType, type QueryOutput } from "./types";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const result = await db.select({ id: templates.id, name: templates.name }).from(templates).all();
      return result;
    },
  });
}

export type Template = QueryOutput<typeof useTemplate>;
export type TemplateExercise = ExtractMapEntryType<Template["templateExercises"]>;
export type TemplateSet = ExtractMapEntryType<TemplateExercise["templateSets"]>;

export function useTemplate(id?: string) {
  return useQuery({
    queryKey: ["template", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const template = await db.select(defaultTemplateSelect).from(templates).where(eq(templates.id, id!)).get();

      const tExercises = await db
        .select({
          ...defaultTemplateExerciseSelect,
          exercise: defaultExerciseSelect,
          templateSet: defaultTemplateSetSelect,
        })
        .from(templateExercises)
        .leftJoin(exercises, eq(exercises.id, templateExercises.exerciseId))
        .leftJoin(templateSets, eq(templateSets.id, templateExercises.id))
        .where(eq(templateExercises.templateId, id!))
        .all();

      type _TemplateExercise = InferColumnsDataTypes<typeof defaultTemplateExerciseSelect>;
      type _TemplateSet = InferColumnsDataTypes<typeof defaultTemplateSetSelect>;

      const aggregatedTemplateExercises = tExercises.reduce((acc, curr) => {
        if (!curr.exercise) return acc;

        if (!acc.get(curr.id)) {
          acc.set(curr.id, {
            ...curr,
            exercise: curr.exercise,
            templateSets: new Map(),
          });
        }

        if (!curr.templateSet) return acc;

        acc.get(curr.id)!.templateSets.set(curr.templateSet.id, curr.templateSet);

        return acc;
      }, new Map() as Map<string, _TemplateExercise & { exercise: Exercise; templateSets: Map<string, _TemplateSet> }>);

      return { ...template, templateExercises: aggregatedTemplateExercises };
    },
  });
}

export function useTemplateInsertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InsertTemplateSchema) => {
      const { templateExercises: templateExercisesWithTemplateSets, ...template } = input;

      const tExercises: Array<InsertTemplateExerciseSchema> = [];
      const tSets: Array<InsertTemplateSetSchema> = [];

      templateExercisesWithTemplateSets.forEach((tExercise) => {
        const { templateSets, ...templateExercise } = tExercise;
        tExercises.push(templateExercise);

        templateSets.forEach((tSet) => {
          tSets.push(tSet);
        });
      });

      await db.transaction(async (tx) => {
        await tx
          .insert(templates)
          .values({ ...template, createdAt: new Date(), updatedAt: new Date() })
          .run();

        await tx
          .insert(templateExercises)
          .values(tExercises.map((e) => ({ ...e, createdAt: new Date(), updatedAt: new Date() })))
          .run();

        await tx
          .insert(templateSets)
          .values(tSets.map((s) => ({ ...s, createdAt: new Date(), updatedAt: new Date() })))
          .run();
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useTemplateUpdateMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTemplateSchema) => {
      if (!id) return;
      const { actions, ...template } = input;

      const templateExerciseInsert: Array<InsertTemplateExerciseSchema> = [];
      const templateExerciseUpdate: Array<UpdateTemplateExerciseSchema & { id: string }> = [];
      const templateExerciseDelete: Array<string> = [];

      for (const [id, action] of Object.entries(actions.templateExercises)) {
        switch (action.type) {
          case "INSERT":
            templateExerciseInsert.push(action.payload);
            break;
          case "UPDATE":
            templateExerciseUpdate.push({ id, ...action.payload });
            break;
          case "DELETE":
            templateExerciseDelete.push(action.payload);
            break;
        }
      }

      const templateSetInsert: Array<InsertTemplateSetSchema> = [];
      const templateSetUpdate: Array<UpdateTemplateExerciseSchema & { id: string }> = [];
      const templateSetDelete: Array<string> = [];

      for (const action of Object.values(actions.templateSets)) {
        switch (action.type) {
          case "INSERT":
            templateSetInsert.push(action.payload);
            break;
          case "UPDATE":
            templateSetUpdate.push({ id, ...action.payload });
            break;
          case "DELETE":
            templateSetDelete.push(action.payload);
            break;
        }
      }

      await db.transaction(async (tx) => {
        // Template
        await tx
          .update(templates)
          .set({ ...template, updatedAt: new Date() })
          .where(eq(templates.id, id))
          .run();

        // Template Exercises
        await tx
          .insert(templateExercises)
          .values(templateExerciseInsert.map((e) => ({ ...e, createdAt: new Date(), updatedAt: new Date() })))
          .run();

        for (const update of templateExerciseUpdate) {
          await tx
            .update(templateExercises)
            .set({ ...update, updatedAt: new Date() })
            .where(eq(templateExercises.id, update.id))
            .run();
        }

        await tx.delete(templateExercises).where(inArray(templateExercises.id, templateExerciseDelete)).run();

        // Template Sets
        await tx
          .insert(templateSets)
          .values(templateSetInsert.map((s) => ({ ...s, createdAt: new Date(), updatedAt: new Date() })))
          .run();

        for (const update of templateSetUpdate) {
          await tx
            .update(templateSets)
            .set({ ...update, updatedAt: new Date() })
            .where(eq(templateSets.id, update.id))
            .run();
        }

        await tx.delete(templateSets).where(inArray(templateSets.id, templateSetDelete)).run();
      });
    },
    onSuccess: async () => {
      if (!id) return;
      await queryClient.invalidateQueries({ queryKey: ["templates"] });
      await queryClient.invalidateQueries({ queryKey: ["template", id] });
    },
  });
}

export function useTemplateDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await db.delete(templates).where(eq(templates.id, id)).run();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}
