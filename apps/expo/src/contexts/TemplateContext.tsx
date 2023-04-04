import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { createId } from "@paralleldrive/cuid2";
import { useFocusEffect } from "@react-navigation/native";
import { proxy, useSnapshot } from "valtio";
import { proxyMap } from "valtio/utils";
import { type z } from "zod";
import { type TemplateUpdateSchema } from "@podium/expo-api/src/routers/template";

import type { RouterInputs, RouterOutputs } from "~/api";

type Exercise = RouterOutputs["exercise"]["get"];
export type Template = RouterOutputs["template"]["get"];
export type TemplateExercise = RouterOutputs["templateExercise"]["get"];
export type TemplateSet = RouterOutputs["templateSet"]["get"];

export type TemplateStoreState = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  templateExercises: Map<
    string,
    Omit<RouterOutputs["templateExercise"]["get"], "templateSets"> & {
      templateSets: Map<string, RouterOutputs["templateSet"]["get"]>;
    }
  >;
  actions: z.infer<typeof TemplateUpdateSchema>["actions"];
  handleSubmit: (template: Omit<TemplateStoreState, "handleSubmit">) => void;
};

const createTemplateStore = ({
  handleSubmit,
  template: initTemplate,
}: {
  handleSubmit: TemplateStoreState["handleSubmit"];
  template?: RouterOutputs["template"]["get"];
}) => {
  const DEFAULT_PROPS: TemplateStoreState = {
    id: initTemplate?.id || createId(),
    name: initTemplate?.name || "Legs 1",
    createdAt: initTemplate?.createdAt || new Date(),
    updatedAt: initTemplate?.updatedAt || new Date(),
    userId: initTemplate?.userId || null,
    templateExercises: proxyMap(),
    actions: {
      templateExercises: {},
      templateSets: {},
    },
    handleSubmit,
  };

  const template = proxy({
    ...DEFAULT_PROPS,
    api: {
      //  Template API
      template: {
        setName(name: string) {
          template.name = name;
        },
      },

      // Template Exercise API
      templateExercise: {
        create(exercise: Exercise) {
          const templateExercise = {
            id: createId(),
            exerciseId: exercise.id,
            exercise,
            templateId: template.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: "",
            userId: null,
            templateSets: proxyMap<string, RouterOutputs["templateSet"]["get"]>(),
            order: template.templateExercises.size,
          };

          template.templateExercises.set(templateExercise.id, templateExercise);

          template.actions.templateExercises[templateExercise.id] = {
            action: "CREATE",
            payload: templateExercise,
          };

          for (let i = 0; i < 3; i++) {
            template.api.templateSet.create(templateExercise.id);
          }
        },

        update(updatedTemplateExercise: RouterInputs["templateExercise"]["update"]) {
          const templateExercise = template.templateExercises.get(updatedTemplateExercise.id);

          if (!templateExercise) return;

          const existingAction = template.actions.templateExercises[templateExercise.id];

          if (existingAction?.action === "DELETE") {
            template.templateExercises.delete(templateExercise.id);
            return;
          }

          Object.assign(templateExercise, { ...updatedTemplateExercise, updatedAt: new Date() });

          template.actions.templateExercises[templateExercise.id] = {
            action: existingAction?.action ?? "UPDATE",
            payload: templateExercise,
          };

          return templateExercise;
        },

        delete(templateExerciseId: string) {
          const templateExercise = template.templateExercises.get(templateExerciseId);

          if (!templateExercise) return;

          template.templateExercises.delete(templateExerciseId);

          template.actions.templateExercises[templateExercise.id] = {
            action: "DELETE",
            payload: templateExercise.id,
          };

          template.templateExercises.forEach((t) => {
            if (t.order > templateExercise.order) t.order--;
          });
        },
      },

      // Template Set API
      templateSet: {
        create: (templateExerciseId: string) => {
          const templateSet: RouterOutputs["templateSet"]["get"] = {
            id: createId(),
            templateExerciseId,
            type: "working",
            repetitions: "0",
            templateId: template.id,
            comments: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: null,
            order: template.templateExercises.get(templateExerciseId)?.templateSets.size ?? 0,
          };

          template.templateExercises.get(templateExerciseId)?.templateSets.set(templateSet.id, templateSet);

          template.actions.templateSets[templateSet.id] = {
            action: "CREATE",
            payload: templateSet,
          };
        },

        update: (templateExerciseId: string, updatedTemplateSet: RouterInputs["templateSet"]["update"]) => {
          const templateSet = template.templateExercises
            .get(templateExerciseId)
            ?.templateSets.get(updatedTemplateSet.id);

          if (!templateSet) return;

          const existingAction = template.actions.templateSets[templateSet.id];

          if (existingAction?.action === "DELETE") {
            template.templateExercises.get(templateExerciseId)?.templateSets.delete(templateSet.id);
            return;
          }

          Object.assign(templateSet, { ...updatedTemplateSet, updatedAt: new Date() });

          template.actions.templateSets[templateSet.id] = {
            action: existingAction?.action ?? "UPDATE",
            payload: templateSet,
          };
        },

        delete: (templateExerciseId: string, templateSetId: string) => {
          const templateSet = template.templateExercises.get(templateExerciseId)?.templateSets.get(templateSetId);

          if (!templateSet) return;

          template.templateExercises.get(templateExerciseId)?.templateSets.delete(templateSetId);

          template.actions.templateSets[templateSet.id] = {
            action: "DELETE",
            payload: templateSet.id,
          };

          template.templateExercises.get(templateExerciseId)?.templateSets.forEach((t) => {
            if (t.order > templateSet.order) t.order--;
          });
        },
      },
    },
  });

  return template;
};

