import type { VariantPropsWithoutNull } from 'nativewind';

import { Modal, Pressable, View } from 'react-native';
import { createContext, useContext } from 'react';
import { styled, variants } from 'nativewind';
import clsx from 'clsx';

import { Text } from '../typography/Text';
import { ExclamationTriangleIcon } from '@/assets/icons/outline/ExclamationTriangle';
import { CheckIcon } from '@/assets/icons/outline/Check';

type DialogContextProps = Required<Pick<DialogRootProps, 'intent'>>;

const DialogContext = createContext<DialogContextProps | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(
      '[Dialog Context] A Dialog context hook was used by a component that is not a child of a Dialog. Please fix this,',
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
  position?: 'bottom' | 'center';

  /** Controls whether the dialog takes up the full screen width or not */
  fullWidth?: boolean;

  /** Controls the dialog intent and style */
  intent?: IconVariants['intent'];

  /** The dialog contents */
  children: React.ReactNode;
}

const DialogRoot: React.FC<DialogRootProps> = ({
  open,
  onClose,
  intent = 'positive',
  children,
  position = 'bottom',
  fullWidth = true,
}) => {
  return (
    <DialogContext.Provider value={{ intent }}>
      <Modal animationType="fade" transparent={true} visible={open} onRequestClose={onClose} statusBarTranslucent>
        <View
          className={clsx(
            'relative h-full flex-1 items-center',
            position === 'bottom' ? 'justify-end' : 'justify-center',
          )}
        >
          <Pressable onPress={onClose} className="absolute h-full w-full bg-overlay" />
          <View className={clsx('my-lg items-center rounded-lg bg-white p-base shadow-xl', fullWidth && 'w-full')}>
            {children}
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};

const iconVariants = variants({
  variants: {
    intent: {
      positive: 'bg-positive',
      warning: 'bg-warning',
      danger: 'bg-danger',
    },
  },
});

type IconVariants = VariantPropsWithoutNull<typeof iconVariants>;

interface DialogIconProps {
  children?: React.ReactNode;
}
function DialogIcon({ children }: DialogIconProps) {
  const { intent } = useDialogContext();
  const className = iconVariants({ intent });
  return (
    <View className={clsx('h-[40px] w-[40px] items-center justify-center rounded-full', className)}>
      {children}
      {!children ? (
        intent === 'positive' ? (
          <CheckIcon intent={intent} />
        ) : (
          <ExclamationTriangleIcon intent={intent} />
        )
      ) : undefined}
    </View>
  );
}

function DialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text weight="medium" className="text-center text-lg text-primary-normal">
      {children}
    </Text>
  );
}

function DialogDescription({ children }: { children: React.ReactNode }) {
  return <Text className="mt-sm px-sm text-center text-sm text-primary-muted">{children}</Text>;
}

export const Dialog = Object.assign(styled(DialogRoot), {
  Icon: styled(DialogIcon),
  Title: styled(DialogTitle),
  Description: styled(DialogDescription),
});
