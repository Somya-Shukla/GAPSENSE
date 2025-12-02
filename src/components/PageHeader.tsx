import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-2 neon-glow">{title}</h1>
      {subtitle && <p className="text-gray-300 text-lg">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;

