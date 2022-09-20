import type { MotiPressableProps } from 'moti/interactions';
import { MotiPressable } from 'moti/interactions';
import { forwardRef } from 'react';
import { Text } from 'react-native';

interface AnchorProps extends MotiPressableProps {
  /** Link label */
  children: string;

  className?: never;
}

export const Anchor: React.FC<AnchorProps> = (props) => {
  return (
    <MotiPressable {...props}>
      <Text className="font-medium text-sky-600">{props.children}</Text>
    </MotiPressable>
  );
};

Anchor.displayName = 'Anchor';
