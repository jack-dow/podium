import type { SxProp } from 'dripsy';
import { styled } from 'dripsy';

import { MotiPressable } from 'moti/interactions';
import { useMemo } from 'react';
import { XMarkIcon } from '@/assets/icons/mini/XMark';

const DripsyMotiPressable = styled(MotiPressable)();

interface CloseButtonProps {
  sx?: SxProp;
  styles?: {
    wrapper?: SxProp;
    icon?: SxProp;
  };
  onPress?: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ sx, styles, ...props }) => {
  return (
    <DripsyMotiPressable
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
      sx={{ borderRadius: 'md', ...styles?.wrapper, ...sx }}
      {...props}
    >
      <XMarkIcon sx={{ color: 'icon-active', ...styles?.icon }} />
    </DripsyMotiPressable>
  );
};
