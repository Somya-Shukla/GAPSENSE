import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../components/ChartCard';
import GapCard from '../components/GapCard';
import PageHeader from '../components/PageHeader';
import { mockData, Struggle } from '../utils/mockData';

const Dashboard = () => {
  const [severityData, setSeverityData] = useState<{ name: string; value: number }[]>([]);
  const [timelineData, setTimelineData] = useState<{ date: string; count: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<Array<{ day: string; hour: number; value: number }>>([]);

  useEffect(() => {
    const severityCounts = mockData.getSeverityCounts();
    setSeverityData([
      { name: 'Low', value: severityCounts.low || 0 },
      { name: 'Medium', value: severityCounts.medium || 0 },
      { name: 'High', value: severityCounts.high || 0 }
    ]);

    setTimelineData(mockData.getTimelineData());

    const categoryCounts = mockData.getCategoryCounts();
    setCategoryData(
      Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
    );

    // Generate heatmap data
    const struggles = mockData.getStruggles();
    const heatmap: Record<string, Record<number, number>> = {};
    
    struggles.forEach((struggle: Struggle) => {
      const date = new Date(struggle.timestamp);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const hour = date.getHours();
      
      if (!heatmap[day]) heatmap[day] = {};
      heatmap[day][hour] = (heatmap[day][hour] || 0) + 1;
    });

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const heatmapArray: Array<{ day: string; hour: number; value: number }> = [];
    
    days.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        heatmapArray.push({
          day,
          hour,
          value: heatmap[day]?.[hour] || 0
        });
      }
    });
    
    setHeatmapData(heatmapArray);
  }, []);

  const COLORS = ['#64ffda', '#ffb800', '#ff6b6b'];
  
  // Heatmap color function
  const getHeatmapColor = (value: number) => {
    if (value === 0) return '#112240';
    if (value <= 1) return '#1e3a5f';
    if (value <= 2) return '#2d4f7c';
    if (value <= 3) return '#3c6499';
    return '#4b79b6';
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Dashboard"
          subtitle="Analytics and insights into student struggles"
        />

        {/* Gap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GapCard
            title="Today's Most Common Struggle"
            value={mockData.getMostCommonStruggle()}
            icon="📊"
          />
          <GapCard
            title="Fastest Growing Category"
            value={mockData.getFastestGrowingCategory()}
            icon="📈"
          />
          <GapCard
            title="Most Active Time"
            value={mockData.getMostActiveTime()}
            icon="⏰"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Severity Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

          <ChartCard title="Category Trends">
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
          <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[600px] sm:min-w-[800px]">
              <div className="grid grid-cols-25 gap-1 mb-2">
                <div className="text-xs text-gray-400 text-center py-2"></div>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-xs text-gray-400 text-center">
                    {i}h
                  </div>
                ))}
              </div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
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
                <div className="flex items-center gap-2 flex-wrap">
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
    </div>
  );
};

export default Dashboard;

