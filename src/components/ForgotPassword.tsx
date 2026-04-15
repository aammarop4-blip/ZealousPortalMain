import React from 'react';
import { Mail, ArrowLeft, Key, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <div className="w-16 h-16 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="text-orange-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {token ? 'Reset Password' : 'Forgot Password'}
          </h2>
          <p className="text-zinc-500">
            {token 
              ? 'Enter your new secure password below' 
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {message ? (
          <div className="space-y-6 text-center">
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3 justify-center">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">{message}</span>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={token ? handleResetPassword : handleRequestReset} className="space-y-6">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">{error}</div>}
            
            {token ? (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-600 transition-colors"
                    placeholder="name@zealous.com"
                  />
                </div>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : token ? 'Update Password' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
