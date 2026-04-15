import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, UserPlus, FileText, Search, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { generatePerformancePDF } from '../lib/pdfUtils';

interface PerformanceRecord {
  PerformanceID: number;
  EmployeeID: number;
  RecordDate: string;
  KPI_Score: number;
  ActionPlan: string;
  Status: string;
  FirstName: string;
  LastName: string;
  Department: string;
}

export default function PerformanceManagement() {
  const [records, setRecords] = React.useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real app, we would fetch from /api/performance
    // For now, we'll use mock data that matches the new schema
    setRecords([
      { PerformanceID: 1, EmployeeID: 1, RecordDate: '2026-03-15', KPI_Score: 95, ActionPlan: 'Continue leadership training and mentor junior staff. Focus on strategic planning for Q3.', Status: 'Good', FirstName: 'Sarah', LastName: 'Connor', Department: 'HR' },
      { PerformanceID: 2, EmployeeID: 2, RecordDate: '2026-04-01', KPI_Score: 65, ActionPlan: 'Technical skills workshop required. Weekly check-ins with supervisor to monitor progress on project milestones.', Status: 'Needs Improvement', FirstName: 'John', LastName: 'Doe', Department: 'Operations' },
      { PerformanceID: 3, EmployeeID: 3, RecordDate: '2026-03-20', KPI_Score: 88, ActionPlan: 'Prepare for senior role. Take on more responsibility in cross-departmental projects.', Status: 'Good', FirstName: 'Mark', LastName: 'Smith', Department: 'Compliance' }
    ]);
    setLoading(false);
  }, []);

  const handleDownload = (record: PerformanceRecord) => {
    generatePerformancePDF(record);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Performance Management</h1>
          <p className="text-zinc-500">Monitor employee growth, set goals, and manage improvement plans</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20">
          <UserPlus size={20} /> New Review Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg KPI Score</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {records.length > 0 ? (records.reduce((acc, curr) => acc + curr.KPI_Score, 0) / records.length).toFixed(1) : '0'}%
          </div>
          <div className="text-zinc-500 text-sm">Company-wide performance</div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <AlertTriangle className="text-orange-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action Plans</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {records.filter(r => r.Status === 'Needs Improvement').length}
          </div>
          <div className="text-zinc-500 text-sm">Active improvement plans</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="text-green-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Completed</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">88%</div>
          <div className="text-zinc-500 text-sm">Q1 Review completion rate</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Employee Performance Records</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter employees..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>
        <div className="divide-y divide-zinc-800">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No performance records found</div>
          ) : records.map((record) => (
            <div key={record.PerformanceID} className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold">
                  {record.FirstName.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold">{record.FirstName} {record.LastName}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">{record.Department}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-white font-bold">{record.KPI_Score}%</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">KPI Score</div>
                </div>
                <div className="text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    record.Status === 'Good' ? 'bg-green-500/10 text-green-500' :
                    record.Status === 'Needs Improvement' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {record.Status}
                  </span>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-zinc-400 text-sm font-mono">{record.RecordDate}</div>
                  <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Record Date</div>
                </div>
                <button 
                  onClick={() => handleDownload(record)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-all"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
