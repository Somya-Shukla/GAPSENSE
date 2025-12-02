import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StruggleCard from '../components/StruggleCard';
import Input from '../components/Input';
import PageHeader from '../components/PageHeader';
import { mockData } from '../utils/mockData';
import { Struggle } from '../utils/mockData';

const CommunityStruggles = () => {
  const [struggles, setStruggles] = useState<Struggle[]>([]);
  const [filteredStruggles, setFilteredStruggles] = useState<Struggle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    const allStruggles = mockData.getStruggles().filter(s => s.status === 'approved');
    setStruggles(allStruggles);
    setFilteredStruggles(allStruggles);
  }, []);

  useEffect(() => {
    let filtered = [...struggles];

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(s => s.severity === severityFilter);
    }

    if (tagFilter) {
      filtered = filtered.filter(s =>
        s.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }

    setFilteredStruggles(filtered);
  }, [searchQuery, categoryFilter, severityFilter, tagFilter, struggles]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch new data
      // For demo, we just refresh the list
      const allStruggles = mockData.getStruggles().filter(s => s.status === 'approved');
      setStruggles(allStruggles);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const categories = ['all', 'technical', 'academic', 'career', 'mental health', 'other'];
  const severities = ['all', 'low', 'medium', 'high'];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Community Struggles"
          subtitle="Explore struggles shared by students and find support"
        />

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search struggles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 text-white"
              aria-label="Category filter"
              title="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-dark-blue text-white">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 text-white"
              aria-label="Severity filter"
              title="Filter by severity"
            >
              {severities.map(sev => (
                <option key={sev} value={sev} className="bg-dark-blue text-white">
                  {sev.charAt(0).toUpperCase() + sev.slice(1)} Severity
                </option>
              ))}
            </select>

            <Input
              placeholder="Filter by tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredStruggles.length} of {struggles.length} struggles
          </p>
        </div>

        {/* Struggle Cards */}
        {filteredStruggles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStruggles.map((struggle) => (
              <StruggleCard key={struggle.id} struggle={struggle} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <p className="text-gray-400 text-lg">No struggles found matching your filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityStruggles;

