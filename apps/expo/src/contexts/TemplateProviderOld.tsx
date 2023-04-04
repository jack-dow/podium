import { createContext, useCallback, useContext, useRef } from "react";
import { createId } from "@paralleldrive/cuid2";
import { useFocusEffect } from "@react-navigation/native";

import type { RouterInputs, RouterOutputs } from "~/api";

type Exercise = RouterOutputs["exercise"]["get"];
export type Template = RouterOutputs["template"]["get"];
export type TemplateExercise = RouterOutputs["templateExercise"]["get"];
export type TemplateSet = RouterOutputs["templateSet"]["get"];

type GetSubmittableTemplateOutput<isTemplateNew extends boolean> = isTemplateNew extends true
  ? RouterInputs["template"]["create"]
  : RouterInputs["template"]["update"];

type TemplateStoreProps = {
  id: string;
  name: string;
  templateExercises: TemplateExercise[];
  templateSets: TemplateSet[];
};

type TemplateStoreState = {
  id: string;
  name: string;
  changed: { name: boolean };

  isNew: boolean;

  templateExercises: {
    all: Record<string, Omit<TemplateExercise, "position">>;
    existing: Array<string>;
    new: Array<string>;
    updated: Array<string>;
    deleted: Array<string>;
    /** Stored separately so you can get all template exercise ids sorted by their position without re-rending all of them when a single property is updated on one  */
    positions: Record<string, number>;
    filters: { byExerciseId: Record<string, Array<string>> };
  };
  templateSets: {
    all: Record<string, Omit<TemplateSet, "position" | "type">>;
    existing: Array<string>;
    new: Array<string>;
    updated: Array<string>;
    deleted: Array<string>;
    /** Stored separately so you can get all template set ids sorted by their position without re-rending all of them when a single property is updated on one  */
    positions: Record<
      string,
      Record<
        string,
        {
          position: number;
          type: string;
        }
      >
    >;
  };
};

type TemplateStoreAPI = {
  api: {
    setName: (name: string) => void;

    createTemplateExercise(exerciseId: Exercise): void;
    updateTemplateExercise(updatedTemplateExercise: Omit<RouterInputs["templateExercise"]["update"], "position">): void;
    deleteTemplateExercise(templateExerciseId: string): void;
    setTemplateExercisePositions(newPositions: Record<string, number>): void;

    getTemplateSet(templateSetId: string): TemplateSet | null;
    createTemplateSet(templateSetId: string): void;
    updateTemplateSet(updatedTemplateSet: Omit<RouterInputs["templateSet"]["update"], "position">): void;
    deleteTemplateSet(templateSetId: string): void;

    getSubmittableTemplate<IsTemplateNew extends boolean>(
      isTemplateNew: IsTemplateNew,
    ): GetSubmittableTemplateOutput<IsTemplateNew>;
  };
};

type TemplateStore = TemplateStoreState & TemplateStoreAPI;

