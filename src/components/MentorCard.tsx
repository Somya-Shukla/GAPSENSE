import { motion } from 'framer-motion';
import { Mentor } from '../utils/mockData';

interface MentorCardProps {
  mentor: Mentor;
  onSelect?: () => void;
}

const MentorCard = ({ mentor, onSelect }: MentorCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-xl p-6 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{mentor.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★</span>
            <span className="text-gray-300">{mentor.rating}</span>
            <span className="text-gray-500 text-sm">({mentor.sessionsCompleted} sessions)</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">{mentor.bio}</p>
      
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Expertise:</p>
        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((exp, idx) => (
            <span key={idx} className="px-2 py-1 bg-light-blue/10 text-light-blue text-xs rounded">
              {exp}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-xs text-gray-400 mb-2">Specializations:</p>
        <div className="flex flex-wrap gap-2">
          {mentor.specializations.slice(0, 3).map((spec, idx) => (
            <span key={idx} className="px-2 py-1 bg-crimson-accent/10 text-crimson-accent text-xs rounded">
              {spec}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MentorCard;

