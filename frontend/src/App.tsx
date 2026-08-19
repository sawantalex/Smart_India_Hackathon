import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ScreenName } from './types';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';

import { LandingScreen } from './pages/LandingScreen';
import { AuthScreens } from './pages/AuthScreens';
import { LanguageSelectScreen } from './pages/LanguageSelectScreen';
import { PatientDashboardScreen } from './pages/PatientDashboardScreen';
import { TriageWizardScreen } from './pages/TriageWizardScreen';
import { FacilityAndReferralScreens } from './pages/FacilityAndReferralScreens';
import { WorkerDashboardScreens } from './pages/WorkerDashboardScreens';
import { AdminAndSystemScreens } from './pages/AdminAndSystemScreens';

import { HeartPulse, Stethoscope, BarChart3, Database, Globe, Mic, Shield } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('LANDING');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { role } = useAuth();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigateTo = (screen: ScreenName) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LANDING':
        return <LandingScreen onNavigate={navigateTo} />;

      case 'LOGIN':
        return <AuthScreens onNavigate={navigateTo} screenMode="LOGIN" />;
      case 'REGISTER':
        return <AuthScreens onNavigate={navigateTo} screenMode="REGISTER" />;
      case 'WORKER_LOGIN':
        return <AuthScreens onNavigate={navigateTo} screenMode="WORKER_LOGIN" />;
      case 'PROFILE':
        return <AuthScreens onNavigate={navigateTo} screenMode="PROFILE" />;

      case 'LANGUAGE_SELECT':
        return <LanguageSelectScreen onNavigate={navigateTo} />;

      case 'PATIENT_DASHBOARD':
        return <PatientDashboardScreen onNavigate={navigateTo} />;

      case 'VOICE_ASSISTANT':
        return <TriageWizardScreen onNavigate={navigateTo} activeScreen="VOICE_ASSISTANT" />;
      case 'SYMPTOM_QUESTIONNAIRE':
        return <TriageWizardScreen onNavigate={navigateTo} activeScreen="SYMPTOM_QUESTIONNAIRE" />;
      case 'ASSESSMENT_RESULT':
        return <TriageWizardScreen onNavigate={navigateTo} activeScreen="ASSESSMENT_RESULT" />;
      case 'EMERGENCY_WARNING':
        return <TriageWizardScreen onNavigate={navigateTo} activeScreen="EMERGENCY_WARNING" />;

      case 'NEARBY_FACILITIES':
        return <FacilityAndReferralScreens onNavigate={navigateTo} activeScreen="NEARBY_FACILITIES" />;
      case 'REFERRAL_REQUEST':
        return <FacilityAndReferralScreens onNavigate={navigateTo} activeScreen="REFERRAL_REQUEST" />;
      case 'PATIENT_HISTORY':
        return <FacilityAndReferralScreens onNavigate={navigateTo} activeScreen="PATIENT_HISTORY" />;
      case 'CONSENT_PRIVACY':
        return <FacilityAndReferralScreens onNavigate={navigateTo} activeScreen="CONSENT_PRIVACY" />;
      case 'NOTIFICATIONS':
        return <FacilityAndReferralScreens onNavigate={navigateTo} activeScreen="NOTIFICATIONS" />;

      case 'WORKER_DASHBOARD':
      case 'PATIENT_CASES':
        return <WorkerDashboardScreens onNavigate={navigateTo} activeScreen="WORKER_DASHBOARD" />;
      case 'PATIENT_DETAILS':
        return <WorkerDashboardScreens onNavigate={navigateTo} activeScreen="PATIENT_DETAILS" />;
      case 'REFERRAL_MANAGEMENT':
        return <WorkerDashboardScreens onNavigate={navigateTo} activeScreen="REFERRAL_MANAGEMENT" />;
      case 'FOLLOWUP_MANAGEMENT':
        return <WorkerDashboardScreens onNavigate={navigateTo} activeScreen="FOLLOWUP_MANAGEMENT" />;

      case 'ANALYTICS':
        return <AdminAndSystemScreens onNavigate={navigateTo} activeScreen="ANALYTICS" isOnline={isOnline} />;
      case 'ADMIN_SETTINGS':
        return <AdminAndSystemScreens onNavigate={navigateTo} activeScreen="ADMIN_SETTINGS" isOnline={isOnline} />;
      case 'OFFLINE_SYNC_STATUS':
        return <AdminAndSystemScreens onNavigate={navigateTo} activeScreen="OFFLINE_SYNC_STATUS" isOnline={isOnline} />;

      default:
        return <LandingScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header onNavigate={navigateTo} isOnline={isOnline} />
      <OfflineBanner isOnline={isOnline} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {renderScreen()}
      </main>

      {/* Global Quick Action Navigation Bar */}
      <nav className="bg-slate-900/90 border-t border-slate-800 backdrop-blur-md sticky bottom-0 z-40 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around text-[10px] sm:text-xs">
          <button
            onClick={() => navigateTo('PATIENT_DASHBOARD')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'PATIENT_DASHBOARD' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <HeartPulse className="w-5 h-5" />
            <span>Patient</span>
          </button>

          <button
            onClick={() => navigateTo('VOICE_ASSISTANT')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'VOICE_ASSISTANT' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Mic className="w-5 h-5" />
            <span>Voice Triage</span>
          </button>

          <button
            onClick={() => navigateTo('LANGUAGE_SELECT')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'LANGUAGE_SELECT' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Globe className="w-5 h-5" />
            <span>Language</span>
          </button>

          <button
            onClick={() => navigateTo(role === 'HEALTH_WORKER' ? 'WORKER_DASHBOARD' : 'WORKER_LOGIN')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'WORKER_DASHBOARD' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>ASHA Worker</span>
          </button>

          <button
            onClick={() => navigateTo('ANALYTICS')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'ANALYTICS' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => navigateTo('OFFLINE_SYNC_STATUS')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'OFFLINE_SYNC_STATUS' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Database className="w-5 h-5" />
            <span>Sync</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
