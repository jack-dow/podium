import clsx from 'clsx';

interface BadgeProps {
  color?: keyof typeof styles.colors;
  size?: keyof typeof styles.sizes;
  capitalize?: boolean;
  children?: React.ReactNode;
}

const styles = {
  colors: {
    gray: 'bg-gray-100 text-gray-800',
    sky: 'bg-sky-100 text-sky-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
  },
  sizes: {
    basic: 'px-2.5 text-xs',
    large: 'px-3 text-sm',
  },
} as const;

export const Badge: React.FC<BadgeProps> = ({ color = 'sky', size = 'basic', capitalize, children }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full py-0.5 font-medium',
        styles.colors[color],
        styles.sizes[size],
        capitalize && 'capitalize',
      )}
    >
      {children}
    </span>
  );
};
