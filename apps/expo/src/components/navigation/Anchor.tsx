import { Pressable, Text } from 'react-native';
import type { Theme } from '@/themes';
import { useTheme } from '@/themes';

interface AnchorProps {
  /** Link label */
  children: string;

  /** Controls anchor appearance */
  variant?: keyof Theme['colors']['interactive'];

  /** Controls the font-size of the anchor */
  size?: keyof Theme['fontSizes'];

  /** Controls what happens when the anchor is pressed */
  onPress?: () => void;
}

export const Anchor: React.FC<AnchorProps> = ({ children, size = 'sm', variant = 'primary', ...props }) => {
  const { colors, fontSizes, fontWeights } = useTheme();
  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <Text
          style={{
            fontSize: fontSizes[size],
            fontWeight: fontWeights.medium,
            color: pressed ? colors.interactive[variant].active : colors.interactive[variant].normal,
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
