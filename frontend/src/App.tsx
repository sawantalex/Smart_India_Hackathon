import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { IntegratedCareScreens } from './pages/IntegratedCareScreens';

import { HeartPulse, Stethoscope, BarChart3, Calendar, Pill, Video, ShieldCheck } from 'lucide-react';

const VALID_SCREENS: ScreenName[] = [
  'LANDING',
  'LOGIN',
  'REGISTER',
  'WORKER_LOGIN',
  'ADMIN_LOGIN',
  'PROFILE',
  'LANGUAGE_SELECT',
  'PATIENT_DASHBOARD',
  'VOICE_ASSISTANT',
  'SYMPTOM_QUESTIONNAIRE',
  'ASSESSMENT_RESULT',
  'EMERGENCY_WARNING',
  'NEARBY_FACILITIES',
  'REFERRAL_REQUEST',
  'PATIENT_HISTORY',
  'CONSENT_PRIVACY',
  'NOTIFICATIONS',
  'WORKER_DASHBOARD',
  'PATIENT_CASES',
  'PATIENT_DETAILS',
  'REFERRAL_MANAGEMENT',
  'FOLLOWUP_MANAGEMENT',
  'ANALYTICS',
  'ADMIN_SETTINGS',
  'OFFLINE_SYNC_STATUS',
  'PATIENT_TIMELINE',
  'APPOINTMENT_BOOKING',
  'QUEUE_MANAGEMENT',
  'TELECONSULTATION',
  'DIAGNOSTIC_TRACKER',
  'MEDICINE_SEARCH',
  'HIGH_RISK_WORKFLOWS',
  'QUALITY_DASHBOARD'
];

const getScreenFromHash = (): ScreenName => {
  const hash = window.location.hash.replace('#', '').trim();
  if (hash && VALID_SCREENS.includes(hash as ScreenName)) {
    return hash as ScreenName;
  }
  return 'LANDING';
};

const MainLayout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(getScreenFromHash());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { role } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const initialScreen = getScreenFromHash();
    if (!window.history.state || window.history.state.screen !== initialScreen) {
      window.history.replaceState({ screen: initialScreen }, '', `#${initialScreen}`);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen && VALID_SCREENS.includes(event.state.screen)) {
        setCurrentScreen(event.state.screen as ScreenName);
      } else {
        const screenFromHash = getScreenFromHash();
        setCurrentScreen(screenFromHash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (screen: ScreenName) => {
    const targetScreen = VALID_SCREENS.includes(screen) ? screen : 'LANDING';
    if (targetScreen !== currentScreen) {
      setCurrentScreen(targetScreen);
      window.history.pushState({ screen: targetScreen }, '', `#${targetScreen}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (role === 'ADMIN') {
      navigateTo('ANALYTICS');
    } else {
      navigateTo('ADMIN_LOGIN');
    }
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
      case 'ADMIN_LOGIN':
        return <AuthScreens onNavigate={navigateTo} screenMode="ADMIN_LOGIN" />;
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
      case 'ADMIN_SETTINGS':
        if (role !== 'ADMIN') {
          return <AuthScreens onNavigate={navigateTo} screenMode="ADMIN_LOGIN" />;
        }
        return <AdminAndSystemScreens onNavigate={navigateTo} activeScreen={currentScreen} isOnline={isOnline} />;

      case 'OFFLINE_SYNC_STATUS':
        return <AdminAndSystemScreens onNavigate={navigateTo} activeScreen="OFFLINE_SYNC_STATUS" isOnline={isOnline} />;

      case 'PATIENT_TIMELINE':
      case 'APPOINTMENT_BOOKING':
      case 'QUEUE_MANAGEMENT':
      case 'TELECONSULTATION':
      case 'DIAGNOSTIC_TRACKER':
      case 'MEDICINE_SEARCH':
      case 'HIGH_RISK_WORKFLOWS':
      case 'QUALITY_DASHBOARD':
        return <IntegratedCareScreens onNavigate={navigateTo} activeScreen={currentScreen} />;

      default:
        return <LandingScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Header onNavigate={navigateTo} isOnline={isOnline} />
      <OfflineBanner isOnline={isOnline} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {renderScreen()}
      </main>

      {/* Global Quick Action Navigation Bar */}
      <nav className="bg-slate-900/90 border-t border-slate-800 backdrop-blur-md sticky bottom-0 z-40 px-4 py-2 transition-colors duration-300">
        <div className="max-w-2xl mx-auto flex items-center justify-around text-[10px] sm:text-xs">
          <button
            onClick={() => navigateTo('PATIENT_DASHBOARD')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'PATIENT_DASHBOARD' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <HeartPulse className="w-5 h-5" />
            <span>{t('nav_patient')}</span>
          </button>

          <button
            onClick={() => navigateTo('PATIENT_TIMELINE')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'PATIENT_TIMELINE' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <HeartPulse className="w-5 h-5" />
            <span>{t('nav_timeline')}</span>
          </button>

          <button
            onClick={() => navigateTo('APPOINTMENT_BOOKING')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'APPOINTMENT_BOOKING' || currentScreen === 'QUEUE_MANAGEMENT' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Calendar className="w-5 h-5" />
            <span>{t('nav_slots')}</span>
          </button>

          <button
            onClick={() => navigateTo('TELECONSULTATION')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'TELECONSULTATION' ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Video className="w-5 h-5" />
            <span>{t('nav_teleconsult')}</span>
          </button>

          <button
            onClick={() => navigateTo('MEDICINE_SEARCH')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'MEDICINE_SEARCH' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Pill className="w-5 h-5" />
            <span>{t('nav_medicines')}</span>
          </button>

          <button
            onClick={() => navigateTo(role === 'HEALTH_WORKER' ? 'WORKER_DASHBOARD' : 'WORKER_LOGIN')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'WORKER_DASHBOARD' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>{t('nav_worker')}</span>
          </button>

          <button
            onClick={handleAdminClick}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'ANALYTICS' || currentScreen === 'ADMIN_SETTINGS' || currentScreen === 'ADMIN_LOGIN' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>{t('nav_admin')}</span>
          </button>

          <button
            onClick={() => navigateTo('QUALITY_DASHBOARD')}
            className={`flex flex-col items-center gap-1 font-semibold ${currentScreen === 'QUALITY_DASHBOARD' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>{t('nav_quality')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
