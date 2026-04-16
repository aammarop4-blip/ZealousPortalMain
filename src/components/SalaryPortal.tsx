import React from 'react';
import { CreditCard, Download, FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { generateSalaryPDF } from '../lib/pdfUtils';

interface SalarySlip {
  SalarySlipID: number;
  MonthYear: string;
  BasicSalary: number;
  Allowances: number;
  Deductions: number;
  NetSalary: number;
  GeneratedDate: string;
  emp_code: string;
}

export default function SalaryPortal() {
  const [slips, setSlips] = React.useState<SalarySlip[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSlips();
  }, []);

  const fetchSlips = async () => {
    try {
      const res = await fetch('/api/salary-slips', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSlips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (slip: SalarySlip) => {
    generateSalaryPDF(slip);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payroll & Salary</h1>
          <p className="text-zinc-500">View and download your monthly salary statements</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Download size={18} /> Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="text-green-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Month</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {slips.length > 0 ? `PKR ${slips[0].NetSalary.toLocaleString()}` : 'PKR 0.00'}
          </div>
          <div className="text-zinc-500 text-sm">Net Payable Amount</div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Year to Date</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            PKR {slips.reduce((acc, curr) => acc + curr.NetSalary, 0).toLocaleString()}
          </div>
          <div className="text-zinc-500 text-sm">Total Earnings 2026</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Calendar className="text-orange-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Next Payout</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">May 01</div>
          <div className="text-zinc-500 text-sm">Scheduled Disbursement</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="font-bold text-white">Salary History</h3>
        </div>
        <div className="divide-y divide-zinc-800">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading statements...</div>
          ) : slips.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No salary history found</div>
          ) : slips.map((slip) => (
            <div key={slip.SalarySlipID} className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-orange-500 transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="text-white font-bold">{slip.MonthYear}</div>
                  <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest">REF: ZS-PAY-{slip.SalarySlipID.toString().padStart(4, '0')}</div>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <div className="text-white font-bold">PKR {slip.NetSalary.toLocaleString()}</div>
                  <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Paid</div>
                </div>
                <button 
                  onClick={() => handleDownload(slip)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-lg transition-all"
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
