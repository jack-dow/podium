import { forwardRef, useState } from 'react';
import type { StylesAsProp, TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Label } from './Label';
import { ExclamationCircleIcon } from '@/assets/icons/mini/ExclamationCircle';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  invalid?: boolean | string;
  label?: string;
  // leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode;
  style?: StylesAsProp;
  styles?: {
    label?: StylesAsProp;
    wrapper?: StylesAsProp;
    input?: StylesAsProp;
    rightIconWrapper?: StylesAsProp;
    invalidText?: StylesAsProp;
  };
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ invalid, label, rightIcon, style, styles, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const { radii, shadows, fontSizes, lineHeights, colors, spacing } = useTheme();

    return (
      <View style={style}>
        {label && <Label style={styles?.label}>{label}</Label>}
        <View
          style={[
            { position: 'relative', borderRadius: radii.md, ...shadows.base, marginTop: spacing.xs },
            styles?.wrapper,
          ]}
        >
          <TextInput
            ref={ref}
            {...props}
            style={[
              {
                fontSize: fontSizes.sm,

                width: '100%',
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor:
                  isFocused && invalid
                    ? colors.border.danger.active
                    : !isFocused && invalid
                    ? colors.border.danger.normal
                    : isFocused
                    ? colors.border.primary.active
                    : colors.border.primary.normal,
                backgroundColor: 'white',
                paddingVertical: spacing.sm,

                paddingLeft: spacing.sm,
                paddingRight: rightIcon || invalid ? 40 : spacing.base,
                color: invalid ? colors.text.danger.normal : colors.text.primary.normal,
                textAlignVertical: props.multiline ? 'top' : 'center',
              },
              styles?.input,
            ]}
            onBlur={(e) => {
              if (props?.onBlur) {
                props.onBlur(e);
              }
              setIsFocused(false);
            }}
            onFocus={(e) => {
              if (props?.onFocus) {
                props.onFocus(e);
              }
              setIsFocused(true);
            }}
            placeholderTextColor={invalid ? colors.placeholder.danger : colors.placeholder.normal}
          />

          <View
            style={[
              {
                position: 'absolute',
                right: 0,
                justifyContent: 'center',
                paddingRight: spacing.base,
                top: 0,
                bottom: 0,
              },
              styles?.rightIconWrapper,
            ]}
          >
            {invalid && !rightIcon && <ExclamationCircleIcon variant="danger" active={isFocused} />}
            {rightIcon}
          </View>
        </View>
        {typeof invalid === 'string' && (
          <Text
            style={[
              { marginTop: spacing.sm, fontSize: fontSizes.sm, color: colors.text.danger.muted },
              styles?.invalidText,
            ]}
          >
            {invalid}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
