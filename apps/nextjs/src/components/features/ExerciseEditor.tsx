import { RadioGroup } from '@headlessui/react';
import type { exercises } from '@prisma/client';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';

import { Alert } from '../feedback/Alert';
import { Button } from '../buttons/Button';
import { Input } from '../inputs/Input';
import { Label } from '../inputs/Label';
import { Textarea } from '../inputs/Textarea';
import { Select } from '../pickers/Select';

export const equipment = [
  { value: 'barbell' },
  { value: 'bodyweight' },
  { value: 'cable' },
  { value: 'dumbbell' },
  { value: 'ez bar' },
  { value: 'kettlebell' },
  { value: 'resistance band' },
  { value: 'smith machine' },
  { value: 'trap bar' },
] as const;

export const muscles = [
  { value: 'abs' },
  { value: 'biceps' },
  { value: 'calves' },
  { value: 'chest' },
  { value: 'forearms' },
  { value: 'front delts' },
  { value: 'glutes' },
  { value: 'hamstrings' },
  { value: 'hips' },
  { value: 'lats' },
  { value: 'lower back' },
  { value: 'quads' },
  { value: 'rear delts' },
  { value: 'side delts' },
  { value: 'traps' },
  { value: 'triceps' },
  { value: 'upper back' },
] as const;

export const categories = [
  {
    value: 'small',
    description: 'Isolated and small',
  },

  {
    value: 'medium',
    description: 'Less complex multi-jointed',
  },
  {
    value: 'large',
    description: 'Complex multi-jointed',
  },
] as const;

interface FormProps {
  name: string;
  equipment: string;
  muscles: string[];
  category: string;
  instructions: string;
}

interface ExerciseEditorProps {
  exercise?: exercises;
  onSubmit: (data: FormProps) => void;
  error?: string;
  isLoading: boolean;
}

export const ExerciseEditor: React.FC<ExerciseEditorProps> = ({ exercise, onSubmit, error, isLoading }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors: formErrors, isDirty },
  } = useForm<FormProps>({ criteriaMode: 'all' });

  const onFormSubmit = handleSubmit(
    (data) => {
      onSubmit(data);
      reset(data);
    },
    () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  );

  return (
    <>
      <div className="border-b border-gray-300 pb-4 transition-colors">
        <h3 className="text-2xl font-medium leading-6 text-gray-900">Create Exercise</h3>
        <p className={clsx('mt-2 max-w-4xl text-sm text-gray-500')}>
          Here is where you can create the exercises that will be referenced throughout the app
        </p>
      </div>

      {/* Displaying errors */}
      {Object.keys(formErrors).length > 0 && (
        <Alert title="There's a problem with your exercise">
          <ul role="list" className="list-disc space-y-1 pl-5">
            {Object.keys(formErrors).map((key) => (
              <li key={key}>{formErrors[key as keyof typeof formErrors]?.message}</li>
            ))}
          </ul>
        </Alert>
      )}

      {!!error && <Alert title="An error occurred">{error}</Alert>}

      <form className="space-y-4" onSubmit={onFormSubmit}>
        {/* Exercise Name */}
        <div>
          <Label htmlFor="exercise-name">Name</Label>
          <Input
            id="exercise-name"
            required
            defaultValue={exercise?.name || ''}
            placeholder="Deadlifts"
            {...register('name')}
          />
        </div>

        {/* Exercise Equipment */}
        <Controller
          name="equipment"
          control={control}
          defaultValue={exercise?.equipment || ''}
          rules={{ required: 'Please select the equipment used to complete this exercise.' }}
          render={({ field, fieldState }) => (
            <Select label="Select equipment:" data={equipment} invalid={!!fieldState.error} {...field} />
          )}
        />

        {/* Exercise Muscles */}
        <Controller
          name="muscles"
          defaultValue={exercise?.muscles || []}
          control={control}
          rules={{ required: 'Please select which muscle group(s) this exercise targets' }}
          render={({ field }) => (
            <div>
              <Label>Select Muscle Groups</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {muscles.map((muscle) => {
                  const isSelected = field.value.some((item) => item && item === muscle.value);
                  return (
                    <Button
                      capitalize
                      key={muscle.value}
                      color={isSelected ? 'sky' : 'default'}
                      size="xs"
                      onClick={() => {
                        if (isSelected) {
                          field.onChange(field.value.filter((item) => item && item !== muscle.value));
                        } else {
                          field.onChange([...field.value, muscle.value]);
                        }
                      }}
                    >
                      {muscle.value}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        />

        {/* Exercise Category */}
        <Controller
          name="category"
          defaultValue={exercise?.category || categories[0].value}
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onChange={field.onChange}>
              <RadioGroup.Label as={Label}>Select Category</RadioGroup.Label>
              <div className="mt-1 -space-y-px rounded-md bg-white">
                {categories.map((category, settingIdx) => (
                  <RadioGroup.Option
                    key={category.value}
                    value={category.value}
                    className={({ checked }) =>
                      clsx(
                        'relative flex cursor-pointer border p-4 transition focus:outline-none',
                        settingIdx === 0 && 'rounded-t-md',
                        settingIdx === categories.length - 1 && 'rounded-b-md',
                        checked ? 'z-10 border-sky-200 bg-sky-50' : 'border-gray-200',
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <span
                          className={clsx(
                            'relative mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border transition',
                            checked ? 'border-sky-600 bg-sky-600' : 'border-gray-300 bg-white',
                            active && 'ring-2 ring-sky-500 ring-offset-2',
                          )}
                          aria-hidden="true"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        <span className="ml-3 flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className={clsx(
                              'block text-sm font-medium capitalize transition-colors',
                              checked ? 'text-sky-900' : 'text-gray-900',
                            )}
                          >
                            {category.value}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={clsx('block select-none text-sm', checked ? 'text-sky-700' : 'text-gray-500')}
                          >
                            {category.description}
                          </RadioGroup.Description>
                        </span>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
        />

        {/* Exercise Instructions */}
        <Textarea
          label="Instructions"
          defaultValue={exercise?.instructions || ''}
          id="instructions"
          {...register('instructions')}
        />

        <div className="flex w-full justify-end border-t border-gray-300 pt-4">
          <Button type="submit" color="sky" loading={isLoading} disabled={!isDirty}>
            {exercise ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </>
  );
};
