import { View } from 'dripsy';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { TextInput } from 'react-native';
import { FlatList } from 'react-native';

import { Input } from '../../inputs/Input';
import { Alert } from '../../feedback/Alert';
import { Button } from '@/components/buttons/Button';

interface Exercise {
  id: string;
  created_at: Date;
  name: string;
  instructions: string | null;
  user: string;
}

interface FormProps {
  name: string;
  equipment: string;
  muscles: string[];
  category: string;
  instructions: string;
}

interface ExerciseEditorProps {
  exercise?: Exercise;
  onSubmit: (data: FormProps) => void;
  error?: string;
  isLoading: boolean;
}
export const ExerciseEditor: React.FC<ExerciseEditorProps> = ({ exercise, onSubmit, error, isLoading }) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,

    formState: { errors: formErrors, isDirty },
  } = useForm<FormProps>({ criteriaMode: 'all' });

  const onFormSubmit = handleSubmit(
    (data) => {
      onSubmit({ ...exercise, ...data });
      reset(data);
    },
    () => {},
  );

  const instructionsRef = useRef<TextInput>(null);

  useEffect(() => {
    if (exercise?.name !== undefined) {
      setValue('name', exercise.name);
    }
    if (exercise?.instructions !== null) {
      setValue('instructions', exercise?.instructions || '');
    }
  }, [exercise, setValue]);

  return (
    <View sx={{ flex: 1 }}>
      {/* Displaying errors */}
      {Object.keys(formErrors).length > 0 && (
        <Alert title="There's a problem with your exercise" sx={{ mb: 'lg' }}>
          <FlatList
            data={Object.keys(formErrors)}
            renderItem={({ item }) => {
              return <Alert.ListItem>{formErrors[item as keyof typeof formErrors]?.message}</Alert.ListItem>;
            }}
          />
        </Alert>
      )}

      {!!error && <Alert title="An error occurred">{error}</Alert>}

      {/* Form */}
      <View sx={{ mb: 'lg' }}>
        <View sx={{ mb: 'lg' }}>
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
                onChangeText={(value) => onChange(value)}
                onSubmitEditing={() => instructionsRef.current?.focus()}
              />
            )}
          />
        </View>

        <View sx={{ mb: 'lg' }}>
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
                onChangeText={(value) => onChange(value)}
                sx={{
                  minHeight: 125,
                }}
                //   onSubmitEditing={() => passwordRef.current?.focus()}
              />
            )}
          />
        </View>

        <View sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <View />
          <Button loading={isLoading} disabled={!isDirty} onPress={onFormSubmit}>
            {exercise && (isLoading ? 'Updating exercise...' : 'Update exercise')}
            {!exercise && (isLoading ? 'Creating exercise...' : 'Create exercise')}
          </Button>
        </View>
      </View>
    </View>
  );
};
