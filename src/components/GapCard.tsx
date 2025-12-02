import { motion } from 'framer-motion';
import Card from './Card';

interface GapCardProps {
  title: string;
  value: string;
  icon?: string;
  delay?: number;
}

const GapCard = ({ title, value, icon, delay = 0 }: GapCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="text-center">
        {icon && <div className="text-4xl mb-3">{icon}</div>}
        <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
        <p className="text-2xl font-bold text-crimson-accent">{value}</p>
      </Card>
    </motion.div>
  );
};

export default GapCard;

