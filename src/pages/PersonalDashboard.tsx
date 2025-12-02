import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../components/ChartCard';
import GapCard from '../components/GapCard';
import PageHeader from '../components/PageHeader';
import MentorCard from '../components/MentorCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { mockData, Struggle } from '../utils/mockData';
import { mockAuth } from '../utils/mockAuth';

const PersonalDashboard = () => {
  const navigate = useNavigate();
  const user = mockAuth.getCurrentUser();
  const [userStruggles, setUserStruggles] = useState<Struggle[]>([]);
  const [severityData, setSeverityData] = useState<{ name: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [timelineData, setTimelineData] = useState<{ date: string; count: number }[]>([]);
  const [recommendedMentors, setRecommendedMentors] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get user's struggles
    const allStruggles = mockData.getStruggles();
    const userStrugglesList = allStruggles.filter(s => s.userId === user.id);
    setUserStruggles(userStrugglesList);

    // User's severity distribution
    const severityCounts: Record<string, number> = {};
    userStrugglesList.forEach(s => {
      severityCounts[s.severity] = (severityCounts[s.severity] || 0) + 1;
    });
    setSeverityData([
      { name: 'Low', value: severityCounts.low || 0 },
      { name: 'Medium', value: severityCounts.medium || 0 },
      { name: 'High', value: severityCounts.high || 0 }
    ]);

    // User's category distribution
    const categoryCounts: Record<string, number> = {};
    userStrugglesList.forEach(s => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });
    setCategoryData(
      Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
    );

    // User's timeline
    const dateMap: Record<string, number> = {};
    userStrugglesList.forEach(s => {
      const date = s.timestamp.split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    setTimelineData(
      Object.entries(dateMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
    );

    // Get recommended mentors based on user's most common category
    if (userStrugglesList.length > 0) {
      const mostCommonCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      
      if (mostCommonCategory) {
        const mentors = mockData.getMentorsByCategory(mostCommonCategory)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setRecommendedMentors(mentors);
      }
    }
  }, [user, navigate]);

  const COLORS = ['#64ffda', '#ffb800', '#ff6b6b'];

  const getMostCommonCategory = () => {
    if (categoryData.length === 0) return 'N/A';
    return categoryData.sort((a, b) => b.count - a.count)[0]?.name || 'N/A';
  };

  const getTotalStruggles = () => {
    return userStruggles.length;
  };

  const getAverageSeverity = () => {
    if (userStruggles.length === 0) return 'N/A';
    const severityValues = { low: 1, medium: 2, high: 3 };
    const avg = userStruggles.reduce((sum, s) => sum + severityValues[s.severity], 0) / userStruggles.length;
    if (avg <= 1.5) return 'Low';
    if (avg <= 2.5) return 'Medium';
    return 'High';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title={`Welcome, ${user.name}`}
          subtitle="Your personal dashboard and insights"
        />

        {/* Personal Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GapCard
            title="Total Struggles Submitted"
            value={getTotalStruggles().toString()}
            icon="📝"
          />
          <GapCard
            title="Most Common Category"
            value={getMostCommonCategory()}
            icon="📊"
          />
          <GapCard
            title="Average Severity"
            value={getAverageSeverity()}
            icon="⚡"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Your Severity Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => 
                    severityData.reduce((sum, d) => sum + d.value, 0) > 0 
                      ? `${name} ${(percent * 100).toFixed(0)}%` 
                      : 'No data'
                  }
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((_entry: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Your Category Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 34, 64, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Your Submission Timeline">
          <ResponsiveContainer width="100%" height={300}>
            {timelineData.length > 0 ? (
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 34, 64, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#64ffda"
                  strokeWidth={2}
                  dot={{ fill: '#64ffda', r: 4 }}
                />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No submission data yet
              </div>
            )}
          </ResponsiveContainer>
        </ChartCard>

        {/* Recommended Mentors Section */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Recommended Mentors</h3>
              <p className="text-gray-300">
                Based on your struggles, we recommend these mentors who can help you
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/book-session')}>
              View All Mentors
            </Button>
          </div>
          
          {recommendedMentors.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedMentors.map((mentor) => (
                <div key={mentor.id}>
                  <MentorCard
                    mentor={mentor}
                    onSelect={() => navigate(`/book-session?mentor=${mentor.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                {userStruggles.length === 0 
                  ? "Submit a struggle to get personalized mentor recommendations"
                  : "No mentors available for your category yet"}
              </p>
              {userStruggles.length === 0 && (
                <Button variant="primary" onClick={() => navigate('/submit')}>
                  Submit Your First Struggle
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Recent Struggles */}
        {userStruggles.length > 0 && (
          <Card className="mt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Your Recent Struggles</h3>
            <div className="space-y-3">
              {userStruggles.slice(0, 5).map((struggle) => (
                <div
                  key={struggle.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-crimson-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/struggle/${struggle.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{struggle.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-2">{struggle.description}</p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs border ${
                        struggle.severity === 'low' ? 'severity-low' :
                        struggle.severity === 'medium' ? 'severity-medium' : 'severity-high'
                      }`} style={{ fontWeight: 500 }}>
                        {struggle.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(struggle.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {userStruggles.length > 5 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/profile')}
              >
                View All Your Struggles
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalDashboard;

