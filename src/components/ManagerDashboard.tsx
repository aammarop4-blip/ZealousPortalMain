import React from 'react';
import { 
  Users, 
  Target, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const performanceData = [
  { name: 'Sarah', score: 92 },
  { name: 'John', score: 65 },
  { name: 'Mark', score: 88 },
  { name: 'Alice', score: 95 },
  { name: 'Bob', score: 78 },
];

const teamStatusData = [
  { name: 'Completed', value: 65, color: '#22c55e' },
  { name: 'In Progress', value: 25, color: '#eab308' },
  { name: 'Not Started', value: 10, color: '#ef4444' },
];

export default function ManagerDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manager Dashboard</h1>
          <p className="text-zinc-500">Overview of your team's performance and operational status</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Team Size', value: '12', icon: Users, trend: '+2 this month', trendType: 'up' },
          { label: 'Avg KPI Score', value: '84%', icon: TrendingUp, trend: '+5% vs last qtr', trendType: 'up' },
          { label: 'Pending Actions', value: '7', icon: AlertCircle, trend: '3 high priority', trendType: 'down' },
          { label: 'Goals Met', value: '82%', icon: Target, trend: 'On track', trendType: 'up' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400">
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendType === 'up' ? 'text-green-500' : 'text-orange-500'}`}>
                {stat.trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Performance Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-[400px]">
          <h3 className="text-white font-bold mb-6">Team Performance Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#18181b' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#ea580c' : '#71717a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Training Status */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-[400px] flex flex-col">
          <h3 className="text-white font-bold mb-6">Training Compliance</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teamStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {teamStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {teamStatusData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-xs text-zinc-500 mb-1">{item.name}</div>
                <div className="text-sm font-bold text-white">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold text-white">Pending Actions</h3>
            <span className="bg-orange-600/10 text-orange-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">7 Items</span>
          </div>
          <div className="divide-y divide-zinc-800">
            {[
              { title: 'Approve Leave Request', user: 'John Doe', time: '2h ago', priority: 'High' },
              { title: 'Review Assessment', user: 'Sarah Connor', time: '5h ago', priority: 'Medium' },
              { title: 'Training Module Feedback', user: 'Mark Smith', time: '1d ago', priority: 'Low' },
              { title: 'Performance Review', user: 'Alice Wong', time: '2d ago', priority: 'High' },
            ].map((action, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    action.priority === 'High' ? 'bg-red-500' : 
                    action.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="text-white font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-zinc-500">{action.user} • {action.time}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-xs font-bold text-zinc-500 hover:text-white transition-colors bg-zinc-950/50 border-t border-zinc-800">
            View All Actions
          </button>
        </div>

        {/* Team Goals */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-white">Team Goals - Q2 2026</h3>
          <div className="space-y-6">
            {[
              { label: 'Compliance Certification', progress: 85, color: 'bg-orange-600' },
              { label: 'Customer Satisfaction Score', progress: 92, color: 'bg-green-500' },
              { label: 'Project "Zealous" Delivery', progress: 45, color: 'bg-blue-500' },
              { label: 'Internal Training Hours', progress: 70, color: 'bg-yellow-500' },
            ].map((goal, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300 font-medium">{goal.label}</span>
                  <span className="text-white font-bold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className={`${goal.color} h-full rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
