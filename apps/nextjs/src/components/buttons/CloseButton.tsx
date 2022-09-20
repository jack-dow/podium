import { XMarkIcon } from '@/assets/icons/mini/XMarkIcon';

interface CloseButtonProps {
  title?: string;
  onClick: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ title = 'Close', ...props }) => {
  return (
    <button
      type="button"
      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
      {...props}
    >
      <span className="sr-only">{title}</span>
      <XMarkIcon aria-hidden="true" />
    </button>
  );
};
