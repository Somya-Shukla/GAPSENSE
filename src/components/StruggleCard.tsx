import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Struggle } from '../utils/mockData';

interface StruggleCardProps {
  struggle: Struggle;
}

const StruggleCard = ({ struggle }: StruggleCardProps) => {
  const navigate = useNavigate();

  const getSeverityClass = (severity: string) => {
    return `severity-${severity}`;
  };

  const getCategoryClass = (category: string) => {
    return `category-${category.replace(' ', '-')}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/struggle/${struggle.id}`)}
      className={`glass-card rounded-xl p-6 cursor-pointer ${getCategoryClass(struggle.category)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-white flex-1">{struggle.title}</h3>
        {struggle.anonymous && (
          <span className="ml-2 px-2 py-1 text-xs bg-white/10 rounded">Anonymous</span>
        )}
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{struggle.description}</p>
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityClass(struggle.severity)}`}>
            {struggle.severity.charAt(0).toUpperCase() + struggle.severity.slice(1)}
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
            {struggle.category}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formatDate(struggle.timestamp)}</span>
      </div>
      
      {struggle.tags && struggle.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {struggle.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-crimson-accent/10 text-crimson-accent text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StruggleCard;

