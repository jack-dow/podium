import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  label: string | false;
  hideLabel?: boolean;
  id: string;
  name: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, hideLabel, ...props }, ref) => {
  return (
    <div>
      <label htmlFor={props.id} className={clsx('block text-sm font-medium text-gray-700', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="mt-1">
        <textarea
          ref={ref}
          {...props}
          rows={props.rows || 4}
          className={clsx(
            'block w-full rounded-md border border-gray-300 bg-white py-3 px-2.5 text-slate-900 shadow-sm transition sm:text-sm',
            'placeholder:text-slate-400',
            'focus:border-sky-600 focus:ring-sky-600',
          )}
          defaultValue={props.defaultValue}
        />
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';
