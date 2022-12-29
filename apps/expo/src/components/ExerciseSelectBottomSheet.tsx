import { useCallback, useMemo, useRef, useState } from 'react';
import type { ViewProps } from 'react-native';
import { Keyboard, View } from 'react-native';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import GorhomBottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { MotiPressable, useMotiPressable } from 'moti/interactions';
import { styled } from 'nativewind';
import type { Exercise } from '@podium/db';
import theme from '@podium/tailwindcss/theme';

import { Button } from '@ui/buttons/Button';
import { Loader } from '@ui/feedback/Loader';
import { Text } from '@ui/typography/Text';
import { BottomSheetInput } from '@ui/inputs/BottomSheetInput';

import { MotiView } from 'moti';
import { trpc } from '@/trpc';

import { SearchIcon } from '@/assets/icons/mini/Search';
import { MinusSmallIcon } from '@/assets/icons/mini/MinusSmall';
import { PlusSmallIcon } from '@/assets/icons/mini/PlusSmall';
import { useBottomSheetBackHandler } from '@/hooks/useBottomSheetBackHandler';

const StyledBackdrop = styled(BottomSheetBackdrop);
const StyledMotiPressable = styled(MotiPressable);
const StyledMotiView = styled(MotiView);

interface ExerciseSelectBottomSheetProps {
  renderItem: (exercises: Exercise) => JSX.Element;

  buttonText?: string;

  style?: ViewProps['style'];
}

const ExerciseSelectBottomSheetRoot = ({ buttonText, renderItem, style }: ExerciseSelectBottomSheetProps) => {
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
        <Button.Text>{buttonText || 'Select Exercises'}</Button.Text>
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
              <BottomSheetInput
                placeholder="Search exercises"
                rightIcon={<SearchIcon />}
                value={searchTerm}
                onChangeText={handleSearchInput}
                onFocus={() => setIsKeyboardShowing(true)}
                onBlur={() => setIsKeyboardShowing(false)}
                className="mr-md h-[42px] flex-1"
              />
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

            {filteredItems.map((exercise) => renderItem(exercise))}
          </BottomSheetScrollView>
        </GorhomBottomSheet>
      </Portal>
    </View>
  );
};

interface BottomSheetItemProps {
  value: number;
  onAddPress: () => void;
  onDeletePress: () => void;
  exercise: Exercise;
}

function BottomSheetItemRoot({ value, onAddPress, onDeletePress, exercise }: BottomSheetItemProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-primary-normal">
      <Text weight="medium">{exercise.name}</Text>

      <View className="items-baseline bg-white p-md">
        <View className="flex-row overflow-hidden rounded-lg bg-tertiary shadow-inner">
          <StyledMotiPressable onPress={onDeletePress} className="bg-transparent p-sm pr-md">
            <AddDeleteButtonChild>
              <MinusSmallIcon muted />
            </AddDeleteButtonChild>
          </StyledMotiPressable>

          <View className="items-center justify-center">
            <Text weight="semibold" className="text-base text-primary-normal">
              {value}
            </Text>
          </View>

          <StyledMotiPressable onPress={onAddPress} className="bg-transparent p-sm pl-md">
            <AddDeleteButtonChild>
              <PlusSmallIcon muted />
            </AddDeleteButtonChild>
          </StyledMotiPressable>
        </View>
      </View>
    </View>
  );
}

function AddDeleteButtonChild({ children }: { children: React.ReactNode }) {
  const state = useMotiPressable(({ pressed }) => {
    'worklet';

    return {
      backgroundColor: pressed ? theme.backgroundColor.interactive.tertiary.active : theme.backgroundColor.white,
    };
  }, []);
  return (
    <StyledMotiView
      state={state}
      transition={{ type: 'timing', duration: 150 }}
      className="h-lg w-lg items-center justify-center rounded-md shadow"
    >
      {children}
    </StyledMotiView>
  );
}

export const ExerciseSelectBottomSheet = Object.assign(styled(ExerciseSelectBottomSheetRoot), {
  Item: styled(BottomSheetItemRoot),
});
