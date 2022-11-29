import { Pressable, Modal as RNModal, Text, View, useWindowDimensions } from 'react-native';
import { Button } from '../buttons/Button';

import { Overlay } from './Overlay';
import { ExclamationTriangleIcon } from '@/assets/icons/outline/ExclamationTriangle';

import { CheckIcon } from '@/assets/icons/outline/Check';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void;
  description: string;
  submitButtonText: string;
  icon?: React.ReactNode;
  variant?: keyof Pick<Theme['colors']['interactive'], 'positive' | 'warning' | 'danger'>;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  icon,
  variant = 'positive',
  title,
  description,
  onSubmit,
  submitButtonText,
  isLoading = false,
}) => {
  const { width } = useWindowDimensions();
  const { spacing, colors, fontSizes, fontWeights, radii, shadows } = useTheme();
  return (
    <RNModal animationType="fade" transparent={true} visible={open} onRequestClose={onClose} statusBarTranslucent>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
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
            width: '100%',
            maxWidth: width - spacing.lg,
            ...shadows.xl,
          }}
        >
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
            {icon || variant === 'positive' ? (
              <CheckIcon variant={variant} />
            ) : (
              <ExclamationTriangleIcon variant={variant} />
            )}
          </View>
          <View style={{ paddingTop: spacing.sm }}>
            <Text
              style={{
                fontWeight: fontWeights.medium,
                textAlign: 'center',
                fontSize: fontSizes.lg,
                color: colors.text.primary.normal,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                marginTop: spacing.sm,
                textAlign: 'center',
                paddingHorizontal: spacing.sm,
                fontSize: fontSizes.sm,
                color: colors.text.primary.muted,
              }}
            >
              {description}
            </Text>
          </View>
          <View style={{ paddingTop: spacing.base, width: '100%' }}>
            <Button variant={variant} loading={isLoading} onPress={onSubmit}>
              <Button.Text>{submitButtonText}</Button.Text>
            </Button>
            <Button variant="tertiary" onPress={onClose} style={{ marginBottom: spacing.sm }}>
              <Button.Text>Cancel</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    </RNModal>
  );
};
