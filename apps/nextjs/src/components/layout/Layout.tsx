import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <>
      <main className={clsx('flex w-full flex-col bg-white p-4 transition-colors duration-75', className)}>
        {children}
      </main>
    </>
  );
};
