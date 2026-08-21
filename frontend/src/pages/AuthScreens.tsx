import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ScreenName } from '../types';
import { User, Lock, ShieldCheck, Stethoscope } from 'lucide-react';

interface AuthScreensProps {
  onNavigate: (screen: ScreenName) => void;
  screenMode: 'LOGIN' | 'REGISTER' | 'WORKER_LOGIN' | 'ADMIN_LOGIN' | 'PROFILE';
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onNavigate, screenMode }) => {
  const { login, setDemoUser, user, role, logout } = useAuth();
  const { language } = useLanguage();

  const [username, setUsername] = useState(
    screenMode === 'ADMIN_LOGIN' ? 'admin' : screenMode === 'WORKER_LOGIN' ? 'worker_demo' : 'patient_demo'
  );
  const [password, setPassword] = useState(screenMode === 'ADMIN_LOGIN' ? 'admin' : 'password123');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (screenMode === 'LOGIN' || screenMode === 'WORKER_LOGIN' || screenMode === 'ADMIN_LOGIN') {
        await login(username, password);
        if (screenMode === 'ADMIN_LOGIN' || username === 'admin' || username === 'admin_demo') {
          onNavigate('ANALYTICS');
        } else if (screenMode === 'WORKER_LOGIN') {
          onNavigate('WORKER_DASHBOARD');
        } else {
          onNavigate('PATIENT_DASHBOARD');
        }
      } else if (screenMode === 'REGISTER') {
        setDemoUser('PATIENT');
        onNavigate('PATIENT_DASHBOARD');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  if (screenMode === 'PROFILE') {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 text-2xl font-extrabold shadow-lg">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{user?.username || 'User'}</h3>
              <p className="text-xs text-teal-400 font-semibold uppercase">{role} Profile</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-700/80 pt-4 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Preferred Language</span>
              <span className="font-semibold text-slate-200 uppercase">{language}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Assigned District</span>
              <span className="font-semibold text-slate-200">Pune</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Offline Local Queue</span>
              <span className="font-semibold text-emerald-400">Active (Synced)</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => logout()}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold py-2.5 rounded-xl text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isWorker = screenMode === 'WORKER_LOGIN';
  const isAdmin = screenMode === 'ADMIN_LOGIN';

  return (
    <div className="max-w-md mx-auto py-6">
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg ${
            isAdmin ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
            isWorker ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            'bg-teal-500/10 text-teal-400 border border-teal-500/30'
          }`}>
            {isAdmin ? <ShieldCheck className="w-8 h-8 text-indigo-400" /> :
             isWorker ? <Stethoscope className="w-8 h-8" /> :
             <User className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-bold text-slate-50">
            {isAdmin ? 'Executive Admin Portal Login' :
             isWorker ? 'Healthcare Worker Login' :
             screenMode === 'LOGIN' ? 'Patient Portal Login' : 'Citizen Registration'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin ? 'Enter administrator credentials (admin / admin)' :
             isWorker ? 'ASHA Worker & PHC Clinician Access' :
             'Multilingual voice triage & appointment support'}
          </p>
        </div>

        {/* Credentials Fill Assistance */}
        <div className="mb-6 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-300 mb-2">
            <span>QUICK DEMO CREDENTIALS:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setUsername('patient_demo');
                setPassword('password123');
              }}
              className="bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-300 py-1.5 rounded-lg text-[10px] font-semibold"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername('worker_demo');
                setPassword('password123');
              }}
              className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 py-1.5 rounded-lg text-[10px] font-semibold"
            >
              ASHA Worker
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin');
              }}
              className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 py-1.5 rounded-lg text-[10px] font-semibold"
            >
              Admin (admin/admin)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {screenMode === 'REGISTER' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Admin ID</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-large text-slate-950 font-extrabold py-3 rounded-xl shadow-lg mt-2 ${
              isAdmin ? 'bg-gradient-to-r from-indigo-400 to-teal-400' :
              isWorker ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
              'bg-gradient-to-r from-teal-400 to-emerald-400'
            }`}
          >
            {loading ? 'Authenticating...' : isAdmin ? 'Sign In to Admin Portal' : isWorker ? 'Sign In as Health Worker' : screenMode === 'LOGIN' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          {isAdmin ? (
            <>
              <button onClick={() => onNavigate('LOGIN')} className="text-teal-400 hover:underline">Patient login</button>
              <button onClick={() => onNavigate('WORKER_LOGIN')} className="text-emerald-400 hover:underline">Health worker login</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('LOGIN')} className="text-teal-400 hover:underline">Patient Login</button>
              <button onClick={() => onNavigate('ADMIN_LOGIN')} className="text-indigo-400 hover:underline">Admin Portal Login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
