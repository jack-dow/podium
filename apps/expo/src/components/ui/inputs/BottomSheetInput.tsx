import { useCallback } from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { styled } from 'nativewind';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';

import type { InputProps } from './Input';
import { Input } from './Input';

function BottomSheetInputRoot({ onFocus, onBlur, ...props }: InputProps) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleInputOnFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) onFocus(e);
    },
    [onFocus, shouldHandleKeyboardEvents],
  );

  const handleInputOnBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) onBlur(e);
    },
    [onBlur, shouldHandleKeyboardEvents],
  );

  return <Input {...props} onFocus={handleInputOnFocus} onBlur={handleInputOnBlur} />;
}

export const BottomSheetInput = styled(BottomSheetInputRoot);
