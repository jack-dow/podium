import clsx from 'clsx';

import { CheckCircleIcon } from '@/assets/icons/mini/CheckCircleIcon';
import { ExclamationTriangleIcon } from '@/assets/icons/mini/ExclamationTriangleIcon';
import { XCircleIcon } from '@/assets/icons/mini/XCircleIcon';

interface AlertProps {
  type?: 'success' | 'warning' | 'error';
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const styles = {
  wrapper: {
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    error: 'bg-red-50',
  },
  icon: {
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  },
  title: {
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
  },
  description: {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700',
  },
};

export const Alert: React.FC<AlertProps> = ({ type = 'error', title, children, icon }) => {
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  const isError = type === 'error';

  return (
    <div className={clsx('rounded-md p-4', styles.wrapper[type])}>
      <div className="flex">
        <div className={clsx('shrink-0', styles.icon[type])}>
          {icon || (
            <>
              {isSuccess && <CheckCircleIcon aria-hidden="true" />}
              {isWarning && <ExclamationTriangleIcon aria-hidden="true" />}
              {isError && <XCircleIcon aria-hidden="true" />}
            </>
          )}
        </div>
        <div className="ml-3">
          {title && <h3 className={clsx('text-sm font-medium', styles.title[type])}>{title}</h3>}
          <div className={clsx('text-sm', title && 'mt-2', styles.description[type])}>{children}</div>
        </div>
      </div>
    </div>
  );
};
