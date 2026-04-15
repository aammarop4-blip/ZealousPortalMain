import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Download, MapPin, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface AttendanceRecord {
  AttendanceID: number;
  Date: string;
  CheckIn: string;
  CheckOut: string;
  Status: string;
  FirstName: string;
  LastName: string;
}

export default function AttendancePortal() {
  const [records, setRecords] = React.useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [checkingIn, setCheckingIn] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setMessage('');
    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage(data.message);
      fetchAttendance();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  const stats = {
    present: records.filter(r => r.Status === 'Present').length,
    late: records.filter(r => r.Status === 'Late').length,
    absent: records.filter(r => r.Status === 'Absent').length,
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Attendance Tracking</h1>
          <p className="text-zinc-500">Monitor your daily check-ins and monthly attendance history</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 disabled:opacity-50"
          >
            <UserCheck size={20} /> {checkingIn ? 'Checking In...' : 'Check In Today'}
          </button>
          <button className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Download size={18} /> Export History
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.includes('successfully') 
            ? 'bg-green-500/10 border-green-500/20 text-green-500' 
            : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {message.includes('successfully') ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="text-green-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Present</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.present}</div>
          <div className="text-zinc-500 text-sm">Days this month</div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="text-orange-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Late Arrivals</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.late}</div>
          <div className="text-zinc-500 text-sm">Requires attention</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Absences</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.absent}</div>
          <div className="text-zinc-500 text-sm">Approved & Unapproved</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="font-bold text-white">Attendance Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Loading records...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No attendance history found</td></tr>
              ) : records.map((record) => (
                <tr key={record.AttendanceID} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-zinc-500" />
                      <span className="text-white font-medium">{new Date(record.Date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-300 font-mono">{record.CheckIn || '--:--'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-300 font-mono">{record.CheckOut || '--:--'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      record.Status === 'Present' ? 'bg-green-500/10 text-green-500' :
                      record.Status === 'Late' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {record.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <MapPin size={12} /> Office (HQ)
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
