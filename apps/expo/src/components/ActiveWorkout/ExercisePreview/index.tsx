import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { styled } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import type { Exercise } from '@podium/db';
import { Label } from '@/components/ui/inputs/Label';
import { Input } from '@/components/ui/inputs/Input';
import { ExerciseSelectBottomSheet } from '@/components/ExerciseSelectBottomSheet';

function ExercisePreviewRoot({ setIsKeyboardShowing }: { setIsKeyboardShowing: (value: boolean) => void }) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  return (
    <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }} className="my-base flex-1 space-y-lg px-base">
      <View>
        <Label>Name</Label>
        <Input
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (nameError) setNameError(null);
          }}
          onFocus={() => setIsKeyboardShowing(true)}
          onBlur={() => setIsKeyboardShowing(false)}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <ExerciseSelectBottomSheet
        renderItem={(exercise) => <ExerciseSelectBottomSheetItem key={exercise.id} exercise={exercise} />}
      />
    </BottomSheetScrollView>
  );
}

function ExerciseSelectBottomSheetItem({ exercise }: { exercise: Exercise }) {
  const [value, setValue] = useState(0);
  return (
    <ExerciseSelectBottomSheet.Item
      value={value}
      exercise={exercise}
      onAddPress={() => setValue((prev) => prev + 1)}
      onDeletePress={() => setValue((prev) => prev - 1)}
    />
  );
}

export const ExercisePreview = styled(ExercisePreviewRoot);
