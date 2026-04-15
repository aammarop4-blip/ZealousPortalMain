import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info, Trash2, MailOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Alert {
  AlertID: number;
  AlertType: 'Warning' | 'Appreciation' | 'Termination' | 'Salary' | 'Info';
  Message: string;
  IssuedDate: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'WARNING': return <AlertTriangle className="text-red-500" size={20} />;
      case 'APPRECIATION': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'TERMINATION': return <AlertTriangle className="text-red-600" size={20} />;
      case 'SALARY': return <Info className="text-blue-500" size={20} />;
      default: return <Bell className="text-zinc-500" size={20} />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications & Alerts</h1>
          <p className="text-zinc-500">Stay updated with your latest HR communications</p>
        </div>
        <button className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
          <MailOpen size={16} /> Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">No alerts found</div>
        ) : alerts.map((alert) => (
          <motion.div 
            key={alert.AlertID}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl border bg-zinc-900 border-zinc-800 shadow-lg shadow-black/20 transition-all flex gap-6 items-start group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              alert.AlertType.toUpperCase() === 'WARNING' ? 'bg-red-500/10' :
              alert.AlertType.toUpperCase() === 'APPRECIATION' ? 'bg-green-500/10' :
              'bg-zinc-800'
            }`}>
              {getIcon(alert.AlertType)}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {alert.AlertType} • {new Date(alert.IssuedDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white font-medium leading-relaxed">{alert.Message}</p>
            </div>

            <button className="p-2 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
