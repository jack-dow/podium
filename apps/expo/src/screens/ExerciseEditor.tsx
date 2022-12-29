/* eslint-disable @typescript-eslint/quotes */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { Layout } from '@ui/layout/Layout';
import { SafeAreaView } from '@ui/layout/SafeAreaView';
import { Anchor } from '@ui/navigation/Anchor';
import { Alert } from '@ui/feedback/Alert';
import { Input } from '@ui/inputs/Input';
import { Button } from '@ui/buttons/Button';
import { Dialog } from '@ui/overlays/Dialog';
import { Label } from '@ui/inputs/Label';

import { trpc } from '@/trpc';
import type { RootStackParamList } from '@/_app';
import { getAuthSafeUser } from '@/stores/global/AuthProvider';
import { Loader } from '@/components/ui/feedback/Loader';

interface FormProps {
  name: string;
  equipment: string;
  muscles: string[];
  category: string;
  instructions: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseEditor'>;

export const ExerciseEditorScreen = ({ navigation, route }: Props) => {
  const exerciseId = route?.params?.exerciseId ?? null;
  const {
    data: exercise,
    isLoading,
    isError,
    refetch,
  } = trpc.exercise.byId.useQuery({ id: exerciseId! }, { enabled: !!exerciseId });

  const handleGoBack = () => {
    if (isDeleteModalVisible) setIsDeleteModalVisible(false);
    if (navigation.canGoBack()) navigation.goBack();
  };

  const createMutation = trpc.exercise.create.useMutation({ onSuccess: () => handleGoBack() });
  const updateMutation = trpc.exercise.update.useMutation({ onSuccess: () => handleGoBack() });
  const deleteMutation = trpc.exercise.delete.useMutation({ onSuccess: () => handleGoBack() });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors: formErrors, isDirty },
  } = useForm<FormProps>({ criteriaMode: 'all' });

  const onFormSubmit = handleSubmit(async (data) => {
    if (exercise) {
      updateMutation.mutate({ ...exercise, ...data });
    } else {
      const user = getAuthSafeUser();
      createMutation.mutate({ ...data, userId: user.id });
    }
    reset(data);
  });

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleCloseDeleteModal = () => {
    if (!deleteMutation.isLoading) setIsDeleteModalVisible(false);
  };

  const instructionsRef = useRef<TextInput>(null);

  const error = createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message;

  useFocusEffect(
    useCallback(() => {
      if (exerciseId) refetch();
    }, [exerciseId, refetch]),
  );

  useEffect(() => {
    if (exerciseId) {
      setValue('name', exercise?.name ?? '');
      setValue('instructions', exercise?.instructions ?? '');
    }
  }, [exercise, setValue, exerciseId]);

  if (exerciseId && isError) {
    return (
      <SafeAreaView className="items-center justify-center">
        <Text>An error occurred...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {exerciseId && (
        <Dialog open={isDeleteModalVisible} onClose={handleCloseDeleteModal} intent="danger">
          <Dialog.Icon />
          <Dialog.Content>
            <Dialog.Title>Delete {exercise?.name ? `"${exercise.name}"` : 'Exercise'}?</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this exercise? All of the data attached to this exercise such as template
              exercises or this exercises history will be deleted forever. This action cannot be undone.
            </Dialog.Description>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              intent="danger"
              onPress={() => deleteMutation.mutate(exerciseId)}
              loading={deleteMutation.isLoading}
            >
              <Button.Text>{deleteMutation.isLoading ? 'Deleting exercise...' : 'Delete exercise'}</Button.Text>
            </Button>
            <Button intent="tertiary" onPress={handleCloseDeleteModal} className="mt-md">
              <Button.Text>Cancel</Button.Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}

      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>{exerciseId ? 'Update Exercise' : 'Create Exercise'}</Layout.Title>
            {exerciseId && (
              <Anchor onPress={() => setIsDeleteModalVisible(true)} intent="danger">
                Delete Exercise
              </Anchor>
            )}
          </View>
          <Layout.Description>
            {exerciseId
              ? "Here is where you can edit the exercises you've previously created which are referenced throughout the app"
              : 'Here is where you can create the exercises that will be referenced throughout the app'}
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
                    required: 'Please provide a name for this exercise.',
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
                  defaultValue={exercise?.instructions || undefined}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <Label>Instructions</Label>
                      <Input
                        ref={instructionsRef}
                        multiline
                        numberOfLines={8}
                        returnKeyType="next"
                        value={value}
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
                  loading={updateMutation.isLoading || createMutation.isLoading}
                  disabled={!isDirty}
                  onPress={onFormSubmit}
                >
                  <Button.Text>
                    {exerciseId && (updateMutation.isLoading ? 'Updating exercise...' : 'Update exercise')}
                    {!exerciseId && (createMutation.isLoading ? 'Creating exercise...' : 'Create exercise')}
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
