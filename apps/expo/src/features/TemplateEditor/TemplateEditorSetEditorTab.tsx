import React, { useEffect, useRef } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import clsx from "clsx";
import { variants } from "nativewind";
import theme from "@podium/tailwind-config/theme";

import { Anchor, BottomSheet, Button, Dialog, Input, Label, OverlayManager, Text } from "~/ui";
import { type TemplateSet } from "~/api";
import { PencilIcon, TrashIcon } from "~/assets/icons/outline";
import { EllipsisVerticalIcon } from "~/assets/icons/solid";
import { TemplateContext } from "~/contexts/TemplateContext";
import { type TemplateEditorTabParamList } from "./TemplateEditor";

type TemplateEditorSetEditorTabProps = BottomTabScreenProps<TemplateEditorTabParamList, "TemplateEditorSetEditor">;

const TemplateExerciseDeleteDialog = OverlayManager.register(
  ({ templateExerciseId = "" }: { templateExerciseId?: string }) => {
    const { visible, hide } = OverlayManager.useOverlay(TemplateExerciseDeleteDialog);
    const templateExercise = TemplateContext.hooks.templateExercises.useTemplateExercise(templateExerciseId);
    const templateAPI = TemplateContext.hooks.useAPI();

    return (
      <Dialog open={visible} onClose={hide} intent="danger">
        <Dialog.Icon />
        <Dialog.Content>
          <Dialog.Title>Delete {`"${templateExercise?.name ?? "Template Exercise"}"`}</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this exercise? This action cannot be undone.
          </Dialog.Description>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            intent="danger"
            onPress={() => {
              templateAPI.templateExercise.delete(templateExerciseId);
              hide();
            }}
          >
            <Button.Text>Delete</Button.Text>
          </Button>
          <Button intent="tertiary" onPress={hide} className="mt-md">
            <Button.Text>Cancel</Button.Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  },
);

const TemplateSetTypeChangeBottomSheet = OverlayManager.register(
  ({ templateExerciseId, templateSetId }: { templateExerciseId?: string; templateSetId?: string }) => {
    const { visible, hide } = OverlayManager.useOverlay(TemplateSetTypeChangeBottomSheet);
    const templateAPI = TemplateContext.hooks.useAPI();

    const ref = useRef<GorhomBottomSheet>(null);

    const setTypes: Array<TemplateSet["type"]> = ["warmup", "working", "backoff", "dropset", "failure", "cooldown"];

    useEffect(() => {
      if (visible) {
        ref.current?.expand();
      } else {
        ref.current?.close();
      }
    }, [visible]);

    return (
      <BottomSheet ref={ref} snapPoints={[380]} hide={hide}>
        <BottomSheet.Container>
          <View className="w-full items-center justify-center pb-md">
            <Text weight="medium" className="text-base text-primary-normal">
              Select Set Type
            </Text>
          </View>
          <View className="space-y-sm px-sm">
            {Object.values(setTypes).map((setType) => {
              return (
                <Pressable
                  key={setType}
                  className="flex-row items-center space-x-md py-sm"
                  onPress={() => {
                    if (templateExerciseId && templateSetId) {
                      templateAPI.templateSet.update(templateExerciseId, templateSetId, {
                        type: setType,
                      });
                    }
                    hide();
                  }}
                >
                  <View className="min-w-[28px] items-center justify-center">
                    <Text
                      weight="medium"
                      className="text-xl"
                      style={{
                        color: theme.textColor.set[setType],
                      }}
                    >
                      {setType === "working" ? 1 : setType[0]?.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-base capitalize">{setType}</Text>
                </Pressable>
              );
            })}
          </View>
        </BottomSheet.Container>
      </BottomSheet>
    );
  },
);

const TemplateSetOptionsBottomSheet = OverlayManager.register(
  ({ templateExerciseId = "", templateSetId = "" }: { templateExerciseId?: string; templateSetId?: string }) => {
    const { visible, hide } = OverlayManager.useOverlay(TemplateSetOptionsBottomSheet);

    const templateAPI = TemplateContext.hooks.useAPI();
    const templateExerciseSetIds = TemplateContext.hooks.templateSets.useIds(templateExerciseId);

    const ref = useRef<GorhomBottomSheet>(null);

    const TemplateSetTypeChangeBottomSheetAPI = OverlayManager.useOverlayAPI(TemplateSetTypeChangeBottomSheet);
    const TemplateExerciseDeleteDialogAPI = OverlayManager.useOverlayAPI(TemplateExerciseDeleteDialog);

    useEffect(() => {
      if (visible) {
        ref.current?.expand();
      } else {
        ref.current?.close();
      }
    }, [visible]);

    return (
      <BottomSheet ref={ref} snapPoints={[380]} hide={hide}>
        <BottomSheet.Container>
          <View className="w-full items-center justify-center pb-md">
            <Text weight="medium" className="text-base text-primary-normal">
              Set Options
            </Text>
          </View>

          <View className="space-y-sm px-sm">
            <Pressable
              className="flex-row items-center space-x-md py-sm"
              onPress={() => {
                if (templateExerciseId && templateSetId) {
                  TemplateSetTypeChangeBottomSheetAPI.show({ templateExerciseId, templateSetId });
                }
                hide();
              }}
            >
              <View className="min-w-[28px] items-center justify-center">
                <PencilIcon />
              </View>
              <Text className="text-base">Change Set Type</Text>
            </Pressable>

            <Pressable
              className="flex-row items-center space-x-md py-sm"
              onPress={() => {
                if (templateExerciseId && templateSetId) {
                  if (templateExerciseSetIds.length > 1) {
                    templateAPI.templateSet.delete(templateExerciseId, templateSetId);
                  } else {
                    TemplateExerciseDeleteDialogAPI.show({ templateExerciseId });
                  }
                  hide();
                }
              }}
            >
              <View className="min-w-[28px] items-center justify-center">
                <TrashIcon />
              </View>
              <Text className="text-base">Delete Set</Text>
            </Pressable>
          </View>
        </BottomSheet.Container>
      </BottomSheet>
    );
  },
);

export const TemplateEditorSetEditorTab = (_: TemplateEditorSetEditorTabProps) => {
  const templateExerciseIds = TemplateContext.hooks.templateExercises.useIds();
  const handleSubmit = TemplateContext.hooks.useSubmit();

  return (
    <>
      <TemplateExerciseDeleteDialog />
      <TemplateSetTypeChangeBottomSheet />
      <TemplateSetOptionsBottomSheet />

      <ScrollView className="my-base space-y-lg">
        <View>
          {templateExerciseIds.map((templateExerciseId) => (
            <TemplateExerciseCard key={templateExerciseId} templateExerciseId={templateExerciseId} />
          ))}
        </View>

        <View className="flex-row justify-between px-base pb-base">
          <View />
          <Button onPress={handleSubmit}>
            <Button.Text>Create Template</Button.Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

function TemplateExerciseCard({ templateExerciseId }: { templateExerciseId: string }) {
  const templateExercise = TemplateContext.hooks.templateExercises.useTemplateExercise(templateExerciseId);
  const templateAPI = TemplateContext.hooks.useAPI();

  const TemplateExerciseDeleteDialogAPI = OverlayManager.useOverlayAPI(TemplateExerciseDeleteDialog);

  if (!templateExercise) return null;

  return (
    <>
      <View
        className={clsx(
          "mx-base space-y-md rounded-md bg-secondary p-md shadow",
          templateExercise.order > 0 && "mt-base",
        )}
      >
        <View className="flex-row items-center justify-between">
          <Text weight="medium" className="text-lg">
            {templateExercise.name}
          </Text>

          <Anchor intent="danger" onPress={() => TemplateExerciseDeleteDialogAPI.show({ templateExerciseId })}>
            Delete
          </Anchor>
        </View>

        {/* Headings */}
        <View className="border-b border-divider">
          <View className="flex-row justify-between pb-sm">
            <View className={clsx([rowStyles({ type: "set" })])}>
              <Text weight="medium" className="text-center text-base">
                Set
              </Text>
            </View>

            <View className={clsx([rowStyles({ type: "reps" })])}>
              <Text weight="medium" className="text-center text-base">
                Reps
              </Text>
            </View>

            <View className={clsx([rowStyles({ type: "comments" })])}>
              <Text weight="medium" className="text-center text-base">
                Comments
              </Text>
            </View>

            <View className={clsx([rowStyles({ type: "options" })])} />
          </View>

          {/* Template Exercise Sets */}
          <View className="space-y-md">
            {[...templateExercise.templateSets.keys()].map((templateSetId) => {
              return (
                <TemplateExerciseCardTemplateSet
                  key={templateSetId}
                  templateExerciseId={templateExerciseId}
                  templateSetId={templateSetId}
                  templateSetNumber={[...templateExercise.templateSets.values()]
                    .filter((t) => t.type !== "warmup" && t.type !== "cooldown")
                    .map((t) => t.id)
                    .indexOf(templateSetId)}
                />
              );
            })}
          </View>

          <View className="py-md">
            {templateExercise.templateSets.size < 10 && (
              <Anchor onPress={() => templateAPI.templateSet.create(templateExercise.id)}>Add another set</Anchor>
            )}
          </View>
        </View>

        <View>
          <Label>Notes</Label>
          <Input
            multiline
            numberOfLines={8}
            maxLength={200}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(value) => {
              templateAPI.templateExercise.update(templateExercise.id, { notes: value });
            }}
          />
        </View>
      </View>
    </>
  );
}

type TemplateExerciseCardSetProps = {
  templateExerciseId: string;
  templateSetId: string;
  /** If warmup or cooldown set -1 otherwise proper set number when warmup and cooldown sets are removed */
  templateSetNumber: number;
};

function TemplateExerciseCardTemplateSet({
  templateExerciseId,
  templateSetId,
  templateSetNumber,
}: TemplateExerciseCardSetProps) {
  const templateSet = TemplateContext.hooks.templateSets.useTemplateSet(templateExerciseId, templateSetId);
  const templateAPI = TemplateContext.hooks.useAPI();

  const TemplateSetTypeChangeBottomSheetAPI = OverlayManager.useOverlayAPI(TemplateSetTypeChangeBottomSheet);
  const TemplateSetOptionsBottomSheetAPI = OverlayManager.useOverlayAPI(TemplateSetOptionsBottomSheet);

  if (!templateSet) return <></>;

  return (
    <View className="flex-row pb-md">
      <Pressable
        className={clsx([rowStyles({ type: "set" })])}
        onPress={() => TemplateSetTypeChangeBottomSheetAPI.show({ templateExerciseId, templateSetId })}
      >
        <Text
          weight="medium"
          className="text-sm"
          style={{
            color: theme.textColor.set[templateSet.type ?? "working"],
          }}
        >
          {templateSet.type === "working" ? templateSetNumber + 1 : templateSet.type[0]?.toUpperCase()}
        </Text>
      </Pressable>

      <View className={clsx([rowStyles({ type: "reps" })])}>
        <TextInput
          placeholder="10-12"
          className="w-full rounded-md bg-tertiary py-sm px-md text-center text-sm"
          maxLength={7}
          value={templateSet.repetitions}
          onChangeText={(value) => {
            templateAPI.templateSet.update(templateExerciseId, templateSet.id, { repetitions: value });
          }}
          onBlur={() => {
            const validInput = templateSet?.repetitions?.match(/^([0-9]+-)?([0-9]+)$/);
            if (!validInput) {
              templateAPI.templateSet.update(templateExerciseId, templateSet.id, {
                repetitions: "",
              });
            }
          }}
        />
      </View>

      <View className={clsx([rowStyles({ type: "comments" })])}>
        <Input
          multiline={true}
          numberOfLines={6}
          maxLength={100}
          onChangeText={(value) => {
            templateAPI.templateSet.update(templateExerciseId, templateSet.id, { comments: value });
          }}
        />
      </View>

      <View className={clsx([rowStyles({ type: "options" })])}>
        <Pressable onPress={() => TemplateSetOptionsBottomSheetAPI.show({ templateExerciseId, templateSetId })}>
          <EllipsisVerticalIcon />
        </Pressable>
      </View>
    </View>
  );
}

const rowStyles = variants({
  variants: {
    type: {
      set: "w-[10%] items-center justify-center",
      reps: "w-[40%] items-center justify-center",
      comments: "w-[40%] px-md items-center justify-center",
      options: "w-[10%] items-center justify-center",
    },
  },
});
