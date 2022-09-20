import clsx from 'clsx';
import { cloneElement } from 'react';

export interface IconProps {
  className?: string;
}

const ICON_TYPES = {
  outline: 'h-6 w-6',
  solid: 'h-6 w-6',
  mini: 'h-5 w-5',
} as const;

export const renderIcon = (type: keyof typeof ICON_TYPES, icon: React.ReactElement) => {
  return cloneElement(icon, { className: clsx(ICON_TYPES[type], icon.props.className) });
};
