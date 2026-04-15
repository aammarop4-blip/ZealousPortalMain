import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  BookOpen, 
  TrendingUp, 
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { generatePerformancePDF, generateWarningPDF } from '../lib/pdfUtils';

interface EmployeeDetails {
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

interface PerformanceRecord {
  PerformanceID: number;
  RecordDate: string;
  KPI_Score: number;
  Status: string;
  ActionPlan: string;
}

interface TrainingProgress {
  EmployeeTrainingID: number;
  ModuleName: string;
  Status: string;
  CompletionDate: string;
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = React.useState<EmployeeDetails | null>(null);
  const [performance, setPerformance] = React.useState<PerformanceRecord[]>([]);
  const [training, setTraining] = React.useState<TrainingProgress[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      // Fetch basic info
      const resEmp = await fetch(`/api/employees/${id}`, { headers });
      const empData = await resEmp.json();
      if (empData.error) throw new Error(empData.error);
      setEmployee(empData);

      // Fetch performance
      const resPerf = await fetch(`/api/employees/${id}/performance`, { headers });
      const perfData = await resPerf.json();
      setPerformance(perfData);

      // Fetch training
      const resTrain = await fetch(`/api/employees/${id}/training`, { headers });
      const trainData = await resTrain.json();
      setTraining(trainData);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPerformance = (record: PerformanceRecord) => {
    if (!employee) return;
    generatePerformancePDF({
      ...record,
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      Department: employee.Department
    });
  };

  const handleIssueWarning = () => {
    if (!employee) return;
    const message = "Repeated delays in submitting weekly compliance reports and failure to attend mandatory training sessions.";
    generateWarningPDF(employee, message);
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading profile...</div>;
  if (!employee) return <div className="p-8 text-center text-zinc-500">Employee not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>
        <button 
          onClick={handleIssueWarning}
          className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-red-500/20"
        >
          <AlertTriangle size={16} /> Issue Warning Letter (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center text-4xl font-bold text-zinc-400">
              {employee.FirstName.charAt(0)}{employee.LastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{employee.FirstName} {employee.LastName}</h1>
              <p className="text-orange-500 font-medium">{employee.Position}</p>
            </div>
            <div className="pt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                employee.Status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                employee.Status === 'On Probation' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
              }`}>
                {employee.Status}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <User size={18} className="text-zinc-500" /> Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail size={16} />
                <span className="text-sm">{employee.Email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone size={16} />
                <span className="text-sm">{employee.Phone}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Briefcase size={16} />
                <span className="text-sm">{employee.Department}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Calendar size={16} />
                <span className="text-sm">Joined {new Date(employee.HireDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Training */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Performance History
              </h3>
              <button className="text-xs text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest">
                View All
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {performance.map((record) => (
                  <div key={record.PerformanceID} className="flex gap-6 items-start group">
                    <div className="text-center shrink-0">
                      <div className="text-2xl font-bold text-white">{record.KPI_Score}</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">KPI Score</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-500 font-mono">{new Date(record.RecordDate).toLocaleDateString()}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                            record.Status === 'Good' ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'
                          }`}>
                            {record.Status}
                          </span>
                          <button 
                            onClick={() => handleDownloadPerformance(record)}
                            className="text-zinc-600 hover:text-white transition-colors p-1"
                            title="Download Performance Report"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-zinc-300 text-sm font-medium">{record.ActionPlan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <BookOpen size={20} className="text-orange-500" /> Training & Certifications
              </h3>
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                {training.filter(t => t.Status === 'Completed').length} / {training.length} Completed
              </div>
            </div>
            <div className="divide-y divide-zinc-800">
              {training.map((item) => (
                <div key={item.EmployeeTrainingID} className="p-6 flex items-center justify-between group hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.Status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {item.Status === 'Completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <div className="text-white font-bold">{item.ModuleName}</div>
                      <div className="text-xs text-zinc-500">
                        {item.Status === 'Completed' ? `Completed on ${new Date(item.CompletionDate).toLocaleDateString()}` : 'In Progress'}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    item.Status === 'Completed' ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 bg-zinc-800'
                  }`}>
                    {item.Status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
