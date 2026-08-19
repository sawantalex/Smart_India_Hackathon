import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ScreenName, UserRole } from '../types';
import { User, Lock, Phone, MapPin, CheckCircle, ShieldCheck, Stethoscope, ChevronRight } from 'lucide-react';

interface AuthScreensProps {
  onNavigate: (screen: ScreenName) => void;
  screenMode: 'LOGIN' | 'REGISTER' | 'WORKER_LOGIN' | 'PROFILE';
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onNavigate, screenMode }) => {
  const { login, setDemoUser, user, role, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [ageGroup, setAgeGroup] = useState('18-59');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (screenMode === 'LOGIN' || screenMode === 'WORKER_LOGIN') {
        await login(username || (screenMode === 'WORKER_LOGIN' ? 'worker_demo' : 'patient_demo'), password || 'password123');
        if (screenMode === 'WORKER_LOGIN') onNavigate('WORKER_DASHBOARD');
        else onNavigate('PATIENT_DASHBOARD');
      } else if (screenMode === 'REGISTER') {
        setDemoUser('PATIENT');
        onNavigate('PATIENT_DASHBOARD');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try demo login.');
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
              <h3 className="text-xl font-bold text-slate-100">{user?.username || 'Ramesh Kumar'}</h3>
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

  return (
    <div className="max-w-md mx-auto py-6">
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg ${isWorker ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-teal-500/10 text-teal-400 border border-teal-500/30'}`}>
            {isWorker ? <Stethoscope className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-bold text-slate-50">
            {screenMode === 'LOGIN' ? 'Patient Portal Login' : screenMode === 'WORKER_LOGIN' ? 'Healthcare Worker Login' : 'Citizen Registration'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isWorker ? 'ASHA Worker & PHC Clinician Access' : 'Multilingual voice triage & appointment support'}
          </p>
        </div>

        {/* Demo Credentials Quick Switcher */}
        <div className="mb-6 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-300 mb-2">
            <span>QUICK DEMO ONE-CLICK ACCESS:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setDemoUser('PATIENT');
                onNavigate('PATIENT_DASHBOARD');
              }}
              className="bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-300 py-1.5 rounded-lg text-xs font-semibold"
            >
              Demo Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setDemoUser('HEALTH_WORKER');
                onNavigate('WORKER_DASHBOARD');
              }}
              className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 py-1.5 rounded-lg text-xs font-semibold"
            >
              Demo ASHA Worker
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Phone Number</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isWorker ? "worker_demo" : "patient_demo"}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-large text-slate-950 font-extrabold py-3 rounded-xl shadow-lg mt-2 ${isWorker ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-teal-400 to-emerald-400'}`}
          >
            {loading ? 'Processing...' : screenMode === 'LOGIN' ? 'Sign In' : screenMode === 'WORKER_LOGIN' ? 'Sign In as Health Worker' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 flex justify-between">
          {screenMode === 'LOGIN' ? (
            <>
              <button onClick={() => onNavigate('REGISTER')} className="text-teal-400 hover:underline">New patient? Register</button>
              <button onClick={() => onNavigate('WORKER_LOGIN')} className="text-emerald-400 hover:underline">Health worker login</button>
            </>
          ) : (
            <button onClick={() => onNavigate('LOGIN')} className="text-teal-400 hover:underline mx-auto">Back to Patient Login</button>
          )}
        </div>
      </div>
    </div>
  );
};
