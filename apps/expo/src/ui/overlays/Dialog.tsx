import { createContext, useContext, useEffect, useState } from "react";
import { Modal, Pressable, View, type TextProps, type ViewProps } from "react-native";
import clsx from "clsx";
import { styled, variants, type VariantPropsWithoutNull } from "nativewind";

import { CheckIcon, ExclamationTriangleIcon } from "~/assets/icons/outline";
import { Text } from "../typography/Text";

type DialogContextProps = Required<Pick<DialogRootProps, "intent">> & { hasIcon: boolean; setHasIcon: () => void };

const DialogContext = createContext<DialogContextProps | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(
      "[Dialog Context] A Dialog context hook was used by a component that is not a child of a Dialog. Please fix this,",
    );
  }

  return context;
}

interface DialogRootProps {
  /** Controls whether dialog is visible on the screen */
  open: boolean;

  /** Called when the dialog is requested to closed */
  onClose: () => void;

  /** Controls the dialog position on the screen */
  position?: "bottom" | "center";

  /** Controls whether the dialog takes up the full screen width or not */
  fullWidth?: boolean;

  /** Controls the dialog intent and style */
  intent?: IconVariants["intent"];

  /** The dialog contents */
  children: React.ReactNode;
}

const DialogRoot: React.FC<DialogRootProps> = ({
  open,
  onClose,
  intent = "positive",
  children,
  position = "bottom",
  fullWidth = true,
}) => {
  const [hasIcon, setHasIcon] = useState(false);
  return (
    <DialogContext.Provider value={{ intent, hasIcon, setHasIcon: () => setHasIcon(true) }}>
      <Modal animationType="fade" transparent={true} visible={open} onRequestClose={onClose} statusBarTranslucent>
        <View className={clsx("relative min-h-full flex-1", position === "bottom" ? "justify-end" : "justify-center")}>
          <Pressable onPress={onClose} className="absolute inset-none bg-overlay" />
          <View className={clsx("p-base")}>
            <View
              className={clsx(
                "relative overflow-hidden rounded-lg bg-white px-base pb-base pt-[20px] text-left shadow-xl sm:my-xl sm:w-full sm:max-w-lg sm:p-lg",
                fullWidth && "w-full",
              )}
            >
              <View className="sm:items-start">{children}</View>
            </View>
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};

const iconVariants = variants({
  variants: {
    intent: {
      positive: "bg-positive",
      warning: "bg-warning",
      danger: "bg-danger",
    },
  },
});

type IconVariants = VariantPropsWithoutNull<typeof iconVariants>;

interface DialogIconProps {
  children?: React.ReactNode;
}
function DialogIcon({ children }: DialogIconProps) {
  const { intent, hasIcon, setHasIcon } = useDialogContext();
  const className = iconVariants({ intent });

  useEffect(() => {
    if (!hasIcon) setHasIcon();
  }, [hasIcon, setHasIcon]);

  return (
    <View
      className={clsx(
        "mx-auto h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full sm:mx-none sm:h-[40px] sm:w-[40px]",
        className,
      )}
    >
      {children}
      {!children ? (
        intent === "positive" ? (
          <CheckIcon intent={intent} />
        ) : (
          <ExclamationTriangleIcon intent={intent} />
        )
      ) : undefined}
    </View>
  );
}

function DialogContent({ children, style }: { children: React.ReactNode; style?: ViewProps["style"] }) {
  const { hasIcon } = useDialogContext();
  return (
    <View className={clsx("items-center  sm:items-start", hasIcon && "mt-md sm:ml-base sm:mt-none")} style={style}>
      {children}
    </View>
  );
}

function DialogTitle({ children, style }: { children: React.ReactNode; style?: TextProps["style"] }) {
  return (
    <Text weight="medium" className="text-center text-lg text-primary-normal sm:text-left" style={style}>
      {children}
    </Text>
  );
}

function DialogDescription({ children, style }: { children: React.ReactNode; style?: TextProps["style"] }) {
  return (
    <Text className="mt-sm px-sm  text-center text-sm text-primary-muted sm:text-left" style={style}>
      {children}
    </Text>
  );
}

function DialogActions({ children, style }: { children: React.ReactNode; style?: ViewProps["style"] }) {
  return (
    <View className="mt-lg w-full sm:mt-base sm:flex-row-reverse" style={style}>
      {children}
    </View>
  );
}

export const Dialog = Object.assign(styled(DialogRoot), {
  Icon: styled(DialogIcon),
  Title: styled(DialogTitle),
  Description: styled(DialogDescription),
  Content: styled(DialogContent),
  Actions: styled(DialogActions),
});
