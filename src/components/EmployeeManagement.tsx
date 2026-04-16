import React from 'react';
import { Search, Plus, MoreVertical, Phone, MapPin, Calendar, Briefcase, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  custom_employee_id: string;
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
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [creationSuccess, setCreationSuccess] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [deptFilter, setDeptFilter] = React.useState('All');
  const [newEmp, setNewEmp] = React.useState({
    name: '',
    email: '',
    role: 'AGENT',
    employee_id: '',
    password: ''
  });

  const generateCredentials = () => {
    setNewEmp({
      name: '',
      email: '',
      role: 'AGENT',
      employee_id: '',
      password: Math.random().toString(36).slice(-8)
    });
  };

  const openAddModal = () => {
    generateCredentials();
    setCreationSuccess(false);
    setShowAddModal(true);
  };

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

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newEmp)
      });
      const data = await res.json();
      if (res.ok) {
        setNewEmp(prev => ({ ...prev, employee_id: data.employee_id }));
        setCreationSuccess(true);
        fetchEmployees();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
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

  const departments = React.useMemo(() => {
    const depts = new Set(employees.map(emp => emp.Department).filter(Boolean));
    return ['All', ...Array.from(depts)].sort();
  }, [employees]);

  const statuses = ['All', 'Active', 'On Probation', 'Terminated'];

  const filteredAndSortedEmployees = React.useMemo(() => {
    let filtered = employees.filter(emp => 
      `${emp.FirstName} ${emp.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.EmployeeID.toString().includes(searchTerm.toLowerCase()) ||
      emp.Department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.Phone && emp.Phone.includes(searchTerm))
    );

    if (statusFilter !== 'All') {
      filtered = filtered.filter(emp => emp.Status === statusFilter);
    }

    if (deptFilter !== 'All') {
      filtered = filtered.filter(emp => emp.Department === deptFilter);
    }

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
  }, [employees, searchTerm, sortConfig, statusFilter, deptFilter]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employee Directory</h1>
          <p className="text-zinc-500">Manage and monitor all company personnel</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20"
        >
          <Plus size={20} /> Add New Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
            >
              {creationSuccess ? (
                <div className="text-center space-y-6 py-4">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-zinc-500">Share these credentials with the employee.</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 text-left">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User ID</label>
                      <div className="text-white font-mono text-lg">{newEmp.employee_id}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Temporary Password</label>
                      <div className="text-white font-mono text-lg">{newEmp.password}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Create New Employee Account</h2>
                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                        <input 
                          required
                          type="text" 
                          value={newEmp.name}
                          onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</label>
                        <input 
                          required
                          type="email" 
                          value={newEmp.email}
                          onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                        <select 
                          value={newEmp.role}
                          onChange={(e) => setNewEmp({...newEmp, role: e.target.value as any})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-600"
                        >
                          <option value="AGENT">Agent</option>
                          <option value="TEAM_LEAD">Team Lead</option>
                          <option value="MANAGEMENT">Management</option>
                          <option value="ADMIN">Admin</option>
                          <option value="HR">HR</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Employee ID (Optional)</label>
                        <input 
                          type="text" 
                          value={newEmp.employee_id}
                          onChange={(e) => setNewEmp({...newEmp, employee_id: e.target.value})}
                          placeholder="Leave blank for auto-gen"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Temporary Password</label>
                      <input 
                        readOnly
                        type="text" 
                        value={newEmp.password}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-4 text-zinc-500 font-bold hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-600/20"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-orange-600 transition-all font-medium"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-medium hover:text-white transition-all focus:outline-none focus:border-orange-600 appearance-none min-w-[140px]"
          >
            <option disabled value="">Dept: {deptFilter === 'All' ? 'All' : deptFilter}</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-medium hover:text-white transition-all focus:outline-none focus:border-orange-600 appearance-none min-w-[140px]"
          >
            <option disabled value="">Status: {statusFilter === 'All' ? 'All' : statusFilter}</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
            ))}
          </select>

          {(deptFilter !== 'All' || statusFilter !== 'All' || searchTerm !== '') && (
            <button 
              onClick={() => {
                setDeptFilter('All');
                setStatusFilter('All');
                setSearchTerm('');
              }}
              className="px-4 py-3 text-zinc-500 hover:text-orange-500 font-bold transition-colors text-sm"
            >
              Reset
            </button>
          )}
        </div>
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
            ) : filteredAndSortedEmployees.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No employees found</td></tr>
            ) : filteredAndSortedEmployees.map((emp) => (
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
                  <div className="text-zinc-300 text-sm font-medium">{emp.custom_employee_id || `ZS-${emp.EmployeeID.toString().padStart(4, '0')}`}</div>
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
