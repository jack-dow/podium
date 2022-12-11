import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NativeEventSubscription, ViewProps } from 'react-native';
import { BackHandler, Keyboard, View } from 'react-native';
import type { BottomSheetBackdropProps, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  useBottomSheetInternal,
} from '@gorhom/bottom-sheet';
import type { Exercise } from '@podium/db';

import { styled } from 'nativewind';
import { Portal } from '@gorhom/portal';

import { Input } from '@ui/inputs/Input';
import { Button } from '@ui/buttons/Button';
import { Loader } from '@ui/feedback/Loader';
import { Text } from '@ui/typography/Text';

import type { MotiPressableProps } from 'moti/interactions';
import { MotiPressable } from 'moti/interactions';
import theme from '@podium/tailwindcss/theme';
import { trpc } from '@/trpc';

import { useTemplateAPI, useTemplateExerciseIdsByExerciseId } from '@/stores/local/TemplateProvider';
import { SearchIcon } from '@/assets/icons/mini/Search';
import { MinusSmallIcon } from '@/assets/icons/mini/MinusSmall';
import { PlusSmallIcon } from '@/assets/icons/mini/PlusSmall';

const StyledBackdrop = styled(BottomSheetBackdrop);

const BottomSheet = ({ style }: { style?: ViewProps['style'] }) => {
  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Exercise[]>([]);
  const [filteredItems, setFilteredItems] = useState<Exercise[]>([]);
  const { isLoading, isError } = trpc.exercise.all.useQuery(
    { limit: 50 },
    {
      onSuccess: (data) => {
        setItems(data.items);
        setFilteredItems(data.items);
      },
    },
  );

  const ref = useRef<GorhomBottomSheet>(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(ref);
  const snapPoints = useMemo(() => ['35%', '65%'], []);

  const handleSheetOpen = useCallback(() => {
    ref.current?.expand();
  }, []);

  const handleSheetClose = useCallback(() => {
    if (isKeyboardShowing) {
      Keyboard.dismiss();
      setIsKeyboardShowing(false);
    }
  }, [isKeyboardShowing]);

  const handleSearchInput = (text: string) => {
    setSearchTerm(text);
    setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())));
  };

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <StyledBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} className="bg-overlay" />;
  }, []);

  return (
    <View style={style}>
      <Button onPress={handleSheetOpen}>
        <Button.Text>Select Exercises</Button.Text>
      </Button>

      <Portal>
        <GorhomBottomSheet
          ref={ref}
          index={-1}
          onClose={handleSheetClose}
          snapPoints={snapPoints}
          onChange={handleSheetPositionChange}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
        >
          <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-md">
            <View className="flex-row items-center pb-md">
              <BottomSheetSearchInput
                value={searchTerm}
                onChange={handleSearchInput}
                onFocus={() => setIsKeyboardShowing(true)}
                onBlur={() => setIsKeyboardShowing(false)}
              />

              <Button onPress={() => ref.current?.close()} className="h-[42px]">
                <Button.Text>Add</Button.Text>
              </Button>
            </View>

            {isLoading && (
              <View className="my-md items-center">
                <Loader />
              </View>
            )}

            {isError && (
              <View className="my-md">
                <Text>An unknown error occurred...</Text>
              </View>
            )}

            {filteredItems.map((exercise) => {
              return <BottomSheetItem key={exercise.id} exercise={exercise} />;
            })}
          </BottomSheetScrollView>
        </GorhomBottomSheet>
      </Portal>
    </View>
  );
};

/**
 * hook that dismisses the bottom sheet on the hardware back button press if it is visible
 * @param bottomSheetRef ref to the bottom sheet which is going to be closed/dismissed on the back press
 */
export const useBottomSheetBackHandler = (bottomSheetRef: React.RefObject<GorhomBottomSheet | null>) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(null);
  const handleSheetPositionChange = useCallback<NonNullable<BottomSheetModalProps['onChange']>>(
    (index) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener('hardwareBackPress', () => {
          bottomSheetRef.current?.close();
          return true;
        });
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );
  return { handleSheetPositionChange };
};

