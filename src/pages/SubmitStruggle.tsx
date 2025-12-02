import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { mockData } from '../utils/mockData';
import { generateTags } from '../utils/autoTag';
import { mockAuth } from '../utils/mockAuth';

const SubmitStruggle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'technical',
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    anonymous: false
  });
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'description' && typeof value === 'string') {
      const autoTags = generateTags(value, formData.category);
      setTags(autoTags);
    }
    if (field === 'category' && formData.description) {
      const autoTags = generateTags(formData.description, value as string);
      setTags(autoTags);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const user = mockAuth.getCurrentUser();
    const userId = user?.id || 'anonymous';

    const newStruggle = mockData.addStruggle({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      tags,
      anonymous: formData.anonymous,
      userId: userId
    });

    setSubmitted(true);
    setTimeout(() => {
      if (user) {
        navigate('/profile');
      } else {
        navigate('/community');
      }
    }, 2000);
  };

  const getSeverityClass = (severity: string) => {
    return `severity-${severity}`;
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-2">Struggle Submitted!</h2>
          <p className="text-gray-300">Redirecting to community...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Submit a Struggle"
          subtitle="Share your challenge and get matched with the right mentor"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 focus:ring-2 focus:ring-crimson-accent/20 text-white"
                  aria-label="Category"
                  title="Select category"
                >
                  <option value="technical" className="bg-dark-blue text-white">Technical</option>
                  <option value="academic" className="bg-dark-blue text-white">Academic</option>
                  <option value="career" className="bg-dark-blue text-white">Career</option>
                  <option value="mental health" className="bg-dark-blue text-white">Mental Health</option>
                  <option value="other" className="bg-dark-blue text-white">Other</option>
                </select>
              </div>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief title for your struggle"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your struggle in detail..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 focus:ring-2 focus:ring-crimson-accent/20 text-white placeholder-gray-400 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Severity: {formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={formData.severity === 'low' ? 0 : formData.severity === 'medium' ? 1 : 2}
                  onChange={(e) => {
                    const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
                    handleInputChange('severity', severities[parseInt(e.target.value)]);
                  }}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-crimson-accent"
                  aria-label="Severity"
                  title="Select severity level"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-400">Low</span>
                  <span className="text-sm text-gray-400">Medium</span>
                  <span className="text-sm text-gray-400">High</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {['low', 'medium', 'high'].map((sev) => (
                    <span
                      key={sev}
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${
                        formData.severity === sev
                          ? getSeverityClass(sev)
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {sev.charAt(0).toUpperCase() + sev.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                  className="w-5 h-5 rounded bg-white/5 border-white/10 text-crimson-accent focus:ring-crimson-accent/50"
                />
                <label htmlFor="anonymous" className="text-gray-300">
                  Submit anonymously
                </label>
              </div>
            </div>
          </Card>

          {tags.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-3">Auto-generated Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-crimson-accent/10 text-crimson-accent text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Title: <span className="text-white">{formData.title || 'N/A'}</span></p>
              <p className="text-gray-400 text-sm">Category: <span className="text-white">{formData.category}</span></p>
              <p className="text-gray-400 text-sm">Severity: <span className={`${getSeverityClass(formData.severity)} px-2 py-1 rounded text-xs`}>{formData.severity}</span></p>
              {formData.anonymous && <p className="text-gray-400 text-sm">Anonymous: <span className="text-white">Yes</span></p>}
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={!formData.title || !formData.description}>
              Submit Struggle
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/community')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitStruggle;

