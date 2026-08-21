import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ScreenName } from '../types';
import { HeartPulse, Mic, UserCheck, PhoneCall, ShieldAlert, Sparkles, Stethoscope, ChevronRight } from 'lucide-react';

interface LandingScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { setDemoUser } = useAuth();

  const handleQuickDemo = (role: 'PATIENT' | 'HEALTH_WORKER' | 'ADMIN') => {
    setDemoUser(role);
    if (role === 'PATIENT') onNavigate('PATIENT_DASHBOARD');
    else if (role === 'HEALTH_WORKER') onNavigate('WORKER_DASHBOARD');
    else onNavigate('ADMIN_SETTINGS');
  };

  return (
    <div className="space-y-8 py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-teal-950/40 border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('badge_tag')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight leading-tight mb-4">
            {t('hero_title_1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">{t('hero_title_2')}</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('VOICE_ASSISTANT')}
              className="btn-large bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold shadow-xl shadow-teal-500/25 flex items-center gap-2"
            >
              <Mic className="w-6 h-6" />
              <span>{t('start_voice_triage')}</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('EMERGENCY_WARNING')}
              className="btn-large bg-red-600 hover:bg-red-500 text-white font-bold shadow-xl shadow-red-600/30 emergency-pulse flex items-center gap-2"
            >
              <PhoneCall className="w-6 h-6" />
              <span>{t('emergency_button')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Warning Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-amber-200">
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-300 text-sm mb-1">{t('disclaimer_title')}</h4>
          <p className="text-xs leading-relaxed">{t('disclaimer')}</p>
        </div>
      </div>

      {/* Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Citizen Voice Triage */}
        <div
          onClick={() => onNavigate('PATIENT_DASHBOARD')}
          className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-teal-500/10"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-teal-300">
            {t('citizen_card_title')}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {t('citizen_card_desc')}
          </p>
          <div className="text-xs font-bold text-teal-400 flex items-center gap-1">
            <span>{t('citizen_card_action')}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Healthcare Worker Dashboard */}
        <div
          onClick={() => handleQuickDemo('HEALTH_WORKER')}
          className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-300">
            {t('worker_card_title')}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {t('worker_card_desc')}
          </p>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>{t('worker_card_action')}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: System Analytics & Audit */}
        <div
          onClick={() => handleQuickDemo('ADMIN')}
          className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/10"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-300">
            {t('analytics_card_title')}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {t('analytics_card_desc')}
          </p>
          <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">
            <span>{t('analytics_card_action')}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
