import { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { type BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { Exercise } from "@podium/expo-api";

import { Alert, Button, Input, Label, OverlayManager } from "~/ui";
import { TemplateContext } from "~/contexts/TemplateContext";
import { ExerciseSelectBottomSheet } from "../ExerciseSelectBottomSheet";
import { SortableExerciseList } from "../SortableExerciseList";
import { type TemplateEditorTabParamList } from "./TemplateEditor";
import { templateEditorStepsCompleteProxy } from "./TemplateEditorTabBar";

type TemplateEditorExerciseSelectTabProps = BottomTabScreenProps<
  TemplateEditorTabParamList,
  "TemplateEditorExerciseSelect"
>;

export function TemplateEditorExerciseSelectTab({ navigation }: TemplateEditorExerciseSelectTabProps) {
  const templateName = TemplateContext.hooks.template.useName();
  const templateExerciseIds = TemplateContext.hooks.templateExercises.useIds();
  const templateAPI = TemplateContext.hooks.useAPI();

  const [nameError, setNameError] = useState<string | null>(null);
  const [templateExercisesError, setTemplateExercisesError] = useState<string | null>(null);

  const TemplateExerciseSelectBottomSheetAPI = OverlayManager.useOverlay(TemplateExerciseSelectBottomSheet);

  return (
    <>
      <TemplateExerciseSelectBottomSheet onCreatePress={() => setTemplateExercisesError(null)} />

      <ScrollView className="my-base space-y-lg px-base">
        {/* Displaying errors */}
        {(nameError || templateExercisesError) && (
          <Alert intent="danger">
            <Alert.Title>There&apos;s a problem with your template</Alert.Title>
            <Alert.Content>
              {nameError && <Alert.ListItem>{nameError}</Alert.ListItem>}
              {templateExercisesError && <Alert.ListItem>{templateExercisesError}</Alert.ListItem>}
            </Alert.Content>
          </Alert>
        )}

        <View>
          <Label>Name</Label>
          <Input
            value={templateName}
            onChangeText={(value) => {
              templateAPI.template.setName(value);
              if (nameError) setNameError(null);
            }}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </View>

        <View>
          <Button onPress={() => TemplateExerciseSelectBottomSheetAPI.show()}>
            <Button.Text>Select Exercises</Button.Text>
          </Button>
        </View>

        {/* Wrapped in View so that space-y util works properly */}
        <View>
          <TemplateSortableExerciseList />
        </View>

        <View className="flex-row justify-between">
          <View />
          <Button
            onPress={() => {
              if (!templateName) {
                setNameError("Please enter a name for your template.");
                templateEditorStepsCompleteProxy.stepsComplete = 0;
                return;
              }

              if (templateExerciseIds.length === 0) {
                setTemplateExercisesError("Please select at least one exercise.");
                templateEditorStepsCompleteProxy.stepsComplete = 0;
                return;
              }

              if (!nameError && !templateExercisesError) {
                templateEditorStepsCompleteProxy.stepsComplete = 1;
                navigation.navigate("TemplateEditorSetEditor");
              }
            }}
          >
            <Button.Text>Next Step</Button.Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

const TemplateExerciseSelectBottomSheet = OverlayManager.register(
  ({ onCreatePress }: { onCreatePress: () => void }) => {
    const { visible, hide } = OverlayManager.useOverlay(TemplateExerciseSelectBottomSheet);

    return (
      <ExerciseSelectBottomSheet
        visible={visible}
        hide={hide}
        renderItem={(exercise) => {
          return (
            <TemplateExerciseSelectBottomSheetItem
              key={exercise.id}
              exercise={exercise}
              onCreatePress={onCreatePress}
            />
          );
        }}
      />
    );
  },
);

function TemplateExerciseSelectBottomSheetItem({
  exercise,
  onCreatePress,
}: {
  exercise: Exercise;
  onCreatePress: () => void;
}) {
  const templateAPI = TemplateContext.hooks.useAPI();
  const templateExercises = TemplateContext.hooks.templateExercises.useIdsByExerciseId(exercise.id);
  const value = templateExercises.length;

  return (
    <ExerciseSelectBottomSheet.Item
      value={value}
      onCreatePress={() => {
        if (value < 10) {
          templateAPI.templateExercise.create(exercise);
          onCreatePress();
        }
      }}
      onDeletePress={() => {
        if (value > 0) {
          templateAPI.templateExercise.delete(templateExercises.pop()!);
        }
      }}
      exercise={exercise}
    />
  );
}

function TemplateSortableExerciseList() {
  const template = TemplateContext.hooks.useTemplateContext();
  const templateAPI = TemplateContext.hooks.useAPI();
  const templateExerciseIds = TemplateContext.hooks.templateExercises.useIds();

  return (
    <SortableExerciseList
      exerciseIds={templateExerciseIds}
      useExercise={(exerciseId) => TemplateContext.hooks.templateExercises.useTemplateExercise(exerciseId)!}
      onDragEnd={(newOrder) => {
        template.templateExercises.forEach((templateExercise) => {
          if (templateExercise.order !== newOrder[templateExercise.id]) {
            templateAPI.templateExercise.update({
              id: templateExercise.id,
              order: newOrder[templateExercise.id],
            });
          }
        });
      }}
    />
  );
}