type TemplateStore = ReturnType<typeof createTemplateStore>;

const TemplateStoreContext = createContext<TemplateStore | null>(null);

const useTemplateStoreContext = () => {
  const context = useContext(TemplateStoreContext);

  if (!context) {
    throw new Error(
      "[useTemplateStoreContext] A component tried to use Template Context without being a child of a TemplateProvider or the TemplateProvider store has not been initialized yet. Please fix this",
    );
  }

  return context;
};

type TemplateProviderProps = {
  value: {
    template: Template | undefined;
    isLoading: boolean;
    handleSubmit: TemplateStoreState["handleSubmit"];
  };
};

const TemplateProvider = ({
  value: { template, isLoading = false, handleSubmit },
  children,
}: React.PropsWithChildren<TemplateProviderProps>) => {
  const store = useRef<TemplateStore>(createTemplateStore({ handleSubmit, template: template ?? undefined }));

  if (!store.current && !isLoading) {
    store.current = createTemplateStore({ handleSubmit, template: template ?? undefined });
  }

  useEffect(() => {
    if (isLoading && template && store.current.id !== template.id) {
      store.current = createTemplateStore({ handleSubmit, template });
    }
  }, [isLoading, template, handleSubmit]);

  return <TemplateStoreContext.Provider value={store.current}>{children}</TemplateStoreContext.Provider>;
};

const hooks = {
  useAPI: () => useTemplateStoreContext().api,
  useTemplateContext: () => useTemplateStoreContext(),
  useSubmit: () => {
    const { handleSubmit, ...template } = useTemplateStoreContext();

    return () => handleSubmit(template);
  },

  template: {
    useId: () => useSnapshot(useTemplateStoreContext()).id,
    useName: () => useSnapshot(useTemplateStoreContext()).name,
  },

  templateExercises: {
    /** Returns an array of the template exercise ids sorted based on their order */
    useIds() {
      const templateExercises = useSnapshot(useTemplateStoreContext().templateExercises);

      return [...templateExercises.values()]
        .sort((a, b) => a.order - b.order)
        .map((templateExercise) => templateExercise.id);
    },

    useIdsByExerciseId(exerciseId: string) {
      const templateExercises = useSnapshot(useTemplateStoreContext().templateExercises);

      return [...templateExercises.values()]
        .filter((templateExercise) => templateExercise.exerciseId === exerciseId)
        .sort((a, b) => a.order - b.order)
        .map((templateExercise) => templateExercise.id);
    },

    useTemplateExercise(templateExerciseId: string) {
      const templateExercise = useSnapshot(useTemplateStoreContext().templateExercises).get(templateExerciseId) ?? null;
      return templateExercise;
    },
  },

  templateSets: {
    /** Returns an array of the template set ids of the given template exercise sorted based on their order */
    useIds(templateExerciseId: string) {
      const templateExercise = useTemplateStoreContext().templateExercises.get(templateExerciseId);

      if (!templateExercise) return [];

      return [...templateExercise.templateSets.values()]
        .sort((a, b) => a.order - b.order)
        .map((templateSet) => templateSet.id);
    },

    useTemplateExerciseSetOrder(templateExerciseId: string) {
      const templateExercise = hooks.templateExercises.useTemplateExercise(templateExerciseId);

      if (!templateExercise) return {};

      return [...templateExercise.templateSets.values()]
        .sort((a, b) => a.order - b.order)
        .reduce((acc, templateSet) => {
          acc[templateSet.id] = { order: templateSet.order, type: templateSet.type };
          return acc;
        }, {} as Record<string, { order: number; type: string }>);
    },

    useTemplateSet(templateExerciseId: string, templateSetId: string) {
      const templateExercise = hooks.templateExercises.useTemplateExercise(templateExerciseId);

      if (!templateExercise) return null;

      return templateExercise.templateSets.get(templateSetId) ?? null;
    },
  },
};

export const TemplateContext = {
  Provider: TemplateProvider,
  hooks,
};
