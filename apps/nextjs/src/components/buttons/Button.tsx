import { forwardRef } from 'react';
import clsx from 'clsx';
import { SpinnerIcon } from '@/assets/icons/SpinnerIcon';

interface ButtonOwnProps {
  /** Button type attribute */
  type?: 'submit' | 'button' | 'reset';

  /** Adds icon before button label  */
  leftIcon?: React.ReactNode;

  /** Adds icon after button label  */
  rightIcon?: React.ReactNode;

  /** Button label */
  children?: React.ReactNode;

  /** Indicate loading state */
  loading?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Capitalize text */
  capitalize?: boolean;

  /** Sets button width to 100% of parent element */
  fullWidth?: boolean;

  /** Button color */
  color?: keyof typeof styles.colors;

  /** Button size */
  size?: keyof typeof styles.sizes;
}

type ButtonProps = ButtonOwnProps & Omit<React.ComponentPropsWithRef<'button'>, keyof ButtonOwnProps>;

const styles = {
  colors: {
    default: clsx(
      'border-gray-300 bg-white text-gray-700 shadow-sm',
      'hover:bg-gray-50 focus:ring-sky-600',
      'disabled:hover:bg-white',
    ),
    slate: clsx(
      'border-transparent bg-slate-900 text-white ',
      'hover:bg-slate-700 focus:ring-slate-700',
      'disabled:hover:bg-slate-900',
    ),
    sky: clsx(
      'border-transparent bg-sky-600 text-white',
      'hover:bg-sky-800 focus:ring-sky-600',
      'disabled:hover:bg-sky-600',
    ),
  },
  sizes: {
    xs: clsx('rounded-md py-2 px-2.5 text-sm'),
    sm: clsx('rounded-md py-2.5 px-3 text-sm'),
    md: clsx('rounded-md py-2.5 px-4 text-sm'),
    lg: clsx('rounded-md py-2.5 px-4 text-base'),
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    disabled,
    loading,
    leftIcon,
    rightIcon,
    fullWidth,
    type = 'button',
    size = 'md',
    color = 'default',
    capitalize,
    ...etc
  } = props;
  return (
    <button
      ref={ref}
      data-button
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex select-none justify-center border font-medium transition duration-100',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        styles.colors[color],
        styles.sizes[size],
        fullWidth && 'w-full',
      )}
      type={type}
      {...etc}
    >
      <div className="flex h-full items-center justify-center">
        {(leftIcon || loading) && <span className="-ml-1 mr-2">{loading ? <SpinnerIcon /> : leftIcon}</span>}
        <span className={clsx(capitalize && 'capitalize')}>{children}</span>
        {rightIcon && <span className="-mr-1 ml-2">{rightIcon}</span>}
      </div>
    </button>
  );
});

Button.displayName = 'Button';