const createTemplateStore = (initProps?: Partial<TemplateStoreProps>) => {
  let DEFAULT_PROPS: TemplateStoreState = {
    id: initProps?.id || uuidv4(),
    name: initProps?.name || "Legs 1",
    changed: { name: false },

    isNew: !initProps?.id,

    templateExercises: {
      all: {},
      existing: [],
      new: [],
      updated: [],
      deleted: [],
      positions: {},
      filters: { byExerciseId: {} },
    },
    templateSets: {
      all: {},
      existing: [],
      new: [],
      updated: [],
      deleted: [],
      positions: {},
    },
  };

  DEFAULT_PROPS = produce(DEFAULT_PROPS, (draft) => {
    if (initProps?.templateExercises) {
      const sortedTemplateExercises = initProps.templateExercises.sort((a, b) => a.position - b.position);
      for (let i = 0; i < sortedTemplateExercises.length; i++) {
        const { position, ...templateExercise } = sortedTemplateExercises[i]!;

        draft.templateExercises.all[templateExercise.id] = templateExercise;

        const { id } = templateExercise;

        draft.templateExercises.existing.push(id);
        draft.templateExercises.positions[id] = i;

        if (!draft.templateExercises.filters.byExerciseId[templateExercise.exerciseId]) {
          draft.templateExercises.filters.byExerciseId[templateExercise.exerciseId] = [];
        }
        draft.templateExercises.filters.byExerciseId[templateExercise.exerciseId]!.push(id);

        if (position !== i) draft.templateExercises.updated.push(id);
      }
    }
    if (initProps?.templateSets) {
      for (const templateSet of initProps.templateSets) {
        draft.templateSets.all[templateSet.id] = templateSet;

        const { id, templateExerciseId, position, type } = templateSet;

        draft.templateSets.existing.push(id);
        if (!draft.templateSets.positions[templateExerciseId]) draft.templateSets.positions[templateExerciseId] = {};
        draft.templateSets.positions[templateExerciseId]![id] = { position, type };
      }
    }
  });

  return createStore(
    immer<TemplateStore>((set, get) => ({
      ...DEFAULT_PROPS,

      api: {
        setName: (name) =>
          set((t) => {
            t.name = name;
            if (!t.changed.name) t.changed.name = true;
          }),

        // Template Exercise Functions
        createTemplateExercise: (exercise) => {
          const templateExerciseId = uuidv4();
          set((t) => {
            const user = getAuthUserOrThrow();
            const { id: exerciseId } = exercise;

            const templateExercise = {
              id: templateExerciseId,
              exerciseId,
              exercise,
              templateId: t.id,
              createdAt: new Date(),
              notes: "",
              userId: user.id,
            };

            t.templateExercises.all[templateExercise.id] = templateExercise;
            t.templateExercises.new.push(templateExercise.id);
            t.templateExercises.positions[templateExercise.id] = Object.keys(t.templateExercises.all).length - 1;
            if (!t.templateExercises.filters.byExerciseId[exerciseId]) {
              t.templateExercises.filters.byExerciseId[exerciseId] = [];
            }
            t.templateExercises.filters.byExerciseId[exerciseId]!.push(templateExercise.id);
          });

          for (let i = 0; i < 3; i++) {
            get().api.createTemplateSet(templateExerciseId);
          }
        },

        updateTemplateExercise: (updatedTemplateExercise) =>
          set((t) => {
            const { id, ...changes } = updatedTemplateExercise;

            if (t.templateExercises.all[id]) {
              t.templateExercises.all[id] = {
                ...t.templateExercises.all[id]!,
                ...changes,
              };

              if (!t.templateExercises.new.includes(id)) t.templateExercises.updated.push(id);
            }
          }),

        deleteTemplateExercise: (templateExerciseId) => {
          set((t) => {
            const templateExercise = t.templateExercises.all[templateExerciseId];

            if (!templateExercise) return;

            if (t.templateExercises.existing.includes(templateExerciseId)) {
              t.templateExercises.existing = t.templateExercises.existing.filter((id) => id !== templateExerciseId);
              t.templateExercises.deleted.push(templateExerciseId);
            }

            if (t.templateExercises.updated.includes(templateExerciseId)) {
              t.templateExercises.updated = t.templateExercises.updated.filter((id) => id !== templateExerciseId);
            }

            if (t.templateExercises.new.includes(templateExerciseId)) {
              t.templateExercises.new = t.templateExercises.new.filter((id) => id !== templateExerciseId);
            }

            for (const id in t.templateExercises.positions) {
              if (id && t.templateExercises.positions[id]! > t.templateExercises.positions[templateExerciseId]!) {
                t.templateExercises.positions[id]!--;
              }
            }

            const exerciseIdFilters = t.templateExercises.filters.byExerciseId;
            exerciseIdFilters[templateExercise.exerciseId] = exerciseIdFilters[templateExercise.exerciseId]!.filter(
              (id) => id !== templateExerciseId,
            );

            delete t.templateExercises.all[templateExerciseId];
            delete t.templateExercises.positions[templateExerciseId];
          });

          Object.values(get().templateSets.all).forEach((templateSet) => {
            if (templateSet.templateExerciseId === templateExerciseId) get().api.deleteTemplateSet(templateSet.id);
          });
        },

        setTemplateExercisePositions: (templateExercisePositions) =>
          set((t) => {
            for (const id in templateExercisePositions) {
              const currentPosition = t.templateExercises.positions[id];

              if (currentPosition && currentPosition !== templateExercisePositions[id]) {
                t.templateExercises.positions[id] = templateExercisePositions[id]!;
                if (t.templateExercises.existing.includes(id)) t.templateExercises.updated.push(id);
              }
            }
          }),

        // Template Set Functions
        getTemplateSet: (templateSetId) => {
          const templateSet = get().templateSets.all[templateSetId];
          if (!templateSet) return null;
          const { position, type } = get().templateSets.positions[templateSet.templateExerciseId]![templateSetId]!;
          return { ...templateSet, position, type };
        },
        createTemplateSet: (templateExerciseId) =>
          set((t) => {
            const user = getAuthUserOrThrow();
            const templateSet = {
              id: uuidv4(),
              createdAt: new Date(),
              templateId: t.id,
              templateExerciseId,
              reps: "",
              notes: "",
              userId: user.id,
            } as const;

            t.templateSets.all[templateSet.id] = templateSet;
            t.templateSets.new.push(templateSet.id);

            if (!t.templateSets.positions[templateExerciseId]) t.templateSets.positions[templateExerciseId] = {};
            t.templateSets.positions[templateExerciseId]![templateSet.id] = {
              position: Object.keys(t.templateSets.positions[templateExerciseId]!).length - 1,
              type: "working",
            };
          }),

        updateTemplateSet: (updatedTemplateSet) =>
          set((t) => {
            const { id, type, ...changes } = updatedTemplateSet;
            const templateSet = t.templateSets.all[id];

            if (templateSet) {
              t.templateSets.all[id] = {
                ...t.templateSets.all[id]!,
                ...changes,
              };

              if (type) {
                t.templateSets.positions[templateSet.templateExerciseId]![id]!.type = type;
              }

              if (!t.templateSets.new.includes(id)) t.templateSets.updated.push(id);
            }
          }),

        deleteTemplateSet: (templateSetId) =>
          set((t) => {
            const templateSet = t.templateSets.all[templateSetId];

            if (!templateSet) return;

            if (t.templateSets.existing.includes(templateSetId)) {
              t.templateSets.existing = t.templateSets.existing.filter((id) => id !== templateSetId);
              t.templateSets.deleted.push(templateSetId);
            }

            if (t.templateSets.updated.includes(templateSetId)) {
              t.templateSets.updated = t.templateSets.updated.filter((id) => id !== templateSetId);
            }

            if (t.templateSets.new.includes(templateSetId)) {
              t.templateSets.new = t.templateSets.new.filter((id) => id !== templateSetId);
            }

            const templateExerciseSetPositions = t.templateSets.positions[templateSet.templateExerciseId]!;
            for (const id in templateExerciseSetPositions) {
              if (templateExerciseSetPositions[id]! > templateExerciseSetPositions[templateSetId]!) {
                t.templateSets.positions[templateSet.templateExerciseId]![id]!.position--;
              }
            }

            delete t.templateSets.positions[templateSet.templateExerciseId]![templateSetId];
            delete t.templateSets.all[templateSetId];
          }),

        getSubmittableTemplate: <IsTemplateNew extends boolean>(isTemplateNew: IsTemplateNew) => {
          const userId = getAuthUserOrThrow().id;
          const t = get();

          if (isTemplateNew) {
            const templateCreate: GetSubmittableTemplateOutput<true> = {
              id: t.id,
              name: t.name,
              userId,
              templateExercises: Object.values(t.templateExercises.all).map((templateExercise) => ({
                ...templateExercise,
                position: t.templateExercises.positions[templateExercise.id] ?? 0,
              })),
              templateSets: Object.values(t.templateSets.all).map((templateSet) => ({
                ...templateSet,
                ...(t.templateSets.positions[t.templateSets.all[templateSet.id]!.templateExerciseId]?.[
                  templateSet.id
                ] ?? {
                  position: 0,
                  type: "working",
                }),
              })),
            };
            return templateCreate as GetSubmittableTemplateOutput<IsTemplateNew>;
          }

          const templateUpdate: GetSubmittableTemplateOutput<false> = {
            id: t.id,
            name: t.changed.name ? t.name : undefined,
            userId,
            templateExercises: {
              new: t.templateExercises.new.map((id) => ({
                ...t.templateExercises.all[id]!,
                position: t.templateExercises.positions[id]!,
              })),
              updated: t.templateExercises.updated.map((id) => ({
                ...t.templateExercises.all[id]!,
                position: t.templateExercises.positions[id]!,
              })),
              deleted: t.templateExercises.deleted,
            },
            templateSets: {
              new: t.templateSets.new.map((id) => ({
                ...t.templateSets.all[id]!,
                ...(t.templateSets.positions[t.templateSets.all[id]!.templateExerciseId]?.[id] ?? {
                  position: 0,
                  type: "working",
                }),
              })),
              updated: t.templateSets.updated.map((id) => ({
                ...t.templateSets.all[id]!,
                ...(t.templateSets.positions[t.templateSets.all[id]!.templateExerciseId]?.[id] ?? {
                  position: 0,
                  type: "working",
                }),
              })),
              deleted: t.templateSets.deleted,
            },
          };
          return templateUpdate as GetSubmittableTemplateOutput<IsTemplateNew>;
        },
      },
    })),
  );
};

