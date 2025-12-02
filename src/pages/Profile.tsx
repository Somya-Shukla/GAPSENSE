import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import StruggleCard from '../components/StruggleCard';
import MentorCard from '../components/MentorCard';
import ChartCard from '../components/ChartCard';
import GapCard from '../components/GapCard';
import { mockAuth } from '../utils/mockAuth';
import { mockData, Struggle } from '../utils/mockData';

const Profile = () => {
  const navigate = useNavigate();
  const user = mockAuth.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'dashboard'>('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [userStruggles, setUserStruggles] = useState<Struggle[]>([]);
  const [severityData, setSeverityData] = useState<{ name: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [timelineData, setTimelineData] = useState<{ date: string; count: number }[]>([]);
  const [recommendedMentors, setRecommendedMentors] = useState<any[]>([]);

  const bookings = mockData.getBookings();

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

  const handleSave = () => {
    // In a real app, this would update the user profile
    setShowEditModal(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Profile"
          subtitle={`Welcome back, ${user?.name || 'User'}`}
        />

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-crimson-accent text-crimson-accent'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-crimson-accent text-crimson-accent'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            My Dashboard
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-crimson-accent/20 border-2 border-crimson-accent/50 mx-auto mb-4 flex items-center justify-center text-4xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-2">Role: {user?.role}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="w-full"
              >
                Edit Profile
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-xl font-semibold mb-4">My Submitted Struggles</h3>
              {userStruggles.length > 0 ? (
                <div className="space-y-4">
                  {userStruggles.map((struggle) => (
                    <StruggleCard key={struggle.id} struggle={struggle} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No struggles submitted yet.</p>
              )}
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Bookmarked Struggles</h3>
              <p className="text-gray-400">No bookmarked struggles yet.</p>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Upcoming Chat Sessions</h3>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{booking.mentorName}</p>
                          <p className="text-sm text-gray-400">{booking.slot}</p>
                        </div>
                        {booking.anonymous && (
                          <span className="text-xs bg-white/10 px-2 py-1 rounded">Anonymous</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No upcoming sessions.</p>
              )}
            </Card>
          </div>
        </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Personal Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      style={{ fontFamily: 'Inter, sans-serif' }}
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
            <Card>
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
              <Card>
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
                    onClick={() => setActiveTab('profile')}
                  >
                    View All Your Struggles
                  </Button>
                )}
              </Card>
            )}
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 text-white"
                  placeholder="Enter your name"
                  title="Name"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 text-white"
                  placeholder="Enter your email"
                  title="Email"
                />
              </div>
              <div className="flex gap-4">
                <Button variant="primary" onClick={handleSave} className="flex-1">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;

