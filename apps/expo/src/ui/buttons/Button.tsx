import { createContext, useContext, useMemo } from "react";
import { View, type ViewProps } from "react-native";
import clsx from "clsx";
import { MotiPressable } from "moti/interactions";
import { styled, variants, type VariantPropsWithoutNull } from "nativewind";
import { SpinnerIcon } from "~/assets/icons/Spinner";
import theme from "@podium/tailwind-config/theme";

import { Text, type TextProps } from "../typography/Text";

const StyledMotiPressable = styled(MotiPressable);

const buttonVariants = variants({
  variants: {
    intent: {
      primary:
        "bg-interactive-primary-active border-interactive-primary-active",
      secondary:
        "bg-interactive-secondary-active border-interactive-secondary-active",
      tertiary:
        "bg-interactive-tertiary-active border-interactive-tertiary-active",
      positive:
        "bg-interactive-positive-active border-interactive-positive-active",
      warning:
        "bg-interactive-warning-active border-interactive-warning-active",
      danger: "bg-interactive-danger-active border-interactive-danger-active",
    },
    size: {
      md: "px-base py-[10px]",
    },
  },
  defaultProps: {
    intent: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantPropsWithoutNull<typeof buttonVariants>;

export type ButtonProps = {
  /** Adds icon before button label */
  leftIcon?: React.ReactNode;

  /** Adds icon after button label */
  rightIcon?: React.ReactNode;

  /** Controls button appearance */
  intent?: ButtonVariants["intent"];

  /** Controls button size */
  size?: ButtonVariants["size"];

  /** Controls what happens when the button is pressed */
  onPress?: () => void;

  /** Lowers opacity to 0.5 and disables button */
  disabled?: boolean;

  /** Adds loading spinner to indicate loading state */
  loading?: boolean;

  /** Allows button customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style?: ViewProps["style"];
};

type ButtonContextProps = Required<Pick<ButtonProps, "intent" | "size">>;

const ButtonContext = createContext<ButtonContextProps | null>(null);

const ButtonRoot: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  intent = "primary",
  size = "md",
  loading,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const className = buttonVariants({ intent, size });

  return (
    <ButtonContext.Provider value={{ intent, size }}>
      <StyledMotiPressable
        {...props}
        transition={{
          type: "timing",
          duration: 100,
        }}
        disabled={disabled || loading}
        animate={useMemo(
          () =>
            ({ pressed }) => {
              "worklet";
              return {
                backgroundColor: pressed
                  ? theme.backgroundColor.interactive[intent].active
                  : theme.backgroundColor.interactive[intent].normal,

                borderColor: pressed
                  ? theme.borderColor.interactive[intent].active
                  : theme.borderColor.interactive[intent].normal,
              };
            },
          [intent],
        )}
        className={clsx(
          "justify-center rounded-md border border-transparent",
          (disabled || loading) && "opacity-75",
          className,
        )}
      >
        <View className="flex-row items-center justify-center">
          {(leftIcon || loading) && (
            <View className="mx-sm -ml-xs">
              {loading ? <SpinnerIcon size="sm" /> : leftIcon}
            </View>
          )}

          {children}

          {rightIcon && (
            <View className="mx-sm -mr-xs items-center">{rightIcon}</View>
          )}
        </View>
      </StyledMotiPressable>
    </ButtonContext.Provider>
  );
};

const StyledButtonText = styled(Text, "text-center", {
  variants: {
    intent: {
      primary: "text-button-primary",
      secondary: "text-button-secondary",
      tertiary: "text-button-tertiary",
      positive: "text-button-positive",
      warning: "text-button-warning",
      danger: "text-button-danger",
    },
    size: {
      md: "text-sm",
    },
  },
  defaultProps: {
    size: "md",
  },
});

function ButtonText({ children, ...props }: TextProps) {
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error(
      "[Button] Button Text was used outside of a Button. Please fix this.",
    );
  }

  return (
    <StyledButtonText
      weight="medium"
      intent={context.intent}
      size={context.size}
      {...props}
    >
      {children}
    </StyledButtonText>
  );
}

const ButtonWithClassName = styled(ButtonRoot);
export const Button = Object.assign(ButtonWithClassName, {
  Text: styled(ButtonText),
});
