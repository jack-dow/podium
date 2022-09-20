import { forwardRef } from 'react';
import Link, { type LinkProps } from 'next/link';

interface AnchorProps extends LinkProps {
  /** Link label */
  children?: React.ReactNode;

  className?: never;
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>((props, ref) => {
  return (
    <Link {...props} ref={ref}>
      <a className="font-medium text-sky-600 hover:text-sky-500 hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2">
        {props.children}
      </a>
    </Link>
  );
});

Anchor.displayName = 'Anchor';
