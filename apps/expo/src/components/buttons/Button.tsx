import clsx from 'clsx';
import { Text, View } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useMemo } from 'react';

const styles = {
  button: {
    colors: {
      default: clsx('border-gray-300 bg-white shadow-sm', 'hover:bg-gray-50 focus:ring-sky-600'),
      slate: clsx('border-transparent bg-slate-900 ', 'hover:bg-slate-700 focus:ring-slate-700'),
      sky: clsx('border-transparent bg-sky-600', 'hover:bg-sky-800 focus:ring-sky-600'),
    },
    sizes: {
      xs: clsx('rounded-md py-2 px-2.5 text-sm'),
      sm: clsx('rounded-md py-2.5 px-3 text-sm'),
      md: clsx('rounded-md py-2.5 px-4 text-sm'),
      lg: clsx('rounded-md py-2.5 px-4 text-base'),
    },
  },
  text: {
    default: 'text-gray-700',
    slate: 'text-white',
    sky: 'text-white',
  },
} as const;

interface ButtonProps {
  children?: React.ReactNode;

  /** Button color */
  color?: keyof typeof styles.button.colors;

  /** Button size */
  size?: keyof typeof styles.button.sizes;

  /** Sets button width to 100% of parent element */
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, color = 'default', size = 'md', fullWidth, ...props }) => {
  return (
    <MotiPressable
      transition={{
        type: 'timing',
        duration: 100,
      }}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            'worklet';
            return {
              opacity: pressed ? 0.75 : 1,
            };
          },
        [],
      )}
    >
      <View
        className={clsx(
          'inline-flex select-none justify-center border font-medium transition duration-100',
          styles.button.colors[color],
          styles.button.sizes[size],
          fullWidth && 'w-full',
        )}
      >
        <Text className={clsx('text-center', styles.text[color])}>{children}</Text>
      </View>
    </MotiPressable>
  );
};
