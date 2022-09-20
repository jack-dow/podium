import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface LabelOwnProps {
  children?: React.ReactNode;
  visuallyHidden?: boolean;
}

type LabelProps = LabelOwnProps & Omit<React.ComponentPropsWithRef<'label'>, keyof LabelOwnProps>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, visuallyHidden = false, ...props }, ref) => {
    // Cast to label to shut up annoying forward ref types
    const Element = (props.htmlFor ? 'label' : 'div') as 'label';
    return (
      <Element
        ref={ref}
        {...props}
        className={clsx(
          'block select-none text-sm font-semibold leading-6 text-gray-900',
          visuallyHidden && 'sr-only',
          props.htmlFor && 'mb-1',
          className,
        )}
      >
        {children}
      </Element>
    );
  },
);

Label.displayName = 'Label';