type CreatedTemplateStore = ReturnType<typeof createTemplateStore>;

const TemplateContext = createContext<CreatedTemplateStore | null>(null);

function useTemplateContext<T>(selector: (state: TemplateStore) => T, equalityFn?: (left: T, right: T) => boolean): T {
  const store = useContext(TemplateContext);
  if (!store) {
    throw new Error(
      "[Template Context] A component tried to use Template Context without being a child of a TemplateProvider or the TemplateProvider store includes not been initialized yet. Please fix this",
    );
  }
  return useStore(store, selector, equalityFn);
}

type TemplateProviderProps = {
  template: Template | null;
  isLoading: boolean;
};

export function TemplateProvider({ children, template, isLoading }: React.PropsWithChildren<TemplateProviderProps>) {
  const storeRef = useRef<CreatedTemplateStore>();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // @ts-expect-error - This is a hack to destroy the store and ensure it doesn't keep taking up memory (i think)
        storeRef.current?.setState(null);
        storeRef.current = undefined;
      };
    }, []),
  );

  if (!storeRef.current && !isLoading) {
    storeRef.current = createTemplateStore(
      template
        ? {
            id: template.id,
            name: template.name,
            templateExercises: template.templateExercises,
            templateSets: template.templateSets,
          }
        : {},
    );
  }

  return <TemplateContext.Provider value={storeRef.current || null}>{children}</TemplateContext.Provider>;
}

