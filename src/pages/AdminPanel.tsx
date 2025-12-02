import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import StruggleCard from '../components/StruggleCard';
import MentorCard from '../components/MentorCard';
import Input from '../components/Input';
import ChartCard from '../components/ChartCard';
import { mockData } from '../utils/mockData';
import { Struggle, Mentor } from '../utils/mockData';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'mentors' | 'analytics'>('approvals');
  const [struggles, setStruggles] = useState<Struggle[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookmarkedStruggles, setBookmarkedStruggles] = useState<Struggle[]>([]);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    expertise: [] as string[],
    specializations: [] as string[],
    bio: ''
  });

  useEffect(() => {
    setStruggles(mockData.getStruggles());
    setMentors(mockData.getMentors());
    setBookmarkedStruggles(mockData.getBookmarkedStruggles());
  }, []);

  const handleApprove = (id: string) => {
    mockData.updateStruggleStatus(id, 'approved');
    setStruggles(mockData.getStruggles());
  };

  const handleReject = (id: string) => {
    mockData.updateStruggleStatus(id, 'rejected');
    setStruggles(mockData.getStruggles());
  };

  const handleFlag = (id: string) => {
    mockData.flagStruggle(id);
    setStruggles(mockData.getStruggles());
  };

  const handleBookmark = (id: string) => {
    if (mockData.isBookmarked(id)) {
      mockData.unbookmarkStruggle(id);
    } else {
      mockData.bookmarkStruggle(id);
    }
    setBookmarkedStruggles(mockData.getBookmarkedStruggles());
  };

  const pendingStruggles = struggles.filter(s => s.status === 'pending');
  const approvedStruggles = struggles.filter(s => s.status === 'approved');
  const rejectedStruggles = struggles.filter(s => s.status === 'rejected');
  const flaggedStruggles = struggles.filter(s => s.status === 'flagged');

  // Analytics data
  const statusData = [
    { name: 'Approved', value: approvedStruggles.length },
    { name: 'Pending', value: pendingStruggles.length },
    { name: 'Rejected', value: rejectedStruggles.length },
    { name: 'Flagged', value: flaggedStruggles.length }
  ];

  const categoryCounts = mockData.getCategoryCounts();
  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

  const severityCounts = mockData.getSeverityCounts();
  const severityData = [
    { name: 'Low', value: severityCounts.low || 0 },
    { name: 'Medium', value: severityCounts.medium || 0 },
    { name: 'High', value: severityCounts.high || 0 }
  ];

  // Timeline data
  const timelineData = mockData.getTimelineData();

  // Heatmap data
  const heatmapData: Array<{ day: string; hour: number; value: number }> = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmap: Record<string, Record<number, number>> = {};
  
  struggles.forEach((struggle: Struggle) => {
    const date = new Date(struggle.timestamp);
    const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const hour = date.getHours();
    if (!heatmap[day]) heatmap[day] = {};
    heatmap[day][hour] = (heatmap[day][hour] || 0) + 1;
  });

  days.forEach(day => {
    for (let hour = 0; hour < 24; hour++) {
      heatmapData.push({
        day,
        hour,
        value: heatmap[day]?.[hour] || 0
      });
    }
  });

  const getHeatmapColor = (value: number) => {
    if (value === 0) return '#112240';
    if (value <= 1) return '#1e3a5f';
    if (value <= 2) return '#2d4f7c';
    if (value <= 3) return '#3c6499';
    return '#4b79b6';
  };

  const COLORS = ['#64ffda', '#ffb800', '#ff6b6b', '#c792ea'];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader title="Admin Panel" />

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {(['approvals', 'mentors', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-crimson-accent text-crimson-accent'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-8">
            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{pendingStruggles.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Pending</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{approvedStruggles.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Approved</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400">{rejectedStruggles.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Rejected</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">{flaggedStruggles.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Flagged</p>
                </div>
              </Card>
            </div>

            {/* Pending Approvals */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Pending Approvals ({pendingStruggles.length})</h2>
              {pendingStruggles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {pendingStruggles.map((struggle) => (
                    <Card key={struggle.id}>
                      <StruggleCard struggle={struggle} />
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(struggle.id)}
                          className="flex-1"
                        >
                          ✓ Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(struggle.id)}
                          className="flex-1"
                        >
                          ✗ Reject
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleBookmark(struggle.id)}
                          className={mockData.isBookmarked(struggle.id) ? 'bg-crimson-accent/20' : ''}
                        >
                          {mockData.isBookmarked(struggle.id) ? '🔖' : '🔖'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleFlag(struggle.id)}
                        >
                          🚩 Flag
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No pending approvals.</p>
              )}
            </div>

            {/* Bookmarked Struggles */}
            {bookmarkedStruggles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Bookmarked Struggles ({bookmarkedStruggles.length})</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {bookmarkedStruggles.map((struggle) => (
                    <Card key={struggle.id}>
                      <StruggleCard struggle={struggle} />
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(struggle.id)}
                          className="flex-1"
                        >
                          ✓ Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(struggle.id)}
                          className="flex-1"
                        >
                          ✗ Reject
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleBookmark(struggle.id)}
                          className="bg-crimson-accent/20"
                        >
                          🔖 Unbookmark
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Struggles */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Approved ({approvedStruggles.length})</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {approvedStruggles.slice(0, 6).map((struggle) => (
                  <div key={struggle.id}>
                    <StruggleCard struggle={struggle} />
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        onClick={() => handleBookmark(struggle.id)}
                        className={mockData.isBookmarked(struggle.id) ? 'bg-crimson-accent/20' : ''}
                      >
                        {mockData.isBookmarked(struggle.id) ? '🔖 Bookmarked' : '🔖 Bookmark'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleFlag(struggle.id)}
                      >
                        🚩 Flag
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejected Struggles */}
            {rejectedStruggles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Rejected ({rejectedStruggles.length})</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {rejectedStruggles.slice(0, 6).map((struggle) => (
                    <StruggleCard key={struggle.id} struggle={struggle} />
                  ))}
                </div>
              </div>
            )}

            {/* Flagged Struggles */}
            {flaggedStruggles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Flagged ({flaggedStruggles.length})</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {flaggedStruggles.map((struggle) => (
                    <Card key={struggle.id}>
                      <StruggleCard struggle={struggle} />
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(struggle.id)}
                          className="flex-1"
                        >
                          ✓ Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(struggle.id)}
                          className="flex-1"
                        >
                          ✗ Reject
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-bold mb-4">Add New Mentor</h2>
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={newMentor.name}
                  onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={newMentor.email}
                  onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                />
                <div>
                  <label htmlFor="mentor-bio" className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    id="mentor-bio"
                    value={newMentor.bio}
                    onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 text-white placeholder-gray-400"
                    placeholder="Enter mentor bio"
                    title="Mentor bio"
                  />
                </div>
                <Button variant="primary">Add Mentor</Button>
              </div>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4">All Mentors ({mentors.length})</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <div key={mentor.id}>
                    <MentorCard mentor={mentor} />
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">Edit</Button>
                      <Button variant="outline" className="flex-1">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-2">Total Struggles</h3>
                <p className="text-3xl font-bold text-crimson-accent">{struggles.length}</p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold mb-2">Total Mentors</h3>
                <p className="text-3xl font-bold text-light-blue">{mentors.length}</p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
                <p className="text-3xl font-bold text-yellow-400">{pendingStruggles.length}</p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold mb-2">Bookmarked</h3>
                <p className="text-3xl font-bold text-purple-400">{bookmarkedStruggles.length}</p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Status Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((_entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Category Distribution">
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

            <ChartCard title="Severity Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={severityData}>
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
                  <Bar dataKey="value" fill="#64ffda" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Submission Timeline">
              <ResponsiveContainer width="100%" height={300}>
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
              </ResponsiveContainer>
            </ChartCard>

            {/* Heatmap */}
            <ChartCard title="Activity Heatmap - Struggles by Day & Hour">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-25 gap-1 mb-2">
                    <div className="text-xs text-gray-400 text-center py-2"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="text-xs text-gray-400 text-center">
                        {i}h
                      </div>
                    ))}
                  </div>
                  {days.map((day) => (
                    <div key={day} className="grid grid-cols-25 gap-1 mb-1">
                      <div className="text-xs text-gray-300 text-right pr-2 py-1 flex items-center justify-end">
                        {day}
                      </div>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                        const value = dataPoint?.value || 0;
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className="aspect-square rounded border border-white/10 transition-all hover:scale-110 cursor-pointer"
                            style={{
                              backgroundColor: getHeatmapColor(value),
                            }}
                            title={`${day} ${hour}:00 - ${value} struggle${value !== 1 ? 's' : ''}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                  <div className="flex items-center justify-end gap-4 mt-4 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>Less</span>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((val) => (
                          <div
                            key={val}
                            className="w-4 h-4 rounded border border-white/10"
                            style={{ backgroundColor: getHeatmapColor(val) }}
                          />
                        ))}
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
