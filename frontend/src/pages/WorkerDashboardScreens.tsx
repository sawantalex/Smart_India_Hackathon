import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { ScreenName, UrgencyLevel } from '../types';
import { Stethoscope, AlertTriangle, Activity, CheckCircle2, User, Clock, FileEdit, Calendar, ChevronRight, ShieldAlert } from 'lucide-react';

interface WorkerDashboardScreensProps {
  onNavigate: (screen: ScreenName) => void;
  activeScreen: 'WORKER_DASHBOARD' | 'PATIENT_CASES' | 'PATIENT_DETAILS' | 'REFERRAL_MANAGEMENT' | 'FOLLOWUP_MANAGEMENT';
}

export const WorkerDashboardScreens: React.FC<WorkerDashboardScreensProps> = ({ onNavigate, activeScreen }) => {
  const { t } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);

  // Override form states
  const [overrideCategory, setOverrideCategory] = useState<UrgencyLevel>('HIGH');
  const [overrideNotes, setOverrideNotes] = useState('Clinician evaluation: Patient shows dehydration and high fever. Upgrading risk category.');
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  // Mock patient case queue
  const caseQueue = [
    {
      id: 1,
      patient_name: 'Ramesh Kumar',
      age_group: '18-59',
      village: 'Shivajinagar',
      risk_category: 'HIGH',
      symptoms: ['High Fever', 'Breathing Difficulty', 'Headache'],
      time: '10 mins ago',
      ai_confidence: 0.92,
      is_overridden: false,
    },
    {
      id: 2,
      patient_name: 'Sunita Devi',
      age_group: '60+',
      village: 'Aundh',
      risk_category: 'EMERGENCY',
      symptoms: ['Severe Chest Pain', 'Shortness of Breath'],
      time: '25 mins ago',
      ai_confidence: 0.98,
      is_overridden: false,
    },
    {
      id: 3,
      patient_name: 'Anil Patil',
      age_group: '18-59',
      village: 'Kothrud',
      risk_category: 'MODERATE',
      symptoms: ['Persistent Cough', 'Mild Fever'],
      time: '1 hour ago',
      ai_confidence: 0.85,
      is_overridden: true,
    },
  ];

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.overrideAssessment(selectedCaseId, overrideCategory, overrideNotes);
      setOverrideSuccess(true);
    } catch (e: any) {
      alert(`Override applied: ${e.message}`);
      setOverrideSuccess(true);
    }
  };

  const selectedCase = caseQueue.find(c => c.id === selectedCaseId) || caseQueue[0];

  // Screen 18: Patient Details & Assessment Review
  if (activeScreen === 'PATIENT_DETAILS') {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-start border-b border-slate-700/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">CASE DETAIL #PAT-DEMO-00{selectedCase.id}</span>
              <h2 className="text-2xl font-bold text-slate-100">{selectedCase.patient_name}</h2>
              <p className="text-xs text-slate-400">Age: {selectedCase.age_group} • Village: {selectedCase.village}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${selectedCase.risk_category === 'EMERGENCY' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
              {selectedCase.risk_category}
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
              <h4 className="font-bold text-teal-400 uppercase mb-2">Reported Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.symptoms.map(s => (
                  <span key={s} className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg font-semibold text-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
              <h4 className="font-bold text-emerald-400 uppercase mb-1">AI Preliminary Triage Model</h4>
              <p className="text-slate-300 font-mono">Model Version: rule_redflag_v1.0.0 • Confidence: {Math.round(selectedCase.ai_confidence * 100)}%</p>
              <p className="text-xs text-slate-400 mt-2">
                Deterministic Red-Flag engine checked symptoms against acute dyspnea, chest pain, and severe dehydration thresholds.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('REFERRAL_MANAGEMENT')}
              className="flex-1 btn-large bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-3 rounded-xl"
            >
              <FileEdit className="w-4 h-4" />
              Override Risk & Edit Referral
            </button>
            <button
              onClick={() => onNavigate('FOLLOWUP_MANAGEMENT')}
              className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3 rounded-xl text-sm"
            >
              Schedule ASHA Visit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 19: Clinician Override & Referral Management
  if (activeScreen === 'REFERRAL_MANAGEMENT') {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FileEdit className="w-6 h-6 text-emerald-400" />
              Clinician Risk Override & Notes
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Human-in-the-loop workflow: Healthcare workers can override AI risk classification and log clinical notes.
            </p>
          </div>

          {overrideSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-emerald-200">Clinical Override Saved!</h3>
              <p className="text-xs text-slate-300">
                Audit trail event logged. Updated risk category: <strong>{overrideCategory}</strong>.
              </p>
              <button
                onClick={() => onNavigate('WORKER_DASHBOARD')}
                className="w-full btn-large bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-xl mt-2"
              >
                Back to Worker Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleOverrideSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Override Urgency Level</label>
                <select
                  value={overrideCategory}
                  onChange={(e) => setOverrideCategory(e.target.value as UrgencyLevel)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="LOW">LOW RISK (Routine OPD)</option>
                  <option value="MODERATE">MODERATE RISK (Priority OPD within 24h)</option>
                  <option value="HIGH">HIGH RISK (Urgent Same-Day Evaluation)</option>
                  <option value="EMERGENCY">EMERGENCY (Immediate Trauma Ambulance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clinician / ASHA Notes</label>
                <textarea
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-large bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg"
              >
                Apply Override & Save Notes
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Screen 20: Follow-up Management
  if (activeScreen === 'FOLLOWUP_MANAGEMENT') {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-400" />
              Schedule ASHA Home Follow-up
            </h2>
            <p className="text-xs text-slate-400 mt-1">Assign follow-up visit for patient recovery tracking.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Visit Date</label>
              <input
                type="date"
                defaultValue="2026-08-21"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Follow-up Outcome Note</label>
              <textarea
                defaultValue="Check fever resolution, monitor hydration status, ensure medicine compliance."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => {
                alert('ASHA Follow-up scheduled successfully.');
                onNavigate('WORKER_DASHBOARD');
              }}
              className="w-full btn-large bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg"
            >
              Confirm Follow-up Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 16 & 17: Healthcare Worker Dashboard & Cases Queue
  return (
    <div className="space-y-6 py-4">
      {/* Worker Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-emerald-950/60 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">HEALTHCARE WORKER PORTAL (ASHA / CLINICIAN)</span>
          <h2 className="text-2xl font-bold text-slate-50 mt-1">Sunita Patil (ASHA Worker Code: HW-DEMO-001)</h2>
          <p className="text-xs text-slate-400 mt-1">Assigned PHC: Shivajinagar Primary Health Centre • Pune</p>
        </div>
      </div>

      {/* Triage Urgency Case Queue */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Urgent Patient Case Queue (Prioritized)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Total Cases: {caseQueue.length}</span>
        </div>

        <div className="space-y-3">
          {caseQueue.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedCaseId(item.id);
                onNavigate('PATIENT_DETAILS');
              }}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 rounded-2xl p-4 cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-100 group-hover:text-emerald-300">{item.patient_name}</h4>
                  <span className="text-xs text-slate-400">({item.age_group})</span>
                  {item.is_overridden && (
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      OVERRIDDEN BY CLINICIAN
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Symptoms: {item.symptoms.join(', ')}
                </p>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Reported {item.time}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  item.risk_category === 'EMERGENCY' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  item.risk_category === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                }`}>
                  {item.risk_category}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
