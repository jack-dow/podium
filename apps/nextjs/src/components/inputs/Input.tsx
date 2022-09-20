import { forwardRef, useReducer } from 'react';
import clsx from 'clsx';

import { EyeIcon } from '@/assets/icons/outline/EyeIcon';
import { EyeSlashIcon } from '@/assets/icons/outline/EyeSlashIcon';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  type?: 'email' | 'password' | 'text';
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ invalid, id, type = 'text', ...props }, ref) => {
  const [showingPassword, togglePassword] = useReducer((prev) => !prev, false);

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        id={id}
        type={type === 'password' && showingPassword ? 'text' : type}
        className={clsx(
          'w-full rounded-md border-gray-300 bg-white text-slate-900 shadow-sm transition duration-100',
          'placeholder:text-slate-400',
          'focus:border-sky-600 focus:ring-sky-600',
          invalid && 'ring-2 ring-red-500',
          'sm:text-sm',
        )}
      />
      {type === 'password' && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            className="rounded-md transition duration-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
            onClick={togglePassword}
          >
            {showingPassword ? <EyeIcon /> : <EyeSlashIcon />}
          </button>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'SignUpInput';
