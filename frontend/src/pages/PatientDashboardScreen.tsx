import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ScreenName } from '../types';
import { Mic, HeartPulse, Building2, FileText, Shield, Bell, History, PhoneCall, ChevronRight } from 'lucide-react';

interface PatientDashboardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const PatientDashboardScreen: React.FC<PatientDashboardScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="space-y-6 py-4">
      {/* Patient Header Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-teal-950/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">CITIZEN HEALTH PORTAL</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mt-1">
            Welcome, {user?.username || 'Ramesh Kumar'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Active Language: <strong className="text-slate-200 uppercase">{language}</strong> • District: <strong className="text-slate-200">Pune</strong>
          </p>
        </div>

        <button
          onClick={() => onNavigate('VOICE_ASSISTANT')}
          className="btn-large bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold shadow-lg shadow-teal-400/20 shrink-0"
        >
          <Mic className="w-5 h-5" />
          <span>New Voice Triage Assessment</span>
        </button>
      </div>

      {/* Main Grid Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Action 1: Voice Symptom Triage */}
        <div
          onClick={() => onNavigate('VOICE_ASSISTANT')}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300">Voice Symptom Evaluation</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Speak your symptoms naturally in your language for immediate safety assessment.</p>
          <div className="text-xs font-bold text-teal-400 flex items-center gap-1">Start Recording <ChevronRight className="w-3.5 h-3.5" /></div>
        </div>

        {/* Action 2: Structured Questionnaire */}
        <div
          onClick={() => onNavigate('SYMPTOM_QUESTIONNAIRE')}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300">Text Symptom Questionnaire</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Select symptoms, duration, and severity using structured checkboxes.</p>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">Fill Questionnaire <ChevronRight className="w-3.5 h-3.5" /></div>
        </div>

        {/* Action 3: Nearby Healthcare Facilities */}
        <div
          onClick={() => onNavigate('NEARBY_FACILITIES')}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-300">Verified Healthcare Facilities</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Find nearest Primary Health Centres (PHC) & District Trauma Hospitals.</p>
          <div className="text-xs font-bold text-blue-400 flex items-center gap-1">View Facilities <ChevronRight className="w-3.5 h-3.5" /></div>
        </div>

        {/* Action 4: Assessment History */}
        <div
          onClick={() => onNavigate('PATIENT_HISTORY')}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300">Assessment History & Referrals</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Review past symptom evaluations, risk categories, and doctor notes.</p>
          <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">View History <ChevronRight className="w-3.5 h-3.5" /></div>
        </div>

        {/* Action 5: Consent & Privacy */}
        <div
          onClick={() => onNavigate('CONSENT_PRIVACY')}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300">Consent & Privacy Settings</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Manage data sharing consent, purpose specification, and withdrawal.</p>
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1">Manage Privacy <ChevronRight className="w-3.5 h-3.5" /></div>
        </div>

        {/* Action 6: Notifications */}
        <div
          onClick={() => onNavigate('NOTIFICATIONS')}
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-violet-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-violet-300">Health Alerts & Reminders</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Check referral updates, ASHA worker follow-up schedules, and alerts.</p>
          <div className="text-xs font-bold text-violet-400 flex items-center gap-1">Check Notifications <ChevronRight className="w-3.5 h-3.5" /></div>
        </div>
      </div>
    </div>
  );
};
