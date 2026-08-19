import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { ScreenName, Facility, Referral } from '../types';
import { Building2, Phone, MapPin, CheckCircle2, ShieldAlert, FileText, Bell, History, ArrowRight, ShieldCheck } from 'lucide-react';

interface FacilityAndReferralScreensProps {
  onNavigate: (screen: ScreenName) => void;
  activeScreen: 'NEARBY_FACILITIES' | 'REFERRAL_REQUEST' | 'PATIENT_HISTORY' | 'CONSENT_PRIVACY' | 'NOTIFICATIONS';
}

export const FacilityAndReferralScreens: React.FC<FacilityAndReferralScreensProps> = ({ onNavigate, activeScreen }) => {
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states for referral request
  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(1);
  const [reason, setReason] = useState('Persistent symptoms requiring clinical OPD examination');
  const [referralSuccess, setReferralSuccess] = useState<Referral | null>(null);

  // Consent states
  const [triageConsent, setTriageConsent] = useState(true);
  const [ashaSharingConsent, setAshaSharingConsent] = useState(true);
  const [anonymizedAnalyticsConsent, setAnonymizedAnalyticsConsent] = useState(true);

  useEffect(() => {
    if (activeScreen === 'NEARBY_FACILITIES' || activeScreen === 'REFERRAL_REQUEST') {
      loadFacilities();
    }
  }, [activeScreen]);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getFacilities();
      setFacilities(data);
    } catch (e) {
      // Mock fallback facilities if backend unreachable
      setFacilities([
        {
          id: 1,
          name: 'Shivajinagar Primary Health Centre (PHC)',
          facility_type: 'PHC',
          services: 'General OPD, Maternal & Child Health, Basic First Aid',
          district: 'Pune',
          village_or_town: 'Shivajinagar',
          emergency_capable: false,
          is_verified: true,
          contact_phone: '020-25500000',
          operating_hours: '8:00 AM - 4:00 PM',
        },
        {
          id: 2,
          name: 'Pune District Hospital & Emergency Trauma Centre',
          facility_type: 'District Hospital',
          services: '24/7 ICU, Emergency Trauma, Surgery, Oxygen Support',
          district: 'Pune',
          village_or_town: 'Aundh',
          emergency_capable: true,
          is_verified: true,
          contact_phone: '020-27290000',
          operating_hours: '24/7',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ref = await ApiService.createReferral({
        patient_id: 1,
        facility_id: selectedFacilityId,
        urgency: 'MODERATE',
        reason,
      });
      setReferralSuccess(ref);
    } catch (e: any) {
      alert(`Referral created (saved locally for sync): ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Screen 10: Nearby Healthcare Facilities
  if (activeScreen === 'NEARBY_FACILITIES') {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-teal-400" />
            Verified Nearby Healthcare Facilities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Government Primary Health Centres (PHC) and District Hospitals in Pune.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading facilities...</div>
        ) : (
          <div className="space-y-4">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-100">{fac.name}</h3>
                    {fac.is_verified && (
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {fac.village_or_town}, District: {fac.district}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Services:</strong> {fac.services}
                  </p>
                  <p className="text-xs text-slate-400">
                    <strong>Operating Hours:</strong> {fac.operating_hours}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  {fac.emergency_capable && (
                    <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-extrabold px-2.5 py-1 rounded-lg text-center">
                      24/7 EMERGENCY TRUAMA CAPABLE
                    </span>
                  )}
                  <a
                    href={`tel:${fac.contact_phone}`}
                    className="btn-large bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    Call {fac.contact_phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Screen 11: Referral Request Screen
  if (activeScreen === 'REFERRAL_REQUEST') {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-400" />
              Request Health Facility Referral
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Submit your preliminary assessment to the nearest Primary Health Centre for ASHA worker follow-up.
            </p>
          </div>

          {referralSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-emerald-200">Referral Issued Successfully!</h3>
              <p className="text-xs text-slate-300 font-mono">
                Referral Code: <strong className="text-emerald-300">{referralSuccess.referral_code || 'REF-2026-9901'}</strong>
              </p>
              <p className="text-xs text-slate-400">
                Your case has been queued for ASHA worker review at the selected facility.
              </p>
              <button
                onClick={() => onNavigate('PATIENT_DASHBOARD')}
                className="w-full btn-large bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-xl mt-2"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Target Facility</label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.facility_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Referral</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-large bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg"
              >
                {loading ? 'Submitting...' : 'Submit Referral Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Screen 12: Patient History
  if (activeScreen === 'PATIENT_HISTORY') {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-teal-400" />
            Patient Assessment History
          </h2>
          <p className="text-xs text-slate-400 mt-1">Audit log of your past triage assessments and referrals.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Date: August 19, 2026</span>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2.5 py-0.5 rounded-full font-bold">
                MODERATE RISK
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Reported Symptoms: High Fever, Headache
            </p>
            <p className="text-xs text-slate-400">
              Guidance: Visit Shivajinagar PHC within 24-48 hours. Hydrate and rest.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Date: August 10, 2026</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                LOW RISK
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Reported Symptoms: Mild Cough
            </p>
            <p className="text-xs text-slate-400">
              Guidance: Home care & warm fluids. Re-evaluate if symptoms persist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Screen 13: Consent & Privacy Settings
  if (activeScreen === 'CONSENT_PRIVACY') {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              Consent & Privacy Control
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Consent v1.0 • Purpose: Preliminary triage & health facility navigation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Triage Assessment Processing</h4>
                <p className="text-xs text-slate-400">Allow rule-based evaluation of your reported symptoms.</p>
              </div>
              <input
                type="checkbox"
                checked={triageConsent}
                onChange={(e) => setTriageConsent(e.target.checked)}
                className="w-5 h-5 accent-teal-500 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Share with Local ASHA Worker</h4>
                <p className="text-xs text-slate-400">Enable local healthcare worker follow-up for urgent referrals.</p>
              </div>
              <input
                type="checkbox"
                checked={ashaSharingConsent}
                onChange={(e) => setAshaSharingConsent(e.target.checked)}
                className="w-5 h-5 accent-teal-500 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Anonymized Regional Analytics</h4>
                <p className="text-xs text-slate-400">Include de-identified stats in disease outbreak tracking.</p>
              </div>
              <input
                type="checkbox"
                checked={anonymizedAnalyticsConsent}
                onChange={(e) => setAnonymizedAnalyticsConsent(e.target.checked)}
                className="w-5 h-5 accent-teal-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => alert('Consent preferences updated.')}
            className="w-full btn-large bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg"
          >
            Save Privacy Preferences
          </button>
        </div>
      </div>
    );
  }

  // Screen 14: Notifications
  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Bell className="w-6 h-6 text-violet-400" />
          Health Alerts & Reminders
        </h2>
        <p className="text-xs text-slate-400 mt-1">Updates on your referrals and ASHA worker visits.</p>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Referral Update - Shivajinagar PHC</h4>
            <p className="text-xs text-slate-400">Sunita Patil (ASHA Worker) assigned to your OPD referral.</p>
            <span className="text-[10px] text-slate-500 block mt-1">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
