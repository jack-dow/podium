import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferColumnsDataTypes } from "drizzle-orm";
import { eq, inArray } from "drizzle-orm/expressions";

import { db } from "../drizzle";
import { defaultExerciseSelect, exercises } from "../schema/exercises";
import {
  defaultTemplateExerciseSelect,
  defaultTemplateSelect,
  defaultTemplateSetSelect,
  insertTemplateExerciseSchema,
  insertTemplateSchema,
  insertTemplateSetSchema,
  templateExercises,
  templateSets,
  templates,
  updateTemplateExerciseSchema,
  updateTemplateSchema,
  updateTemplateSetSchema,
  type InsertTemplateExerciseSchema,
  type InsertTemplateSchema,
  type InsertTemplateSetSchema,
  type InsertTemplateWithTemplateExercisesSchema,
  type UpdateTemplateExerciseSchema,
  type UpdateTemplateSchema,
  type UpdateTemplateSetSchema,
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
          name: exercises.name,
          instructions: exercises.instructions,
        })
        .from(templateExercises)
        .innerJoin(exercises, eq(exercises.id, templateExercises.exerciseId))
        .where(eq(templateExercises.templateId, id!))
        .all();

      const tSets = await db
        .select(defaultTemplateSetSelect)
        .from(templateSets)
        .where(eq(templateSets.templateId, id!))
        .all();

      const tSetsByTemplateExerciseId = tSets.reduce((acc, curr) => {
        if (!acc.get(curr.templateExerciseId)) {
          acc.set(curr.templateExerciseId, new Map());
        }

        acc.get(curr.templateExerciseId)!.set(curr.id, curr);

        return acc;
      }, new Map<string, Map<string, (typeof tSets)[number]>>());

      return {
        ...template,
        templateExercises: tExercises.reduce((acc, curr) => {
          acc.set(curr.id, {
            ...curr,
            templateSets: tSetsByTemplateExerciseId.get(curr.id) || new Map<string, (typeof tSets)[number]>(),
          });

          return acc;
        }, new Map<string, (typeof tExercises)[number] & { templateSets: Map<string, (typeof tSets)[number]> }>()),
      };
    },
  });
}

export function useTemplateInsertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InsertTemplateWithTemplateExercisesSchema) => {
      const { templateExercises: templateExercisesWithTemplateSets, ...t } = input;
      const template = insertTemplateSchema.parse(t);

      const tExercises: Array<InsertTemplateExerciseSchema> = [];
      const tSets: Array<InsertTemplateSetSchema> = [];

      templateExercisesWithTemplateSets.forEach((tExercise) => {
        const { templateSets, ...templateExercise } = tExercise;
        tExercises.push(insertTemplateExerciseSchema.parse(templateExercise));

        templateSets.forEach((tSet) => {
          tSets.push(insertTemplateSetSchema.parse(tSet));
        });
      });

      await db.transaction(async (tx) => {
        await tx
          .insert(templates)
          .values({
            ...template,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
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

      const { actions } = updateTemplateSchema.parse(input);

      const templateExerciseInsert: Array<InsertTemplateExerciseSchema & { createdAt: Date; updatedAt: Date }> = [];
      const templateExerciseUpdate: Array<UpdateTemplateExerciseSchema & { id: string; updatedAt: Date }> = [];
      const templateExerciseDelete: Array<string> = [];

      for (const [templateExerciseId, action] of Object.entries(actions.templateExercises)) {
        switch (action.type) {
          case "INSERT":
            templateExerciseInsert.push({
              ...action.payload,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            break;
          case "UPDATE":
            templateExerciseUpdate.push({
              ...action.payload,
              id: templateExerciseId,
              updatedAt: new Date(),
            });
            break;
          case "DELETE":
            templateExerciseDelete.push(action.payload);
            break;
        }
      }

      const templateSetInsert: Array<InsertTemplateSetSchema & { createdAt: Date; updatedAt: Date }> = [];
      const templateSetUpdate: Array<UpdateTemplateSetSchema & { id: string; updatedAt: Date }> = [];
      const templateSetDelete: Array<string> = [];

      for (const [templateSetId, action] of Object.entries(actions.templateSets)) {
        switch (action.type) {
          case "INSERT":
            templateSetInsert.push({
              ...action.payload,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            break;
          case "UPDATE":
            templateSetUpdate.push({
              ...action.payload,
              id: templateSetId,
              updatedAt: new Date(),
            });
            break;
          case "DELETE":
            templateSetDelete.push(action.payload);
            break;
        }
      }

      await db.transaction(async (tx) => {
        // Template
        if (actions.template) {
          await tx
            .update(templates)
            .set({ ...actions.template.payload, updatedAt: new Date() })
            .where(eq(templates.id, id))
            .run();
        }

        // Template Exercises
        if (templateExerciseInsert.length > 0) {
          await tx.insert(templateExercises).values(templateExerciseInsert).run();
        }

        for (const update of templateExerciseUpdate) {
          await tx.update(templateExercises).set(update).where(eq(templateExercises.id, update.id)).run();
        }

        if (templateExerciseDelete.length > 0) {
          await tx.delete(templateExercises).where(inArray(templateExercises.id, templateExerciseDelete)).run();
        }

        // Template Sets
        if (templateSetInsert.length > 0) {
          await tx.insert(templateSets).values(templateSetInsert).run();
        }

        for (const update of templateSetUpdate) {
          await tx.update(templateSets).set(update).where(eq(templateSets.id, update.id)).run();
        }

        if (templateSetDelete.length > 0) {
          await tx.delete(templateSets).where(inArray(templateSets.id, templateSetDelete)).run();
        }
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
