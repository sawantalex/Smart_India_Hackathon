import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language, ScreenName } from '../types';
import { HeartPulse, Globe, User as UserIcon, LogOut, PhoneCall, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  onNavigate: (screen: ScreenName) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, isOnline }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, logout } = useAuth();

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* App Branding */}
        <div 
          onClick={() => onNavigate('LANDING')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-50 tracking-tight leading-tight">
              {t('app_title')}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multilingual Rural Healthcare Triage & Safety System
            </p>
          </div>
        </div>

        {/* Control Bar: Language, Online Status, Auth & Emergency Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connectivity Status Pill */}
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1">
            <Globe className="w-4 h-4 text-teal-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="hi" className="bg-slate-900 text-slate-100">हिंदी (Hindi)</option>
              <option value="mr" className="bg-slate-900 text-slate-100">मराठी (Marathi)</option>
              <option value="en" className="bg-slate-900 text-slate-100">English</option>
            </select>
          </div>

          {/* Direct Emergency Call Button */}
          <button
            onClick={() => onNavigate('EMERGENCY_WARNING')}
            className="btn-large bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm py-1.5 px-3 rounded-lg flex items-center gap-1.5 font-bold shadow-lg shadow-red-600/30 emergency-pulse"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">108</span>
          </button>

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
              <button
                onClick={() => onNavigate('PROFILE')}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200"
              >
                <UserIcon className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden lg:inline">{user.username} ({role})</span>
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('LOGIN')}
              className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
