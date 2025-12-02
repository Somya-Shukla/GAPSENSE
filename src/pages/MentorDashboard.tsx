import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../components/ChartCard';
import GapCard from '../components/GapCard';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import StruggleCard from '../components/StruggleCard';
import { mockData, Struggle } from '../utils/mockData';
import { mockAuth } from '../utils/mockAuth';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const user = mockAuth.getCurrentUser();
  const [solvedStruggles, setSolvedStruggles] = useState<Struggle[]>([]);
  const [pendingStruggles, setPendingStruggles] = useState<Struggle[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [severityData, setSeverityData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'mentor') {
      navigate('/login');
      return;
    }

    // Get struggles in mentor's expertise areas
    const allStruggles = mockData.getStruggles().filter(s => s.status === 'approved');
    const mentor = mockData.getMentors().find(m => m.email === user.email);
    
    if (mentor) {
      // Filter struggles by mentor's expertise
      const relevantStruggles = allStruggles.filter(s => 
        mentor.expertise.includes(s.category)
      );
      
      // Mock solved struggles (in real app, this would come from mentor's session history)
      const solved = relevantStruggles.slice(0, 5).map(s => ({ ...s, solved: true }));
      setSolvedStruggles(solved);
      setPendingStruggles(relevantStruggles.slice(5, 10));

      // Category distribution of solved struggles
      const categoryCounts: Record<string, number> = {};
      solved.forEach(s => {
        categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
      });
      setCategoryData(
        Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
      );

      // Severity distribution
      const severityCounts: Record<string, number> = {};
      solved.forEach(s => {
        severityCounts[s.severity] = (severityCounts[s.severity] || 0) + 1;
      });
      setSeverityData([
        { name: 'Low', value: severityCounts.low || 0 },
        { name: 'Medium', value: severityCounts.medium || 0 },
        { name: 'High', value: severityCounts.high || 0 }
      ]);
    }
  }, [user, navigate]);

  const COLORS = ['#64ffda', '#ffb800', '#ff6b6b'];

  if (!user || user.role !== 'mentor') {
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title={`Welcome, ${user.name}`}
          subtitle="Mentor Dashboard - Help students overcome their struggles"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GapCard
            title="Struggles Solved"
            value={solvedStruggles.length.toString()}
            icon="✅"
          />
          <GapCard
            title="Pending Requests"
            value={pendingStruggles.length.toString()}
            icon="⏳"
          />
          <GapCard
            title="Success Rate"
            value="95%"
            icon="📈"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Struggles by Category">
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
                <Bar dataKey="count" fill="#64ffda" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Severity Distribution">
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
                >
                  {severityData.map((_entry: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pending Struggles */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">Pending Struggles - Help Needed</h3>
            <Button variant="outline" onClick={() => navigate('/community')}>
              View All
            </Button>
          </div>
          {pendingStruggles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {pendingStruggles.map((struggle) => (
                <div key={struggle.id} className="relative">
                  <StruggleCard struggle={struggle} />
                  <Button
                    variant="primary"
                    className="w-full mt-3"
                    onClick={() => navigate(`/struggle/${struggle.id}`)}
                  >
                    Help This Student
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No pending struggles at the moment.</p>
          )}
        </Card>

        {/* Solved Struggles */}
        <Card>
          <h3 className="text-2xl font-bold text-white mb-4">Recently Solved</h3>
          {solvedStruggles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {solvedStruggles.map((struggle) => (
                <div key={struggle.id} className="p-4 bg-white/5 rounded-lg border border-green-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{struggle.title}</h4>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Solved</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{struggle.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs border ${
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
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No solved struggles yet. Start helping students!</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;

