import type { StylesAsProp } from 'react-native';
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { createContext, useContext } from 'react';
import { Button } from '../buttons/Button';

import { ExclamationTriangleIcon } from '@/assets/icons/outline/ExclamationTriangle';

import { CheckIcon } from '@/assets/icons/outline/Check';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';

type DialogContextProps = Required<Pick<DialogRootProps, 'variant' | 'isLoading' | 'onClose'>>;

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
  open: boolean;
  onClose: () => void;
  position?: 'bottom' | 'center';
  fullWidth?: boolean;
  variant?: keyof Pick<Theme['colors']['interactive'], 'positive' | 'warning' | 'danger'>;
  isLoading?: boolean;
  children: React.ReactNode;
}

const DialogRoot: React.FC<DialogRootProps> = ({
  open,
  onClose,
  variant = 'positive',
  isLoading = false,
  children,
  position = 'bottom',
  fullWidth = true,
}) => {
  const { width } = useWindowDimensions();
  const { spacing, colors, radii, shadows } = useTheme();
  return (
    <DialogContext.Provider value={{ variant, isLoading, onClose }}>
      <Modal animationType="fade" transparent={true} visible={open} onRequestClose={onClose} statusBarTranslucent>
        <View
          style={{
            flex: 1,
            justifyContent: position === 'bottom' ? 'flex-end' : 'center',
            alignItems: 'center',
            position: 'relative',
            height: '100%',
          }}
        >
          <Pressable
            onPress={onClose}
            style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.background.overlay }}
          />
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radii.lg,
              padding: spacing.base,
              marginVertical: spacing.lg,
              alignItems: 'center',
              width: fullWidth ? '100%' : undefined,
              maxWidth: width - spacing.lg,
              ...shadows.xl,
            }}
          >
            {children}
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};

interface DialogIconProps {
  children?: React.ReactNode;
}
function DialogIcon({ children }: DialogIconProps) {
  const { colors, radii } = useTheme();
  const { variant } = useDialogContext();
  return (
    <View
      style={{
        height: 48,
        width: 48,
        backgroundColor: colors.background[variant],
        borderRadius: radii.full,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
      {!children ? (
        variant === 'positive' ? (
          <CheckIcon variant={variant} />
        ) : (
          <ExclamationTriangleIcon variant={variant} />
        )
      ) : undefined}
    </View>
  );
}

interface DialogSubmitButtonProps {
  children: React.ReactNode;
  onSubmit: () => void;
  style?: StylesAsProp;
}
function DialogSubmitButton({ children, style, onSubmit }: DialogSubmitButtonProps) {
  const { variant, isLoading } = useDialogContext();
  return (
    <Button variant={variant} loading={isLoading} onPress={onSubmit} style={style}>
      {children}
    </Button>
  );
}

interface DialogCancelButtonProps {
  children?: React.ReactNode;
  style?: StylesAsProp;
}
function DialogCancelButton({ children, style }: DialogCancelButtonProps) {
  const { spacing } = useTheme();
  const { onClose } = useDialogContext();
  return (
    <Button variant="tertiary" onPress={onClose} style={style}>
      {children || <Button.Text>Cancel</Button.Text>}
    </Button>
  );
}
const DialogButtonText = Button.Text;

function DialogTitle({ children }: { children: React.ReactNode }) {
  const { fontWeights, fontSizes, colors } = useTheme();
  return (
    <Text
      style={[
        {
          fontWeight: fontWeights.medium,
          textAlign: 'center',
          fontSize: fontSizes.lg,
          color: colors.text.primary.normal,
        },
      ]}
    >
      {children}
    </Text>
  );
}

function DialogDescription({ children }: { children: React.ReactNode }) {
  const { spacing, fontSizes, colors } = useTheme();
  return (
    <Text
      style={{
        marginTop: spacing.sm,
        textAlign: 'center',
        paddingHorizontal: spacing.sm,
        fontSize: fontSizes.sm,
        color: colors.text.primary.muted,
      }}
    >
      {children}
    </Text>
  );
}

export const Dialog = Object.assign(DialogRoot, {
  Icon: DialogIcon,
  SubmitButton: DialogSubmitButton,
  CancelButton: DialogCancelButton,
  ButtonText: DialogButtonText,
  Title: DialogTitle,
  Description: DialogDescription,
});
