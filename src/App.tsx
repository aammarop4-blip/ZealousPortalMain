import React from 'react';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  CreditCard, 
  Bell, 
  LogOut, 
  Briefcase, 
  Award,
  ChevronRight,
  Search,
  Plus,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  UserCheck,
  Key,
  LayoutDashboard,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  useLocation 
} from 'react-router-dom';
import EmployeeManagement from './components/EmployeeManagement';
import TrainingPortal from './components/TrainingPortal';
import SalaryPortal from './components/SalaryPortal';
import JobPostings from './components/JobPostings';
import AlertsPage from './components/AlertsPage';
import AssessmentPortal from './components/AssessmentPortal';
import PerformanceManagement from './components/PerformanceManagement';
import RecognitionPortal from './components/RecognitionPortal';
import EmployeeProfile from './components/EmployeeProfile';
import AttendancePortal from './components/AttendancePortal';
import ForgotPassword from './components/ForgotPassword';
import PerformanceCharts from './components/PerformanceCharts';
import ManagerDashboard from './components/ManagerDashboard';
import PerformanceUpload from './components/PerformanceUpload';
import MainLandingPage from './components/MainLandingPage';

// --- Types ---
interface User {
  id: number;
  email: string;
  role: 'HR' | 'ADMIN' | 'MANAGEMENT' | 'TEAM_LEAD' | 'AGENT';
  name: string;
  employee_id?: string;
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  return (
    <nav className="border-b border-zinc-800 bg-zealous-black px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center font-bold text-black text-lg">Z</div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-lg tracking-tighter text-white uppercase">ZEALOUS</span>
          <span className="text-[8px] font-black tracking-[0.2em] text-zealous-gold">SOLUTIONS</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Home</Link>
            <Link to="/jobs" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">Careers</Link>
            <Link to="/login" className="gold-gradient text-black px-4 py-2 rounded text-sm font-bold transition-transform hover:scale-105">Portal Login</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-white text-sm font-bold tracking-tight">{user.name}</span>
              <span className="text-zealous-gold text-[10px] font-black tracking-widest uppercase">{user.role}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-zealous-gold hover:bg-zinc-900 rounded transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const Sidebar = ({ role }: { role: string }) => {
  const location = useLocation();
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
    { icon: LayoutDashboard, label: 'Team Dashboard', path: '/manager-dashboard', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
    { icon: Users, label: 'Employees', path: '/employees', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
    { icon: UserCheck, label: 'Attendance', path: '/attendance', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
    { icon: BarChart3, label: 'Performance', path: '/performance', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
    { icon: BookOpen, label: 'Training', path: '/training', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
    { icon: CheckCircle2, label: 'Assessments', path: '/assessments', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
    { icon: CreditCard, label: 'Payroll', path: '/payroll', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
    { icon: Bell, label: 'Alerts', path: '/alerts', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
    { icon: Upload, label: 'Upload Reports', path: '/upload-reports', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
    { icon: Award, label: 'Recognition', path: '/recognition', roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zealous-black h-[calc(100vh-64px)] sticky top-16 hidden md:block">
      <div className="p-4 space-y-2">
        {menuItems.filter(item => item.roles.includes(role)).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold tracking-tight ${
              location.pathname === item.path 
                ? 'gold-gradient text-black' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900 shadow-sm'
            }`}
          >
            <item.icon size={20} />
            <span className="font-bold">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

// --- Pages ---

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [loginId, setLoginId] = React.useState('admin@zealous.com');
  const [password, setPassword] = React.useState('admin123');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      localStorage.setItem('token', data.token);
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zealous-black p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-50" />
        <div className="mb-8 text-center">
          <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center font-bold text-black text-3xl mx-auto mb-4 shadow-lg shadow-zealous-gold/20">Z</div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Portal <span className="text-zealous-gold">Login</span></h2>
          <p className="text-zinc-500 font-medium">Powering high-performance teams.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm font-bold">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Email or User ID</label>
            <input 
              type="text" 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full bg-zealous-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zealous-gold transition-colors font-semibold"
              placeholder="name@zealous.com or ZS-000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zealous-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zealous-gold transition-colors font-semibold"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" size={18} className="text-[10px] text-zealous-gold hover:text-zealous-gold-light transition-colors font-black uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full gold-gradient text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-zealous-gold/10 hover:shadow-zealous-gold/20 hover:scale-[1.02]">
            SECURE ACCESS
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  return (
    <div className="p-8 space-y-8 bg-zealous-black min-h-full">
      <div className="flex flex-wrap gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl border-dashed">
        <h3 className="w-full text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">System Authorization Entry</h3>
        <button onClick={() => navigate("/admin")} className="flex-1 bg-zealous-black hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-black transition-all shadow-sm text-sm uppercase tracking-tighter hover:border-zealous-gold">Admin Portal</button>
        <button onClick={() => navigate("/management")} className="flex-1 bg-zealous-black hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-black transition-all shadow-sm text-sm uppercase tracking-tighter hover:border-zealous-gold">Management Portal</button>
        <button onClick={() => navigate("/teamlead")} className="flex-1 bg-zealous-black hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-black transition-all shadow-sm text-sm uppercase tracking-tighter hover:border-zealous-gold">Lead Portal</button>
        <button onClick={() => navigate("/agent")} className="flex-1 bg-zealous-black hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-black transition-all shadow-sm text-sm uppercase tracking-tighter hover:border-zealous-gold">Agent Portal</button>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">LIVE <span className="text-zealous-gold">OVERVIEW.</span></h1>
          <p className="text-zinc-500 font-bold">Authorized Access: <span className="text-white">{user.name}</span></p>
        </div>
        <div className="text-right">
          <div className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Workforce', value: '124', icon: Users, color: 'blue' },
          { label: 'Active Training', value: '12', icon: BookOpen, color: 'orange' },
          { label: 'Performance Rate', value: '94%', icon: BarChart3, color: 'green' },
          { label: 'Security Alerts', value: '3', icon: Bell, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zealous-gold transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-zealous-black border border-zinc-800 group-hover:border-zealous-gold transition-colors shadow-lg`}>
                <stat.icon size={22} className="text-zinc-500 group-hover:text-zealous-gold" />
              </div>
              <span className="text-[10px] font-black text-zinc-700 tracking-[0.3em]">UNIT 0{i+1}</span>
            </div>
            <div className="text-4xl font-black text-white mb-2 tracking-tighter italic">{stat.value}</div>
            <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {user.role === 'AGENT' && (
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 gold-gradient opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center text-black text-4xl font-black shadow-xl shadow-zealous-gold/20">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Status: <span className="text-zealous-gold">Operational</span></h2>
              <p className="text-zinc-500 font-bold max-w-md leading-relaxed">System identity confirmed. You have 2 pending training modules assigned to your profile.</p>
            </div>
            <div className="flex gap-10 text-right z-10">
              <div>
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Last Payout</div>
                <div className="text-2xl font-black text-white tracking-widest">PKR 125K</div>
              </div>
            </div>
            <div className="flex gap-4 z-10">
              <Link to="/attendance" className="gold-gradient text-black px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-zealous-gold/10 hover:shadow-zealous-gold/30 uppercase tracking-widest text-sm">
                Check In
              </Link>
            </div>
          </div>

          <PerformanceCharts />
        </div>
      )}

      {(user.role === 'ADMIN' || user.role === 'MANAGEMENT') && (
        <div className="bg-zealous-gold/5 border border-zealous-gold/20 p-8 rounded-[2rem] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-zealous-gold/10 rounded-2xl text-zealous-gold shadow-inner">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h3 className="text-white font-black text-xl uppercase tracking-tighter">Managerial Intelligence</h3>
              <p className="text-zinc-500 font-bold text-sm max-w-xl">Deep-dive into team distribution, compliance auditing, and recursive performance metrics.</p>
            </div>
          </div>
          <Link to="/manager-dashboard" className="gold-gradient text-black px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-zealous-gold/10 hover:scale-105 uppercase tracking-widest text-sm whitespace-nowrap">
            Launch Dashboard
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zealous-black/50">
            <h3 className="font-black text-white uppercase tracking-widest italic">System Activity</h3>
            <button className="text-[10px] font-black text-zinc-500 hover:text-zealous-gold transition-colors uppercase tracking-[0.3em]">Log Report</button>
          </div>
          <div className="divide-y divide-zinc-800">
            {[
              { type: 'IDENTITY', msg: 'Core verification: Sarah Connor', time: '2h ago' },
              { type: 'PAYOUT', msg: 'System wide salary distribution finalized', time: '5h ago' },
              { type: 'COMPLIANCE', msg: 'Medicare Compliance module audit pass', time: '1d ago' },
              { type: 'WARNING', msg: 'Protocol violation alert: Security Unit 03', time: '2d ago' },
            ].map((activity, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    activity.type === 'WARNING' ? 'bg-zealous-gold animate-pulse' : 
                    activity.type === 'IDENTITY' ? 'bg-white' : 
                    'bg-zinc-600'
                  }`} />
                  <div>
                    <div className="text-sm text-white font-black uppercase tracking-tight italic">{activity.msg}</div>
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{activity.type}</div>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-700 font-black tracking-widest uppercase">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h3 className="font-black text-white mb-8 uppercase tracking-widest italic border-b border-zinc-800 pb-4">CORE FUNCTIONS</h3>
          <div className="space-y-4">
            {[
              { label: 'Register Unit', icon: Plus, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
              { label: 'Audit Assets', icon: FileText, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
              { label: 'System Alert', icon: AlertTriangle, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
              { label: 'Payout Archive', icon: Download, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
            ].filter(action => action.roles.includes(user.role)).map((action, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (action.label === 'Register Unit') navigate('/employees');
                  if (action.label === 'Payout Archive') navigate('/payroll');
                }}
                className="w-full flex items-center gap-4 px-6 py-4 bg-zealous-black border border-zinc-800 rounded-xl text-zinc-500 hover:text-white hover:border-zealous-gold transition-all text-xs font-black uppercase tracking-[0.2em]"
              >
                <action.icon size={18} className="group-hover:text-zealous-gold" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App ---

const AppContent = ({ 
  user, 
  handleLogout, 
  handleLogin 
}: { 
  user: User | null, 
  handleLogout: () => void, 
  handleLogin: (u: User) => void 
}) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' && !user;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-zealous-gold selection:text-black">
      {!isLandingPage && <Navbar user={user} onLogout={handleLogout} />}
      
      <div className="flex">
        {user && <Sidebar role={user.role} />}
        
        <main className={`flex-1 ${!isLandingPage ? 'min-h-[calc(100vh-64px)]' : 'min-h-screen'} overflow-y-auto`}>
          <Routes>
            <Route path="/" element={!user ? <MainLandingPage /> : <Dashboard user={user} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/admin" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'HR') ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/management" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'HR') ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/teamlead" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/agent" element={user ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/manager-dashboard" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <ManagerDashboard /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/employees" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <EmployeeManagement /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/employees/:id" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <EmployeeProfile /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/attendance" element={user ? <AttendancePortal /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/training" element={user ? <TrainingPortal /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/payroll" element={user ? <SalaryPortal /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/performance" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <PerformanceManagement /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/recognition" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <RecognitionPortal /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/alerts" element={user ? <AlertsPage /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/assessments" element={user ? <AssessmentPortal /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/upload-reports" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD' || user.role === 'HR') ? <PerformanceUpload /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/jobs" element={<JobPostings />} />
            <Route path="*" element={<div className="p-8 text-white">Module coming soon...</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) return <div className="bg-zinc-950 min-h-screen flex items-center justify-center text-white font-bold">Loading Zealous Core...</div>;

  return (
    <Router>
      <AppContent user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
}
