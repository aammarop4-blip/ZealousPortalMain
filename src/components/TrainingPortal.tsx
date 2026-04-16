import React from 'react';
import { BookOpen, CheckCircle2, Clock, Play, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface Module {
  ModuleID: number;
  ModuleName: string;
  Description: string;
  Mandatory: boolean;
  CompletionStatus: string | null;
  LastScore: number | null;
}

export default function TrainingPortal() {
  const [modules, setModules] = React.useState<Module[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch('/api/training/modules', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'MVA', icon: ShieldCheck, color: 'text-blue-500' },
    { name: 'Medicare', icon: ShieldCheck, color: 'text-orange-500' },
    { name: 'ACA', icon: ShieldCheck, color: 'text-green-500' },
    { name: 'FE', icon: ShieldCheck, color: 'text-purple-500' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Training & Compliance</h1>
          <p className="text-zinc-500">Mandatory certifications and skill development modules</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Award className="text-orange-500" size={18} />
            <span className="text-white font-bold">85%</span>
            <span className="text-zinc-500 text-xs uppercase font-bold">Avg Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all cursor-pointer group">
            <cat.icon className={`mb-4 ${cat.color}`} size={24} />
            <h3 className="text-white font-bold text-lg">{cat.name}</h3>
            <p className="text-zinc-500 text-sm">Compliance Training</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Available Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12 text-zinc-500">Loading modules...</div>
          ) : modules.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-zinc-500">No training modules available</div>
          ) : modules.map((mod) => {
            const isIncompleteMandatory = mod.Mandatory && mod.CompletionStatus !== 'Completed';
            return (
              <motion.div 
                key={mod.ModuleID}
                whileHover={{ y: -4 }}
                className={`bg-zinc-900 border p-6 rounded-2xl flex gap-6 items-start group transition-all ${
                  isIncompleteMandatory ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`w-16 h-16 bg-zinc-950 border rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isIncompleteMandatory ? 'border-red-500/30' : 'border-zinc-800 group-hover:border-orange-600/50'
                }`}>
                  <BookOpen className={`transition-colors ${isIncompleteMandatory ? 'text-red-500' : 'text-zinc-500 group-hover:text-orange-500'}`} size={24} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${mod.Mandatory ? 'text-red-500 bg-red-500/10' : 'text-zinc-500 bg-zinc-500/10'}`}>
                        {mod.Mandatory ? (isIncompleteMandatory ? 'Required - Incomplete' : 'Mandatory') : 'Optional'}
                      </span>
                      {mod.CompletionStatus === 'Completed' && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-green-500/10 text-green-500 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      )}
                    </div>
                    {mod.LastScore !== null && (
                      <div className="text-xs font-bold text-white bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        Score: <span className={mod.LastScore >= 70 ? 'text-green-500' : 'text-red-500'}>{mod.LastScore}%</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{mod.ModuleName}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">{mod.Description}</p>
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                      ))}
                      <span className="pl-4 text-[10px] text-zinc-500 font-medium">+12 others completed</span>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                      mod.CompletionStatus === 'Completed' 
                        ? 'text-zinc-500 bg-zinc-900 border border-zinc-800' 
                        : 'text-white bg-orange-600 hover:bg-orange-700'
                    }`}>
                      {mod.CompletionStatus === 'Completed' ? 'Retake Module' : (
                        <>
                          <Play size={14} fill="currentColor" /> Start Module
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
