import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const { login, loading } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(usernameOrEmail, password);
    if (res.success) {
      addToast('Welcome back!', 'Authenticated into EnterprisePro ERP', 'success');
      navigate('/dashboard');
    } else {
      addToast('Login Failed', res.error || 'Invalid credentials', 'error');
    }
  };

  const setDemoCredentials = (user, pass) => {
    setUsernameOrEmail(user);
    setPassword(pass);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-scale-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Enterprise Sign In</h2>
        <p className="text-xs text-slate-400 mt-1">Access the ENTERPRISEPRO management console</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username or Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. admin or employee@enterprisepro.com"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Logins */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
          ⚡ One-Click Demo Logins:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials('admin', 'admin123')}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 transition-colors"
          >
            Super Admin
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('hrmanager', 'admin123')}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 transition-colors"
          >
            HR Lead
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('financemanager', 'admin123')}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 transition-colors"
          >
            Finance CFO
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/register" className="text-xs text-blue-400 hover:underline">
          Need a new account? Register here
        </Link>
      </div>
    </div>
  );
}
