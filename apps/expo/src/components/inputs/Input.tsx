import { forwardRef, useState } from 'react';
import type { TextInputProps } from 'react-native';
import type { SxProp } from 'dripsy';
import { Text, View, styled, useDripsyTheme } from 'dripsy';
import { TextInput } from 'react-native';
import { Label } from './Label';
import { ExclamationCircleIcon } from '@/assets/icons/mini/ExclamationCircle';

export interface InputProps extends TextInputProps {
  invalid?: boolean | string;
  label: string;
  // leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode;
  sx?: SxProp;
}

const DripsyTextInput = styled(TextInput)();

export const Input = forwardRef<TextInput, InputProps>(({ invalid, label, rightIcon, sx, ...props }, ref) => {
  const [inputFocused, setInputFocused] = useState(false);
  const { theme } = useDripsyTheme();

  return (
    <View>
      <Label sx={{ mb: 'xs' }}>{label}</Label>
      <View sx={{ position: 'relative', borderRadius: 'md', boxShadow: 'base' }}>
        <DripsyTextInput
          ref={ref}
          {...props}
          sx={{
            fontSize: ['md', 'sm', null],
            lineHeight: ['md', 'sm', null],
            width: '100%',
            borderRadius: 'md',
            borderWidth: 1,
            borderColor:
              inputFocused && invalid
                ? 'border-danger-active'
                : !inputFocused && invalid
                ? 'border-danger'
                : inputFocused
                ? 'border-primary-active'
                : 'border-primary',
            bg: 'white',
            py: 'sm',
            pl: 12,
            pr: rightIcon || invalid ? 40 : 12,
            color: invalid ? 'text-danger-normal' : 'text-normal',
            textAlignVertical: props.multiline ? 'top' : 'center',
            ...sx,
          }}
          onBlur={(e) => {
            if (props?.onBlur) {
              props.onBlur(e);
            }
            setInputFocused(false);
          }}
          onFocus={(e) => {
            if (props?.onFocus) {
              props.onFocus(e);
            }
            setInputFocused(true);
          }}
          placeholderTextColor={invalid ? theme.colors['placeholder-danger'] : theme.colors['placeholder-normal']}
        />

        <View sx={{ position: 'absolute', right: 0, justifyContent: 'center', pr: 12, top: 0, bottom: 0 }}>
          {invalid && !rightIcon && <ExclamationCircleIcon sx={{ color: 'icon-danger' }} />}
          {rightIcon}
        </View>
      </View>
      {typeof invalid === 'string' && (
        <Text variant="sm" sx={{ mt: 'sm', color: 'icon-danger' }}>
          {invalid}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
