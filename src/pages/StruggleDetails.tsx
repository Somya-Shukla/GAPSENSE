import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import MentorCard from '../components/MentorCard';
import PageHeader from '../components/PageHeader';
import { mockData } from '../utils/mockData';

const StruggleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const struggle = id ? mockData.getStruggle(id) : undefined;
  const recommendedMentors = struggle
    ? mockData.getMentorsByCategory(struggle.category).slice(0, 3)
    : [];

  if (!struggle) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card>
          <p className="text-gray-400">Struggle not found.</p>
          <Button onClick={() => navigate('/community')} className="mt-4">
            Back to Community
          </Button>
        </Card>
      </div>
    );
  }

  const getSeverityClass = (severity: string) => {
    return `severity-${severity}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button onClick={() => navigate('/community')} variant="outline" className="mb-6">
          ← Back to Community
        </Button>

        <PageHeader title={struggle.title} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getSeverityClass(struggle.severity)}`}>
                    {struggle.severity.charAt(0).toUpperCase() + struggle.severity.slice(1)} Severity
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                    {struggle.category}
                  </span>
                  {struggle.anonymous && (
                    <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                      Anonymous
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{struggle.description}</p>
                </div>

                {struggle.tags && struggle.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {struggle.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-crimson-accent/10 text-crimson-accent text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    Posted on {formatDate(struggle.timestamp)}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline">
                🔖 Bookmark
              </Button>
              <Button variant="outline">
                🚩 Flag
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold mb-4">Recommended Mentors</h3>
              {recommendedMentors.length > 0 ? (
                <div className="space-y-4">
                  {recommendedMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      onSelect={() => navigate(`/book-session?mentor=${mentor.id}&struggle=${struggle.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No mentors available for this category.</p>
              )}
            </Card>

            <Button
              variant="primary"
              onClick={() => navigate(`/book-session?struggle=${struggle.id}`)}
              className="w-full"
            >
              Chat Session Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StruggleDetails;

