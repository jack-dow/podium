import { createContext, useContext, useEffect, useRef } from "react";
import { createId } from "@paralleldrive/cuid2";
import { proxy, useSnapshot } from "valtio";
import { proxyMap } from "valtio/utils";

import {
  type Exercise,
  type Template,
  type TemplateExercise,
  type TemplateSet,
  type UpdateTemplateExerciseSchema,
  type UpdateTemplateSchema,
  type UpdateTemplateSetSchema,
} from "~/api";

export type TemplateStoreState = Template & {
  actions: UpdateTemplateSchema["actions"];
  handleSubmit: (template: Omit<TemplateStoreState, "handleSubmit">) => void;
};

const createTemplateStore = ({
  handleSubmit,
  template: initTemplate,
}: {
  handleSubmit: TemplateStoreState["handleSubmit"];
  template?: Template;
}) => {
  initTemplate?.templateExercises.forEach((templateExercise) => {
    templateExercise.templateSets = proxyMap(templateExercise.templateSets);
  });

  const DEFAULT_PROPS: TemplateStoreState = {
    id: initTemplate?.id || createId(),
    name: initTemplate?.name || "Legs 1",
    createdAt: initTemplate?.createdAt || new Date(),
    updatedAt: initTemplate?.updatedAt || new Date(),
    userId: initTemplate?.userId || null,
    templateExercises: proxyMap(initTemplate?.templateExercises),
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

          template.actions.template = {
            type: "UPDATE",
            payload: { name },
          };
        },
      },

      // Template Exercise API
      templateExercise: {
        create(exercise: Exercise) {
          const templateExercise: TemplateExercise = {
            id: createId(),
            exerciseId: exercise.id,
            name: exercise.name,
            instructions: exercise.instructions,
            templateId: template.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: "",
            userId: null,
            templateSets: proxyMap(),
            order: template.templateExercises.size,
          };

          template.templateExercises.set(templateExercise.id, templateExercise);

          template.actions.templateExercises[templateExercise.id] = {
            type: "INSERT",
            payload: templateExercise,
          };

          for (let i = 0; i < 3; i++) {
            template.api.templateSet.create(templateExercise.id);
          }
        },

        update(templateExerciseId: string, updatedTemplateExercise: UpdateTemplateExerciseSchema) {
          const templateExercise = template.templateExercises.get(templateExerciseId);

          if (!templateExercise) return;

          const existingAction = template.actions.templateExercises[templateExercise.id];

          if (existingAction && existingAction.type === "DELETE") {
            template.templateExercises.delete(templateExercise.id);
            return;
          }

          Object.assign(templateExercise, updatedTemplateExercise);

          template.actions.templateExercises[templateExercise.id] = {
            type: existingAction?.type ?? "UPDATE",
            payload: templateExercise,
          };

          return templateExercise;
        },

        delete(templateExerciseId: string) {
          const templateExercise = template.templateExercises.get(templateExerciseId);

          if (!templateExercise) return;

          template.templateExercises.delete(templateExerciseId);

          template.actions.templateExercises[templateExercise.id] = {
            type: "DELETE",
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
          const templateSet: TemplateSet = {
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
            type: "INSERT",
            payload: templateSet,
          };
        },

        update: (templateExerciseId: string, templateSetId: string, updatedTemplateSet: UpdateTemplateSetSchema) => {
          const templateSet = template.templateExercises.get(templateExerciseId)?.templateSets.get(templateSetId);

          if (!templateSet) return;

          const existingAction = template.actions.templateSets[templateSet.id];

          if (existingAction?.type === "DELETE") {
            template.templateExercises.get(templateExerciseId)?.templateSets.delete(templateSet.id);
            return;
          }

          Object.assign(templateSet, updatedTemplateSet);

          template.actions.templateSets[templateSet.id] = {
            type: existingAction?.type ?? "UPDATE",
            payload: templateSet,
          };
        },

        delete: (templateExerciseId: string, templateSetId: string) => {
          const templateSet = template.templateExercises.get(templateExerciseId)?.templateSets.get(templateSetId);

          if (!templateSet) return;

          template.templateExercises.get(templateExerciseId)?.templateSets.delete(templateSetId);

          template.actions.templateSets[templateSet.id] = {
            type: "DELETE",
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
    if (!isLoading && template && store.current.id !== template.id) {
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
