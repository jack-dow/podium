import { MotiPressable } from 'moti/interactions';
import { createContext, useContext, useMemo } from 'react';
import type { StylesAsProp } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import { SpinnerIcon } from '@/assets/icons/Spinner';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';

interface ButtonProps {
  /** Adds icon before button label  */
  leftIcon?: React.ReactNode;

  /** Adds icon after button label  */
  rightIcon?: React.ReactNode;

  /** Controls button appearance */
  variant?: keyof Theme['colors']['interactive'];

  /** Button size */
  size?: keyof ReturnType<typeof textSizes> & keyof typeof buttonSizes;

  /** Reduces vertical and horizontal spacing */
  compact?: boolean;

  /** Controls what happens when the button is pressed */
  onPress?: () => void;

  /** Lowers opacity to 0.5 and disables button */
  disabled?: boolean;

  /** Adds loading spinner to indicate loading state */
  loading?: boolean;

  /** Applies custom styles to the button  */
  style?: StylesAsProp;
}

type ButtonContextProps = Required<Pick<ButtonProps, 'variant' | 'size'>>;

const ButtonContext = createContext<ButtonContextProps | null>(null);

const ButtonRoot: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  variant = 'primary',
  size = 'md',
  compact,
  loading,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { spacing, colors, borderWeights, radii } = useTheme();
  return (
    <ButtonContext.Provider value={{ variant, size }}>
      <MotiPressable
        {...props}
        transition={{
          type: 'timing',
          duration: 100,
        }}
        animate={useMemo(
          () =>
            ({ pressed }) => {
              'worklet';
              return {
                backgroundColor: pressed ? colors.interactive[variant].active : colors.interactive[variant].normal,

                borderColor: pressed
                  ? colors.interactive[variant].border.active
                  : colors.interactive[variant].border.normal,
              };
            },
          [variant, colors],
        )}
        style={[
          {
            justifyContent: 'center',
            borderWidth: borderWeights.light,
            borderRadius: radii.md,
            opacity: props.disabled || loading ? 0.5 : 1,
            ...buttonSizes[compact ? (`compact-${size}` as const) : size],
          },
          style,
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {(leftIcon || loading) && (
            <View style={{ marginHorizontal: spacing.sm, marginLeft: -spacing.xs }}>
              {loading ? <SpinnerIcon size="sm" /> : leftIcon}
            </View>
          )}

          {children}
          {rightIcon && <View style={{ marginHorizontal: spacing.sm, marginLeft: -spacing.xs }}>{rightIcon}</View>}
        </View>
      </MotiPressable>
    </ButtonContext.Provider>
  );
};

const buttonSizes = StyleSheet.create({
  'xs': { paddingVertical: 8, paddingHorizontal: 10 },
  'sm': { paddingVertical: 10, paddingHorizontal: 12 },
  'md': { paddingVertical: 10, paddingHorizontal: 16, minHeight: 42 },
  'lg': { paddingVertical: 10, paddingHorizontal: 16 },
  'compact-xs': { paddingVertical: 4, paddingHorizontal: 5, px: 5 },
  'compact-sm': { paddingVertical: 4, paddingHorizontal: 5, px: 5 },
  'compact-md': { paddingVertical: 4, paddingHorizontal: 7, px: 7 },
  'compact-lg': { paddingVertical: 4, paddingHorizontal: 7, px: 7 },
});

function ButtonText({ children }: { children: React.ReactNode }) {
  const context = useContext(ButtonContext);
  const { colors, fontSizes } = useTheme();

  if (!context) {
    throw new Error('[Button] Button Text was used outside of a Button. Please fix this.');
  }

  return (
    <Text
      style={{
        textAlign: 'center',
        color: colors.interactive[context.variant].text,
        ...textSizes(fontSizes)[context.size],
      }}
    >
      {children}
    </Text>
  );
}
const textSizes = (fontSizes: Theme['fontSizes']) => {
  return StyleSheet.create({
    xs: {
      fontSize: fontSizes.xs,
    },
    sm: {
      fontSize: fontSizes.sm,
    },
    md: {
      fontSize: fontSizes.sm,
    },
    lg: {
      fontSize: fontSizes.md,
    },
  });
};

export const Button = Object.assign(ButtonRoot, { Text: ButtonText });
