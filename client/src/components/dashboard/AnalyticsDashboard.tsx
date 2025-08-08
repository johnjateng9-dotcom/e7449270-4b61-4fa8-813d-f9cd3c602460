import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FolderKanban, Clock, DollarSign, Target } from 'lucide-react';

const AnalyticsDashboard = () => {
  // Sample data
  const projectData = [
    { name: 'Jan', completed: 12, active: 8, overdue: 2 },
    { name: 'Feb', completed: 15, active: 10, overdue: 1 },
    { name: 'Mar', completed: 18, active: 12, overdue: 3 },
    { name: 'Apr', completed: 22, active: 15, overdue: 2 },
    { name: 'May', completed: 25, active: 18, overdue: 1 },
    { name: 'Jun', completed: 28, active: 20, overdue: 4 },
  ];

  const productivityData = [
    { name: 'Mon', hours: 7.5 },
    { name: 'Tue', hours: 8.2 },
    { name: 'Wed', hours: 6.8 },
    { name: 'Thu', hours: 8.5 },
    { name: 'Fri', hours: 7.0 },
    { name: 'Sat', hours: 3.2 },
    { name: 'Sun', hours: 1.5 },
  ];

  const teamDistribution = [
    { name: 'Development', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Design', value: 25, color: 'hsl(var(--accent))' },
    { name: 'Marketing', value: 20, color: 'hsl(var(--success))' },
    { name: 'Sales', value: 10, color: 'hsl(var(--destructive))' },
  ];

  const revenueData = [
    { name: 'Q1', revenue: 125000, growth: 12 },
    { name: 'Q2', revenue: 148000, growth: 18 },
    { name: 'Q3', revenue: 167000, growth: 13 },
    { name: 'Q4', revenue: 195000, growth: 17 },
  ];

  const StatCard = ({ icon: Icon, title, value, change, positive }: any) => (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${positive ? 'bg-success/20' : 'bg-destructive/20'}`}>
          <Icon className={`w-5 h-5 ${positive ? 'text-success' : 'text-destructive'}`} />
        </div>
        <div className={`text-sm font-medium ${positive ? 'text-success' : 'text-destructive'}`}>
          {positive ? '+' : ''}{change}%
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track team performance and business metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FolderKanban}
          title="Active Projects"
          value="24"
          change={12}
          positive={true}
        />
        <StatCard
          icon={Users}
          title="Team Members"
          value="156"
          change={8}
          positive={true}
        />
        <StatCard
          icon={Clock}
          title="Avg. Task Completion"
          value="2.3 days"
          change={-15}
          positive={true}
        />
        <StatCard
          icon={Target}
          title="Project Success Rate"
          value="94%"
          change={3}
          positive={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Project Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overdue" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity Chart */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue and Team Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue Growth</h3>
            <div className="flex items-center space-x-2 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+15% YoY</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team Distribution */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Team Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={teamDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {teamDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {teamDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { user: "Sarah Chen", action: "completed", target: "Landing Page Design", time: "2 minutes ago" },
            { user: "Mike Johnson", action: "started", target: "User Research Phase 2", time: "15 minutes ago" },
            { user: "Alex Kim", action: "commented on", target: "Payment Integration Task", time: "1 hour ago" },
            { user: "Emma Wilson", action: "uploaded", target: "Mobile App Screenshots", time: "2 hours ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/20 transition-colors">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-medium">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;