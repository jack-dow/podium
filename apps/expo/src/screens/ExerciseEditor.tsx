/* eslint-disable @typescript-eslint/quotes */
import React, { useEffect, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useIsFocused } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import type { TextInput } from 'react-native';
import { FlatList, Text, View } from 'react-native';
import { supabase } from '@/supabase';
import type { RootStackParamList } from '@/_app';
import { Layout } from '@/components/ui/layout/Layout';
import { trpc } from '@/trpc';
import { SafeAreaView } from '@/components/ui/layout/SafeAreaView';
import { Anchor } from '@/components/ui/navigation/Anchor';
import { Modal } from '@/components/ui/overlays/Modal';
import { Alert } from '@/components/ui/feedback/Alert';
import { Input } from '@/components/ui/inputs/Input';
import { Button } from '@/components/ui/buttons/Button';
import { useTheme } from '@/themes';

interface FormProps {
  name: string;
  equipment: string;
  muscles: string[];
  category: string;
  instructions: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseEditor'>;

export const ExerciseEditorScreen = ({ navigation, route }: Props) => {
  const { exerciseId } = route.params;
  const { spacing } = useTheme();
  const { data: exercise, isLoading, isError, refetch } = trpc.exercise.byId.useQuery({ id: exerciseId });

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const createMutation = trpc.exercise.create.useMutation({
    onSuccess() {
      handleGoBack();
    },
  });

  const updateMutation = trpc.exercise.update.useMutation({
    onSuccess: () => {
      handleGoBack();
    },
  });

  const deleteMutation = trpc.exercise.delete.useMutation({
    onSuccess() {
      setIsDeleteModalVisible(false);
      handleGoBack();
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,

    formState: { errors: formErrors, isDirty },
  } = useForm<FormProps>({ criteriaMode: 'all' });

  const onFormSubmit = handleSubmit(
    async (data) => {
      if (exercise) {
        updateMutation.mutate({ ...exercise, ...data });
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          createMutation.mutate({ ...data, user: user?.id });
        }
      }
      reset(data);
    },
    () => {},
  );

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const isFocused = useIsFocused();
  const instructionsRef = useRef<TextInput>(null);

  const error = createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message;

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  useEffect(() => {
    if (exercise?.name !== undefined) {
      setValue('name', exercise.name);
    }
    if (exercise?.instructions !== null) {
      setValue('instructions', exercise?.instructions || '');
    }
  }, [exercise, setValue]);

  if (isError) {
    return (
      <SafeAreaView>
        <Text>An error occurred...</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {exercise && (
        <Modal
          open={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          intent="danger"
          title={`Delete "${exercise.name}"?`}
          description="Are you sure you want to delete this exercise? All of the data attached to this exercise will be deleted forever. This action cannot be undone."
          submitButtonText="Delete exercise"
          onSubmit={() => deleteMutation.mutate({ id: exercise.id })}
          isLoading={deleteMutation.isLoading}
        />
      )}
      <Layout
        title={exercise ? 'Update Exercise' : 'Create Exercise'}
        description={
          exercise
            ? "Here is where you can edit the exercises you've previously created which are referenced throughout the app"
            : 'Here is where you can create the exercises that will be referenced throughout the app'
        }
        titleRightSection={
          exercise && (
            <Anchor intent="danger" onPress={() => setIsDeleteModalVisible(true)}>
              Delete exercise
            </Anchor>
          )
        }
      >
        {/* Displaying errors */}
        {Object.keys(formErrors).length > 0 && (
          <Alert title="There's a problem with your exercise" style={{ marginBottom: spacing.lg }}>
            <FlatList
              data={Object.keys(formErrors)}
              renderItem={({ item }) => {
                return <Alert.ListItem>{formErrors[item as keyof typeof formErrors]?.message}</Alert.ListItem>;
              }}
            />
          </Alert>
        )}

        {!!error && (
          <Alert title="An error occurred" style={{ marginBottom: spacing.lg }}>
            {error}
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
              <Input
                label="Name"
                returnKeyType="next"
                invalid={!!fieldState.error}
                value={value}
                onBlur={onBlur}
                blurOnSubmit={false}
                onChangeText={onChange}
                onSubmitEditing={() => instructionsRef.current?.focus()}
                style={{ marginBottom: spacing.lg }}
              />
            )}
          />

          <Controller
            name="instructions"
            control={control}
            defaultValue={exercise?.instructions || undefined}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                ref={instructionsRef}
                label="Instructions"
                multiline
                numberOfLines={8}
                returnKeyType="next"
                value={value}
                onBlur={onBlur}
                blurOnSubmit={false}
                onChangeText={onChange}
                style={{
                  marginBottom: spacing.lg,
                }}
                styles={{
                  input: { minHeight: 125 },
                }}
              />
            )}
          />

          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <View />
            <Button
              loading={updateMutation.isLoading || createMutation.isLoading}
              disabled={!isDirty}
              onPress={onFormSubmit}
            >
              <Button.Text>
                {exercise && (updateMutation.isLoading ? 'Updating exercise...' : 'Update exercise')}
                {!exercise && (createMutation.isLoading ? 'Creating exercise...' : 'Create exercise')}
              </Button.Text>
            </Button>
          </View>
        </View>
      </Layout>
    </SafeAreaView>
  );
};
