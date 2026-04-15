import React from 'react';
import { Search, Plus, MoreVertical, Mail, Phone, MapPin, Calendar, Briefcase, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Department: string;
  Position: string;
  Status: string;
  HireDate: string;
}

type SortKey = 'name' | 'EmployeeID' | 'Status' | 'HireDate';
type SortOrder = 'asc' | 'desc';

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; order: SortOrder }>({
    key: 'EmployeeID',
    order: 'asc'
  });

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-zinc-600" />;
    return sortConfig.order === 'asc' ? <ArrowUp size={14} className="text-orange-500" /> : <ArrowDown size={14} className="text-orange-500" />;
  };

  const sortedEmployees = React.useMemo(() => {
    const filtered = employees.filter(emp => 
      `${emp.FirstName} ${emp.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.EmployeeID.toString().includes(searchTerm.toLowerCase()) ||
      emp.Department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortConfig.key) {
        case 'name':
          valA = `${a.FirstName} ${a.LastName}`.toLowerCase();
          valB = `${b.FirstName} ${b.LastName}`.toLowerCase();
          break;
        case 'HireDate':
          valA = new Date(a.HireDate || 0).getTime();
          valB = new Date(b.HireDate || 0).getTime();
          break;
        default:
          valA = a[sortConfig.key as keyof Employee];
          valB = b[sortConfig.key as keyof Employee];
      }

      if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, searchTerm, sortConfig]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employee Directory</h1>
          <p className="text-zinc-500">Manage and monitor all company personnel</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20">
          <Plus size={20} /> Add New Employee
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-orange-600 transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-medium hover:text-white hover:border-zinc-600 transition-all">
          Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-800">
              <th 
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Employee {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('EmployeeID')}
              >
                <div className="flex items-center gap-2">
                  ID & Dept {getSortIcon('EmployeeID')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('Status')}
              >
                <div className="flex items-center gap-2">
                  Status {getSortIcon('Status')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('HireDate')}
              >
                <div className="flex items-center gap-2">
                  Hire Date {getSortIcon('HireDate')}
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Loading records...</td></tr>
            ) : sortedEmployees.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No employees found</td></tr>
            ) : sortedEmployees.map((emp) => (
              <tr 
                key={emp.EmployeeID} 
                className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                onClick={() => navigate(`/employees/${emp.EmployeeID}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold">
                      {emp.FirstName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{emp.FirstName} {emp.LastName}</div>
                      <div className="text-xs text-zinc-500">{emp.Email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-zinc-300 text-sm font-medium">ZS-{emp.EmployeeID.toString().padStart(4, '0')}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-tighter">{emp.Department} • {emp.Position}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    emp.Status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    emp.Status === 'On Probation' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                  }`}>
                    {emp.Status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm font-mono">
                  {emp.HireDate ? new Date(emp.HireDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
