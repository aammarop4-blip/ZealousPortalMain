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
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-bold text-white">Z</div>
        <span className="font-bold text-xl tracking-tight text-white">ZEALOUS <span className="text-orange-600">SOLUTIONS</span></span>
      </div>
      
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <Link to="/jobs" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Careers</Link>
            <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">Portal Login</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-white text-sm font-medium">{user.name}</span>
              <span className="text-zinc-500 text-xs">{user.role}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-all"
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
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 h-[calc(100vh-64px)] sticky top-16 hidden md:block">
      <div className="p-4 space-y-2">
        {menuItems.filter(item => item.roles.includes(role)).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path 
                ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

// --- Pages ---

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8">
            AUTOMATED <br />
            <span className="text-orange-600 italic">HR EXCELLENCE.</span>
          </h1>
          <p className="text-zinc-400 text-xl mb-12 max-w-xl leading-relaxed">
            Streamline your employee lifecycle with Zealous Solutions. From onboarding to performance, we automate the complexity of HR management.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Admin', role: 'ADMIN' },
              { label: 'Management', role: 'MANAGEMENT' },
              { label: 'Team Lead', role: 'TEAM_LEAD' },
              { label: 'Agent', role: 'AGENT' }
            ].map((btn) => (
              <Link 
                key={btn.role}
                to="/login" 
                className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-orange-600 transition-all group"
              >
                <div className="text-lg font-bold text-zinc-400 group-hover:text-white">{btn.label}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Portal</div>
              </Link>
            ))}
          </div>

          <div className="flex gap-4">
            <Link to="/login" className="bg-white text-black px-8 py-4 rounded font-bold hover:bg-zinc-200 transition-all flex items-center gap-2">
              Access Portal <ChevronRight size={20} />
            </Link>
            <Link to="/jobs" className="border border-zinc-800 px-8 py-4 rounded font-bold hover:bg-zinc-900 transition-all">
              View Careers
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="border-y border-zinc-800 py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Smart Onboarding', desc: 'Automated registration and training modules for new hires.' },
            { title: 'Performance Tracking', desc: 'Real-time dashboards and automated grading systems.' },
            { title: 'Salary Automation', desc: 'Instant payslip generation and automated HR notifications.' }
          ].map((feature, i) => (
            <div key={i} className="space-y-4">
              <div className="text-orange-600 font-mono text-sm">0{i+1} //</div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">WE ARE <br /><span className="text-orange-600 italic">ZEALOUS.</span></h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Founded in 2024, Zealous Solutions was born from a simple observation: HR departments are drowning in manual paperwork. Our mission is to provide the digital infrastructure that allows HR professionals to focus on what matters most—people.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-zinc-500 text-sm uppercase tracking-widest">Employees Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-zinc-500 text-sm uppercase tracking-widest">Uptime Guarantee</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent" />
            <div className="text-orange-600 opacity-20 font-black text-[200px] select-none">ZS</div>
          </div>
          <div className="absolute -bottom-8 -left-8 bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl max-w-xs">
            <p className="text-white italic font-medium">"Zealous transformed our onboarding process from 3 days to 3 hours."</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div>
                <div className="text-sm font-bold">Sarah Connor</div>
                <div className="text-xs text-zinc-500">HR Director, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Portal Login</h2>
          <p className="text-zinc-500">Enter your Email or User ID to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email or User ID</label>
            <input 
              type="text" 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-600 transition-colors"
              placeholder="name@zealous.com or ZS-000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-600 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" size={18} className="text-xs text-orange-600 hover:text-orange-500 transition-colors font-medium">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-orange-600/20">
            Sign In to Portal
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-wrap gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 border-dashed">
        <h3 className="w-full text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Role Access Portals</h3>
        <button onClick={() => navigate("/admin")} className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-sm">Admin Portal</button>
        <button onClick={() => navigate("/management")} className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-sm">Management Portal</button>
        <button onClick={() => navigate("/teamlead")} className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-sm">Team Lead Portal</button>
        <button onClick={() => navigate("/agent")} className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-sm">Agent Portal</button>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-zinc-500">Welcome back, {user.name}. Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <div className="text-zinc-500 text-sm font-mono uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: '124', icon: Users, color: 'blue' },
          { label: 'Active Trainings', value: '12', icon: BookOpen, color: 'orange' },
          { label: 'Pending Reviews', value: '8', icon: BarChart3, color: 'green' },
          { label: 'Alerts', value: '3', icon: Bell, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-orange-600/50 transition-colors`}>
                <stat.icon size={20} className="text-zinc-400 group-hover:text-orange-500" />
              </div>
              <span className="text-xs font-mono text-zinc-600">0{i+1}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {user.role === 'AGENT' && (
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-600 text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome, {user.name}</h2>
              <p className="text-zinc-500">You have 2 pending training modules and your next salary slip will be available in 12 days.</p>
            </div>
            <div className="flex gap-4 text-right">
              <div className="text-xs text-zinc-500 uppercase mb-1">Last Payout</div>
              <div className="text-2xl font-bold text-white">PKR 125,000</div>
            </div>
            <div className="flex gap-4">
              <Link to="/attendance" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20">
                Check In Now
              </Link>
            </div>
          </div>

          <PerformanceCharts />
        </div>
      )}

      {(user.role === 'ADMIN' || user.role === 'MANAGEMENT') && (
        <div className="bg-orange-600/5 border border-orange-600/20 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600/10 rounded-xl text-orange-600">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold">Managerial Insights Available</h3>
              <p className="text-zinc-500 text-sm text-balance">View your team's performance distribution, training compliance, and pending approvals in the dedicated dashboard.</p>
            </div>
          </div>
          <Link to="/manager-dashboard" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap">
            Go to Team Dashboard
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">View All</button>
          </div>
          <div className="divide-y divide-zinc-800">
            {[
              { type: 'ONBOARDING', msg: 'New employee registration: Sarah Connor', time: '2h ago' },
              { type: 'SALARY', msg: 'Salary slips generated for April 2026', time: '5h ago' },
              { type: 'TRAINING', msg: 'John Doe completed Medicare Compliance module', time: '1d ago' },
              { type: 'ALERT', msg: 'Performance warning issued to Mark Smith', time: '2d ago' },
            ].map((activity, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'ALERT' ? 'bg-red-500' : 
                    activity.type === 'ONBOARDING' ? 'bg-blue-500' : 
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="text-sm text-white font-medium">{activity.msg}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">{activity.type}</div>
                  </div>
                </div>
                <div className="text-xs text-zinc-600 font-mono">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add Employee', icon: Plus, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
              { label: 'Generate Reports', icon: FileText, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
              { label: 'Issue Warning', icon: AlertTriangle, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'] },
              { label: 'Download Payslips', icon: Download, roles: ['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT', 'HR'] },
            ].filter(action => action.roles.includes(user.role)).map((action, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (action.label === 'Add Employee') navigate('/employees');
                  if (action.label === 'Download Payslips') navigate('/payroll');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-sm font-medium"
              >
                <action.icon size={18} />
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

  if (loading) return <div className="bg-zinc-950 min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 font-sans selection:bg-orange-600 selection:text-white">
        <Navbar user={user} onLogout={handleLogout} />
        
        <div className="flex">
          {user && <Sidebar role={user.role} />}
          
          <main className="flex-1 min-h-[calc(100vh-64px)] overflow-y-auto">
            <Routes>
              <Route path="/" element={!user ? <LandingPage /> : <Dashboard user={user} />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/admin" element={user && user.role === 'ADMIN' ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/management" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT') ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/teamlead" element={user && (user.role === 'ADMIN' || user.role === 'MANAGEMENT' || user.role === 'TEAM_LEAD') ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
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
    </Router>
  );
}