export const useTemplateAPI = () => useTemplateContext((s) => s.api);

// Template Info Hooks
export const useTemplateId = () => useTemplateContext((s) => s.id);
export const useTemplateName = () => useTemplateContext((s) => s.name);
export const useTemplateIsNew = () => useTemplateContext((s) => s.isNew);

// Template Exercise Hooks
export const useTemplateExerciseIds = () =>
  useTemplateContext((s) => {
    const templateExerciseIds = Object.entries(s.templateExercises.positions)
      .sort((a, b) => a[1] - b[1])
      .map((a) => a[0]);

    return templateExerciseIds;
  });

/** NOTE: Not sorted by position, instead by creation order */
export const useTemplateExerciseIdsByExerciseId = (exerciseId: string) =>
  useTemplateContext((s) => Object.values(s.templateExercises.filters.byExerciseId[exerciseId] ?? {}));

export const useTemplateExercisePositions = () => useTemplateContext((s) => s.templateExercises.positions);

export const useTemplateExercise = (templateExerciseId: string): TemplateExercise | null =>
  useTemplateContext((s) => {
    const templateExercise = s.templateExercises.all[templateExerciseId];
    const position = s.templateExercises.positions[templateExerciseId] ?? 0;

    if (!templateExercise) return null;

    return { ...templateExercise, position };
  });

// Template Set Hooks
export const useTemplateExerciseSetIds = (templateExerciseId: string) =>
  useTemplateContext((s) => {
    const templateExerciseSetPositions = s.templateSets.positions[templateExerciseId];

    if (!templateExerciseSetPositions) return [];

    return Object.entries(templateExerciseSetPositions)
      .sort((a, b) => a[1].position - b[1].position)
      .map((a) => a[0]);
  });

export const useTemplateExerciseSetPositions = (templateExerciseId: string) =>
  useTemplateContext((s) => s.templateSets.positions[templateExerciseId] ?? {});

export const useTemplateSet = (templateSetId: string): TemplateSet | null =>
  useTemplateContext((s) => {
    const templateSet = s.templateSets.all[templateSetId];
    if (!templateSet) return null;
    const { position, type } = s.templateSets.positions[templateSet?.templateExerciseId]?.[templateSetId] ?? {
      position: 0,
      type: "working",
    };
    return { ...templateSet, position, type };
  });
