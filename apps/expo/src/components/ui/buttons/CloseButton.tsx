import { MotiPressable } from 'moti/interactions';
import { useMemo } from 'react';
import { XMarkIcon } from '@/assets/icons/mini/XMark';
import { useTheme } from '@/themes';

interface CloseButtonProps {
  onPress?: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ ...props }) => {
  const { radii } = useTheme();
  return (
    <MotiPressable
      transition={{ type: 'timing', duration: 100 }}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            'worklet';
            return {
              opacity: pressed ? 1 : 0.83, // tried to get it as close as possible to icon-normal
            };
          },
        [],
      )}
      style={{ borderRadius: radii.md }}
      {...props}
    >
      <XMarkIcon variant="primary" />
    </MotiPressable>
  );
};
