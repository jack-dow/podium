import React, { useRef } from "react";
import { View, type TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { type Exercise } from "@podium/expo-api";

import { Alert, Anchor, Button, Dialog, Input, Label, Layout, Loader, OverlayManager, SafeAreaView } from "~/ui";
import { api } from "~/api";

const ExerciseDeleteDialog = OverlayManager.register(({ exercise }: { exercise: Exercise }) => {
  const { visible, hide } = OverlayManager.useOverlay(ExerciseDeleteDialog);

  const deleteMutation = api.exercise.delete.useMutation();

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
        <Button
          intent="danger"
          onPress={() => deleteMutation.mutate({ id: exercise.id })}
          loading={deleteMutation.isLoading}
        >
          <Button.Text>{deleteMutation.isLoading ? "Deleting exercise..." : "Delete exercise"}</Button.Text>
        </Button>
        <Button intent="tertiary" onPress={hide} className="mt-md">
          <Button.Text>Cancel</Button.Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
});

type ExerciseEditorProps = {
  exerciseId?: string;
};

type FormProps = {
  name: string;
  equipment: string;
  muscles: string[];
  category: string;
  instructions: string;
};

export const ExerciseEditor = ({ exerciseId }: ExerciseEditorProps) => {
  const router = useRouter();

  const { user } = useUser();
  const {
    data: exercise,
    isLoading,
    error,
  } = api.exercise.get.useQuery({ id: exerciseId! }, { enabled: Boolean(exerciseId) });

  const createExerciseMutation = api.exercise.create.useMutation();
  const updateExerciseMutation = api.exercise.update.useMutation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors: formErrors, isDirty },
  } = useForm<FormProps>({ criteriaMode: "all" });

  const onFormSubmit = handleSubmit((data) => {
    if (exercise) {
      updateExerciseMutation.mutate({ ...exercise, ...data });
    } else {
      createExerciseMutation.mutate({ ...data, userId: user?.id ?? null });
    }
    router.back();
    reset();
  });

  const exerciseDeleteDialogAPI = OverlayManager.useOverlay(ExerciseDeleteDialog);

  const instructionsRef = useRef<TextInput>(null);

  console.log({ exercise });

  return (
    <SafeAreaView>
      {exercise && <ExerciseDeleteDialog exercise={exercise} />}
      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>{exerciseId ? "Update Exercise" : "Create Exercise"}</Layout.Title>
            {exercise && (
              <Anchor onPress={() => exerciseDeleteDialogAPI.show({ exercise })} intent="danger">
                Delete Exercise
              </Anchor>
            )}
          </View>
          <Layout.Description>
            {exercise
              ? "Here is where you can edit the exercises you've previously created which are referenced throughout the app"
              : "Here is where you can create the exercises that will be referenced throughout the app"}
          </Layout.Description>
        </Layout.Header>

        <Layout.Content className="my-base space-y-lg px-base">
          {isLoading && exerciseId ? (
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
                  <Alert.Title>An error occurred...</Alert.Title>
                  <Alert.Description>{error.message}</Alert.Description>
                </Alert>
              )}

              {/* Form */}
              <View>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Please provide a name for this exercise.",
                  }}
                  render={({ field: { value, onChange, onBlur }, fieldState }) => (
                    <>
                      <Label>Name</Label>
                      <Input
                        returnKeyType="next"
                        value={value ?? exercise?.name}
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
                  loading={updateExerciseMutation.isLoading || createExerciseMutation.isLoading}
                  disabled={!isDirty}
                  onPress={onFormSubmit}
                >
                  <Button.Text>
                    {exerciseId && (updateExerciseMutation.isLoading ? "Updating exercise..." : "Update exercise")}
                    {!exerciseId && (createExerciseMutation.isLoading ? "Creating exercise..." : "Create exercise")}
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
