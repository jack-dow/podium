import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { styled } from 'nativewind';

import clsx from 'clsx';
import { Text } from '../typography/Text';

interface AnchorProps {
  /** Controls what happens when the anchor is pressed */
  onPress?: () => void;

  /** Link label */
  children: string;

  /** Allows button customization. Shouldn't really ever be used, only useful for space tailwind utilities */
  style: PressableProps['style'];
}

const AnchorRoot: React.FC<AnchorProps> = ({ children, ...props }) => {
  return (
    <Pressable {...props} className="focus:underline">
      {({ pressed }) => (
        <Text
          weight="medium"
          className={clsx(
            'text-sm',
            pressed ? 'text-interactive-primary-active underline' : 'text-interactive-primary-normal no-underline',
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

AnchorRoot.displayName = 'Anchor';

export const Anchor = styled(AnchorRoot);