interface BottomSheetSearchInputProps {
  value: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

function BottomSheetSearchInput({ value, onChange, onFocus, onBlur }: BottomSheetSearchInputProps) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleInputOnFocus = useCallback(() => {
    shouldHandleKeyboardEvents.value = true;
    if (onFocus) onFocus();
  }, [onFocus, shouldHandleKeyboardEvents]);

  const handleInputOnBlur = useCallback(() => {
    shouldHandleKeyboardEvents.value = false;
    if (onBlur) onBlur();
  }, [onBlur, shouldHandleKeyboardEvents]);
  return (
    <Input
      placeholder="Search exercises"
      rightIcon={<SearchIcon />}
      value={value}
      onChangeText={onChange}
      onFocus={handleInputOnFocus}
      onBlur={handleInputOnBlur}
      className="mr-md h-[42px] flex-1"
    />
  );
}

interface BottomSheetItemProps {
  exercise: Exercise;
}

function BottomSheetItem({ exercise }: BottomSheetItemProps) {
  const templateExerciseIds = useTemplateExerciseIdsByExerciseId(exercise.id);
  const { addTemplateExercise, removeTemplateExercise } = useTemplateAPI();
  const [value, setValue] = useState(templateExerciseIds?.length ?? 0);

  useEffect(() => {
    if (templateExerciseIds && templateExerciseIds.length !== value) setValue(templateExerciseIds.length);
  }, [templateExerciseIds, value]);

  const handleAddPress = () => {
    if (!templateExerciseIds || (templateExerciseIds && templateExerciseIds.length < 10)) {
      setValue((prev) => prev + 1);
      addTemplateExercise(exercise.id);
    }
  };

  const handleDeletePress = () => {
    if (templateExerciseIds && templateExerciseIds.length > 0) {
      setValue((prev) => prev - 1);
      removeTemplateExercise(templateExerciseIds[templateExerciseIds.length - 1] ?? '');
    }
  };

  return (
    <View className="flex-row items-center justify-between border-b border-primary-normal">
      <Text weight="medium">{exercise.name}</Text>

      <AddDeleteButtons value={value} onAddPress={handleAddPress} onDeletePress={handleDeletePress} />
    </View>
  );
}

const StyledMotiPressable = styled(MotiPressable);

interface AddDeleteButtonsProps {
  value: number;
  onAddPress: () => void;
  onDeletePress: () => void;
}

function AddDeleteButtonsRoot({ value, onAddPress, onDeletePress }: AddDeleteButtonsProps) {
  return (
    <View className="items-baseline bg-white p-md">
      <View className="flex-row space-x-md rounded-lg bg-tertiary p-sm shadow-inner">
        <AddDeleteButton onPress={onDeletePress}>
          <MinusSmallIcon muted />
        </AddDeleteButton>
        <View className="items-center justify-center">
          <Text weight="semibold" className="text-base text-primary-normal">
            {value}
          </Text>
        </View>
        <AddDeleteButton onPress={onAddPress}>
          <PlusSmallIcon muted />
        </AddDeleteButton>
      </View>
    </View>
  );
}

const AddDeleteButtons = styled(AddDeleteButtonsRoot);

function AddDeleteButtonRoot({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: MotiPressableProps['style'];
}) {
  return (
    <StyledMotiPressable
      className="h-lg w-lg items-center justify-center rounded-md shadow"
      style={style}
      onPress={onPress}
      transition={{
        type: 'timing',
        duration: 150,
      }}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            'worklet';

            return {
              backgroundColor: pressed
                ? theme.backgroundColor.interactive.tertiary.active
                : theme.backgroundColor.white,
            };
          },
        [],
      )}
    >
      {children}
    </StyledMotiPressable>
  );
}

const AddDeleteButton = styled(AddDeleteButtonRoot);

export const ExerciseSelectBottomSheet = styled(BottomSheet);
