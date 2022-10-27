import type { Theme } from 'dripsy';
import { Text } from 'dripsy';
import { Pressable } from 'react-native';

type InteractiveColors = {
  [K in keyof Theme['colors']]: K extends `interactive-${infer C}-${string}` ? C : never;
}[keyof Theme['colors']];

interface AnchorProps {
  /** Link label */
  children: string;

  /** Controls anchor appearance */
  variant?: InteractiveColors;

  /** Controls the font-size of the anchor */
  size?: keyof Theme['fontSizes'];

  /** Controls what happens when the anchor is pressed */
  onPress?: () => void;
}

export const Anchor: React.FC<AnchorProps> = ({ children, size = 'sm', variant = 'primary', ...props }) => {
  return (
    <Pressable
      style={{
        paddingTop: 4,
        paddingBottom: 4,
        marginTop: -4,
      }}
      {...props}
    >
      {({ pressed }) => (
        <Text
          variants={[size]}
          sx={{
            fontWeight: 'medium',
            color: pressed ? `interactive-${variant}-active` : `interactive-${variant}-normal`,
            textDecorationLine: pressed ? 'underline' : 'none',
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

Anchor.displayName = 'Anchor';
