import type { SxProp } from 'dripsy';
import { Text, View } from 'dripsy';

interface BadgeProps {
  color?: 'positive' | 'warning' | 'danger' | 'info';
  size?: 'basic' | 'large';
  sx?: SxProp;
  capitalize?: boolean;
  children?: string;
}

export const Badge: React.FC<BadgeProps> = ({ color = 'positive', size = 'basic', capitalize, children, sx }) => {
  return (
    <View
      sx={{
        alignItems: 'center',
        borderRadius: 'full',
        py: 2,
        px: size === 'basic' ? 10 : 12,
        bg: `background-${color}`,
        ...sx,
      }}
    >
      <Text
        variants={[size === 'basic' ? 'xs' : 'sm', `${color}-normal`]}
        sx={{ fontWeight: 'medium', textTransform: capitalize ? 'capitalize' : 'none' }}
      >
        {children}
      </Text>
    </View>
  );
};
