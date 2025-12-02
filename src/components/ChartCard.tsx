import { ReactNode } from 'react';
import Card from './Card';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ChartCard = ({ title, children, className = '' }: ChartCardProps) => {
  return (
    <Card className={className}>
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <div className="w-full">
        {children}
      </div>
    </Card>
  );
};

export default ChartCard;

