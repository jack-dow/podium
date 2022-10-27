import type { SxProp, Theme } from 'dripsy';
import { Text, View, styled, useDripsyTheme } from 'dripsy';
import { MotiPressable } from 'moti/interactions';
import { useMemo } from 'react';
import { SpinnerIcon } from '@/assets/icons/Spinner';

type InteractiveColors = {
  [K in keyof Theme['colors']]: K extends `interactive-${infer C}-${string}` ? C : never;
}[keyof Theme['colors']];

const styles = {
  button: {
    sizes: {
      'xs': { py: 8, px: 10 },
      'sm': { py: 10, px: 12 },
      'md': { py: 10, px: 16, minHeight: 42 },
      'lg': { py: 10, px: 16 },
      'compact-xs': { py: 4, px: 5 },
      'compact-sm': { py: 4, px: 5 },
      'compact-md': { py: 4, px: 7 },
      'compact-lg': { py: 4, px: 7 },
    },
  },
  text: {
    sizes: {
      xs: 'xs',
      sm: 'sm',
      md: 'sm',
      lg: 'base',
    },
  },
} as const;

interface ButtonProps {
  children?: React.ReactNode;

  /** Adds icon before button label  */
  leftIcon?: React.ReactNode;

  /** Adds icon after button label  */
  rightIcon?: React.ReactNode;

  /** Controls button appearance */
  variant?: InteractiveColors;

  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /** Reduces vertical and horizontal spacing */
  compact?: boolean;

  /** Controls what happens when the button is pressed */
  onPress?: () => void;

  /** Lowers opacity to 0.5 and disables button */
  disabled?: boolean;

  /** Adds loading spinner to indicate loading state */
  loading?: boolean;

  /** Apply custom styles to the button */
  sx?: SxProp;
}

const DripsyMotiPressable = styled(MotiPressable)();

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  sx,
  compact,
  loading,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { theme } = useDripsyTheme();
  return (
    <DripsyMotiPressable
      {...props}
      transition={{
        type: 'timing',
        duration: 100,
      }}
      animate={useMemo(
        () =>
          ({ hovered, pressed }) => {
            'worklet';
            return {
              backgroundColor: pressed
                ? theme.colors[`interactive-${variant}-active`]
                : hovered
                ? theme.colors[`interactive-${variant}-hover`]
                : theme.colors[`interactive-${variant}-normal`],
              borderColor: hovered
                ? theme.colors[`interactive-${variant}-border-hover`]
                : theme.colors[`interactive-${variant}-border`],
            };
          },
        [variant, theme.colors],
      )}
      sx={{
        userSelect: 'none',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 'md',
        opacity: props.disabled || loading ? 0.5 : 1,
        // width: fullWidth ? '100%' : undefined,
        ...styles.button.sizes[compact ? (`compact-${size}` as const) : size],
        ...sx,
      }}
    >
      <View sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {(leftIcon || loading) && <View sx={{ mr: 'sm', ml: '-xs' }}>{loading ? <SpinnerIcon /> : leftIcon}</View>}

        <Text variants={[styles.text.sizes[size]]} sx={{ textAlign: 'center', color: `interactive-${variant}-text` }}>
          {children}
        </Text>

        {rightIcon && <View sx={{ mr: 'sm', ml: '-xs' }}>{rightIcon}</View>}
      </View>
    </DripsyMotiPressable>
  );
};
