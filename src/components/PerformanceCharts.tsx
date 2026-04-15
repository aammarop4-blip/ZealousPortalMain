import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { name: 'Jan', score: 82 },
  { name: 'Feb', score: 85 },
  { name: 'Mar', score: 92 },
  { name: 'Apr', score: 88 },
  { name: 'May', score: 95 },
  { name: 'Jun', score: 90 },
];

export default function PerformanceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-[350px]">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
          KPI Score Trend
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#ea580c' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#ea580c" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-[350px]">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
          Attendance Consistency
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#71717a" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
