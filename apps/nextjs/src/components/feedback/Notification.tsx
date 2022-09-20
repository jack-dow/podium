import { Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';

import clsx from 'clsx';
import { CloseButton } from '../buttons/CloseButton';

interface NotificationProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  withCloseButton?: boolean;
}

interface NotificationToastProps {
  visible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps & NotificationToastProps> = ({
  title,
  description,
  visible,
  icon,
  withCloseButton,
  onClose,
}) => {
  return (
    <Transition
      show={visible}
      as={Fragment}
      appear
      enter="transform ease-out duration-200 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
        <div className="p-4">
          <div className="flex items-start">
            {icon && <div className="shrink-0">{icon}</div>}
            <div className={clsx('w-0 flex-1 pt-0.5', icon && 'ml-3')}>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {withCloseButton && (
              <div className="ml-4 flex shrink-0">
                <CloseButton onClick={onClose} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
};

export const showNotification = (props: NotificationProps) => {
  toast.custom((t) => <Notification {...props} visible={t.visible} onClose={() => toast.dismiss(t.id)} />, {
    duration: 2200,
  });
};
