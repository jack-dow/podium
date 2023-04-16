import React, { useRef, useState } from "react";
import { View, type TextInput } from "react-native";
import { useRouter } from "expo-router";
import { createId } from "@paralleldrive/cuid2";
import { Controller, useForm } from "react-hook-form";

import { Alert, Anchor, Button, Dialog, Input, Label, Layout, Loader, OverlayManager, SafeAreaView } from "~/ui";
import {
  useExercise,
  useExerciseDeleteMutation,
  useExerciseInsertMutation,
  useExerciseUpdateMutation,
  type Exercise,
} from "~/api";

const ExerciseDeleteDialog = OverlayManager.register(({ exercise }: { exercise: Exercise }) => {
  const { visible, hide } = OverlayManager.useOverlay(ExerciseDeleteDialog);

  const deleteMutation = useExerciseDeleteMutation();

  return (
    <Dialog open={visible} onClose={hide} intent="danger">
      <Dialog.Icon />
      <Dialog.Content>
        <Dialog.Title>Delete {exercise?.name ? `"${exercise.name}"` : "Exercise"}?</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this exercise? All of the data attached to this exercise such as template
          exercises or this exercises history will be deleted forever. This action cannot be undone.
        </Dialog.Description>
      </Dialog.Content>
      <Dialog.Actions>
        <Button intent="danger" onPress={() => deleteMutation.mutate(exercise.id)} loading={deleteMutation.isLoading}>
          <Button.Text>{deleteMutation.isLoading ? "Deleting exercise..." : "Delete exercise"}</Button.Text>
        </Button>
        <Button intent="tertiary" onPress={hide} className="mt-md">
          <Button.Text>Cancel</Button.Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
});

export type ExerciseEditorFormProps = {
  name: string;
  instructions: string;
};

type ExerciseEditorProps = {
  exerciseId: string | undefined;
};

export const ExerciseEditor = ({ exerciseId }: ExerciseEditorProps) => {
  const router = useRouter();
  const [error, setError] = useState("");

  const { data: exercise, isFetching } = useExercise(exerciseId);

  const insertExerciseMutation = useExerciseInsertMutation();
  const updateExerciseMutation = useExerciseUpdateMutation(exerciseId);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors: formErrors, isDirty },
  } = useForm<ExerciseEditorFormProps>({ criteriaMode: "all" });

  const exerciseDeleteDialogAPI = OverlayManager.useOverlay(ExerciseDeleteDialog);

  const instructionsRef = useRef<TextInput>(null);

  return (
    <SafeAreaView>
      {exercise && <ExerciseDeleteDialog exercise={exercise} />}
      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>{exerciseId ? "Update Exercise" : "Create Exercise"}</Layout.Title>
            {exerciseId && (
              <Anchor onPress={() => exerciseDeleteDialogAPI.show({ exercise })} intent="danger">
                Delete Exercise
              </Anchor>
            )}
          </View>
          <Layout.Description>
            {exerciseId
              ? "Here is where you can edit the exercises you've previously created which are referenced throughout the app"
              : "Here is where you can create the exercises that will be referenced throughout the app"}
          </Layout.Description>
        </Layout.Header>

        <Layout.Content className="my-base space-y-lg px-base">
          {isFetching ? (
            <View className="flex-1 items-center justify-center">
              <Loader />
            </View>
          ) : (
            <>
              {/* Displaying errors */}
              {Object.keys(formErrors).length > 0 && (
                <Alert intent="danger">
                  <Alert.Title>There&apos;s a problem with your exercise</Alert.Title>
                  {Object.keys(formErrors).map((fieldId) => (
                    <Alert.ListItem key={fieldId}>
                      {formErrors[fieldId as keyof typeof formErrors]?.message}
                    </Alert.ListItem>
                  ))}
                </Alert>
              )}
              {!!error && (
                <Alert intent="danger">
                  <Alert.Title>Failed to submit template...</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert>
              )}

              {/* Form */}
              <View>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={exercise?.name}
                  rules={{
                    required: "Please provide a name for this exercise.",
                  }}
                  render={({ field: { value, onChange, onBlur }, fieldState }) => (
                    <>
                      <Label>Name</Label>
                      <Input
                        returnKeyType="next"
                        value={value}
                        invalid={!!fieldState.error}
                        onBlur={onBlur}
                        blurOnSubmit={false}
                        onChangeText={onChange}
                        onSubmitEditing={() => instructionsRef.current?.focus()}
                      />
                      {fieldState.error?.message && <Input.ErrorText>{fieldState.error.message}</Input.ErrorText>}
                    </>
                  )}
                />
              </View>

              <View>
                <Controller
                  name="instructions"
                  control={control}
                  defaultValue={exercise?.instructions ?? ""}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <Label>Instructions</Label>
                      <Input
                        ref={instructionsRef}
                        multiline
                        numberOfLines={8}
                        maxLength={500}
                        returnKeyType="next"
                        value={value ?? exercise?.instructions}
                        onBlur={onBlur}
                        blurOnSubmit={false}
                        onChangeText={onChange}
                      />
                    </>
                  )}
                />
              </View>

              <View className="flex-row justify-between">
                <View />
                <Button
                  loading={updateExerciseMutation.isLoading || insertExerciseMutation.isLoading}
                  disabled={!isDirty}
                  onPress={handleSubmit((data) => {
                    if (exerciseId) {
                      updateExerciseMutation.mutate(data, {
                        onSuccess() {
                          router.back();
                          reset();
                        },
                        onError(error) {
                          if (error instanceof Error) {
                            setError(error.message);
                          } else if (typeof error === "string") {
                            setError(error);
                          } else {
                            setError("Failed to update exercise. Please try again later.");
                          }
                        },
                      });
                    } else {
                      insertExerciseMutation.mutate(
                        {
                          id: createId(),
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          ...data,
                        },
                        {
                          onSuccess() {
                            router.back();
                            reset();
                          },
                          onError(error) {
                            if (error instanceof Error) {
                              setError(error.message);
                            } else if (typeof error === "string") {
                              setError(error);
                            } else {
                              setError("Failed to create exercise. Please try again later.");
                            }
                          },
                        },
                      );
                    }
                  })}
                >
                  <Button.Text>
                    {exerciseId && (updateExerciseMutation.isLoading ? "Updating exercise..." : "Update exercise")}
                    {!exerciseId && (insertExerciseMutation.isLoading ? "Creating exercise..." : "Create exercise")}
                  </Button.Text>
                </Button>
              </View>
            </>
          )}
        </Layout.Content>
      </Layout>
    </SafeAreaView>
  );
};
