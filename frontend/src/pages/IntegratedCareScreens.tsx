import React, { useState } from 'react';
import { ScreenName, Encounter, Appointment, QueueToken, ConsultationSession, DiagnosticOrder, MedicineSearchItem, HighRiskFollowUp } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  Clock,
  FileText,
  Search,
  Video,
  Pill,
  HeartPulse,
  BarChart3,
  AlertTriangle,
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface IntegratedCareProps {
  onNavigate: (screen: ScreenName) => void;
  activeScreen: ScreenName;
}

export const IntegratedCareScreens: React.FC<IntegratedCareProps> = ({ onNavigate, activeScreen }) => {
  const { t } = useLanguage();
  const [medicineQuery, setMedicineQuery] = useState('');
  const [medicineDistrict, setMedicineDistrict] = useState('Pune');
  const [medicineResults] = useState<MedicineSearchItem[]>([
    {
      id: 1,
      name: "Paracetamol 500mg",
      generic_name: "Acetaminophen",
      category: "Analgesic / Antipyretic",
      dosage_form: "Tablet",
      facility_id: 1,
      facility_name: "Khed Primary Health Centre",
      facility_district: "Pune",
      status: "AVAILABLE",
      last_updated: "2026-08-21T10:00:00Z"
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      generic_name: "Amoxicillin",
      category: "Antibiotic",
      dosage_form: "Capsule",
      facility_id: 2,
      facility_name: "Manchar Sub-District Hospital",
      facility_district: "Pune",
      status: "LIMITED",
      last_updated: "2026-08-21T09:30:00Z"
    },
    {
      id: 3,
      name: "ORS Sachet",
      generic_name: "Oral Rehydration Salts",
      category: "Rehydration Solution",
      dosage_form: "Powder",
      facility_id: 1,
      facility_name: "Khed Primary Health Centre",
      facility_district: "Pune",
      status: "AVAILABLE",
      last_updated: "2026-08-21T11:15:00Z"
    }
  ]);

  const [encounters] = useState<Encounter[]>([
    {
      id: 101,
      encounter_code: "ENC-88A91B",
      patient_id: 1,
      facility_name: "Khed Primary Health Centre",
      encounter_type: "OPD_CONSULTATION",
      title: "Acute Fever & Respiratory Evaluation",
      summary: "Patient evaluated for 3-day fever and cough. Triage Category: High Risk.",
      clinical_notes: "Advised hydration, paracetamol, and chest X-ray screening.",
      urgency: "HIGH",
      created_at: "2026-08-20T14:30:00Z"
    },
    {
      id: 102,
      encounter_code: "ENC-77F20C",
      patient_id: 1,
      facility_name: "Manchar Sub-District Hospital",
      encounter_type: "TELECONSULTATION",
      title: "Teleconsultation Specialist Review",
      summary: "Assisted teleconsultation completed with Dr. S. Patil (Pediatrician).",
      clinical_notes: "Non-critical viral syndrome. Prescribed supportive care.",
      urgency: "MODERATE",
      created_at: "2026-08-18T10:15:00Z"
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      appointment_code: "APT-99201A",
      patient_id: 1,
      facility_id: 1,
      facility_name: "Khed Primary Health Centre",
      department: "General OPD",
      appointment_date: "2026-08-23T09:30:00Z",
      reason: "Follow-up visit for respiratory evaluation",
      status: "CONFIRMED",
      created_at: "2026-08-21T08:00:00Z"
    }
  ]);

  const [queueToken] = useState<QueueToken>({
    id: 1,
    token_number: "T-004",
    facility_id: 1,
    facility_name: "Khed Primary Health Centre",
    department: "General OPD",
    priority: "NORMAL",
    status: "WAITING",
    position: 3,
    estimated_wait_minutes: 25,
    created_at: "2026-08-21T09:00:00Z"
  });

  const [teleSession] = useState<ConsultationSession>({
    id: 1,
    session_code: "TELE-3310FA",
    patient_id: 1,
    facility_id: 2,
    facility_name: "Manchar Sub-District Hospital",
    specialty: "Pediatrics",
    status: "IN_PROGRESS",
    reason: "Assisted consultation for pediatric persistent cough",
    clinical_summary: "[AI-generated draft summary]: Patient presents with 4-day cough, no chest indrawing, afebrile today. Recommended for pediatrician confirmation.",
    is_ai_generated_summary: "TRUE",
    created_at: "2026-08-21T10:30:00Z"
  });

  const [followups] = useState<HighRiskFollowUp[]>([
    {
      id: 1,
      followup_code: "FLP-101",
      patient_id: 1,
      category: "MATERNAL_HIGH_RISK",
      priority: "HIGH",
      scheduled_date: "2026-08-24T10:00:00Z",
      reason: "ANC 3rd Trimester BP & hemoglobin check",
      status: "PENDING",
      contact_method: "HOME_VISIT",
      created_at: "2026-08-19T08:00:00Z"
    },
    {
      id: 2,
      followup_code: "FLP-102",
      patient_id: 2,
      category: "CHILD_IMMUNIZATION",
      priority: "HIGH",
      scheduled_date: "2026-08-25T11:00:00Z",
      reason: "14-week Pentavalent-3 & OPV-3 booster",
      status: "PENDING",
      contact_method: "HOME_VISIT",
      created_at: "2026-08-18T08:00:00Z"
    }
  ]);

  // Render view based on activeScreen
  if (activeScreen === 'PATIENT_TIMELINE') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
                <FileText className="w-3.5 h-3.5" /> {t('longitudinal_record')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t('care_journey_title')}</h2>
              <p className="text-slate-400 text-sm">{t('patient_code_label')}: <span className="font-mono text-teal-300">PAT-001</span> | ABDM Ready Record ID</p>
            </div>
            <button
              onClick={() => onNavigate('PATIENT_DASHBOARD')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition"
            >
              {t('back_to_dashboard')}
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {encounters.map((enc) => (
              <div key={enc.id} className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/40 space-y-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-slate-900" />
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {enc.encounter_code}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(enc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-white">{enc.title}</h3>
                  <p className="text-xs text-teal-400 font-medium mb-2">{enc.facility_name} • {enc.encounter_type}</p>
                  
                  <p className="text-sm text-slate-300 mb-3">{enc.summary}</p>
                  
                  {enc.clinical_notes && (
                    <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">{t('clinician_advice')}: </span>
                      {enc.clinical_notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeScreen === 'APPOINTMENT_BOOKING' || activeScreen === 'QUEUE_MANAGEMENT') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Scheduling Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('opd_scheduling_title')}</h3>
                <p className="text-xs text-slate-400">{t('opd_scheduling_sub')}</p>
              </div>
            </div>

            {appointments.map(apt => (
              <div key={apt.id} className="bg-slate-950 border border-teal-500/30 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                      {apt.appointment_code}
                    </span>
                    <h4 className="text-base font-semibold text-white mt-1">{apt.facility_name}</h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {t('confirmed_status')}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>{t('department_label')}: <span className="text-slate-200 font-medium">{t('general_opd')}</span></p>
                  <p>{t('scheduled_label')}: <span className="text-teal-400 font-medium">{new Date(apt.appointment_date).toLocaleString('en-IN')}</span></p>
                  <p>{t('reason_label')}: <span className="text-slate-300">{apt.reason}</span></p>
                </div>
              </div>
            ))}

            <button
              onClick={() => alert("Appointment slot booked.")}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-teal-900/30"
            >
              {t('book_new_slot')}
            </button>
          </div>

          {/* Live Queue Token Tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('live_queue_title')}</h3>
                <p className="text-xs text-slate-400">{t('live_queue_sub')}</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 text-center mb-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">{t('your_queue_token')}</span>
              <div className="text-4xl font-extrabold text-amber-400 my-2 font-mono">{queueToken.token_number}</div>
              <p className="text-sm font-medium text-slate-200">{queueToken.facility_name}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">{t('queue_position')}</span>
                  <span className="text-lg font-bold text-white">#{queueToken.position} {t('in_line_suffix')}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">{t('est_wait_time')}</span>
                  <span className="text-lg font-bold text-amber-300">~{queueToken.estimated_wait_minutes} {t('mins_suffix')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Token status refreshed.")}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> {t('refresh_queue_token')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeScreen === 'TELECONSULTATION') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                {teleSession.session_code}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{t('teleconsult_room_title')}</h2>
              <p className="text-xs text-slate-400">{teleSession.facility_name} • {t('specialty_label')}: {teleSession.specialty}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
            {t('active_video_session')}
          </span>
        </div>

        {/* AI Clinical Draft Box with Safety Disclaimer */}
        <div className="bg-slate-950 border border-violet-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{t('ai_summary_title')}</span>
          </div>
          <p className="text-sm text-slate-300 bg-slate-900/90 p-4 rounded-lg border border-slate-800 font-mono">
            {teleSession.clinical_summary}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t('safety_rule_label')}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => alert("Clinician verified and signed consultation summary.")}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition"
          >
            {t('confirm_save_notes')}
          </button>
        </div>
      </div>
    );
  }

  if (activeScreen === 'MEDICINE_SEARCH' || activeScreen === 'DIAGNOSTIC_TRACKER') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('medicine_search_title')}</h3>
              <p className="text-xs text-slate-400">{t('medicine_search_sub')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('search_medicine_placeholder')}
                value={medicineQuery}
                onChange={(e) => setMedicineQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <select
              value={medicineDistrict}
              onChange={(e) => setMedicineDistrict(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
            >
              <option value="Pune">Pune District</option>
              <option value="Nashik">Nashik District</option>
              <option value="Satara">Satara District</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {medicineResults.map(item => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-base font-semibold text-white">{item.name}</h4>
                    <span className="text-xs text-slate-400">{item.generic_name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {item.status === 'AVAILABLE' ? t('available_status') : t('limited_status')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2"><MapPin className="w-3 h-3 inline mr-1" />{item.facility_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeScreen === 'HIGH_RISK_WORKFLOWS') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('high_risk_title')}</h3>
            <p className="text-xs text-slate-400">{t('high_risk_sub')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {followups.map(item => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {item.followup_code}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{item.category.replace('_', ' ')}</span>
                </div>
                <h4 className="text-base font-semibold text-white">{item.reason}</h4>
                <p className="text-xs text-slate-400">Scheduled: {new Date(item.scheduled_date).toLocaleDateString('en-IN')} • Method: {item.contact_method}</p>
              </div>
              <button
                onClick={() => alert(`Marked follow-up ${item.followup_code} as COMPLETED.`)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs transition self-start sm:self-center"
              >
                {t('mark_completed')}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeScreen === 'QUALITY_DASHBOARD') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('quality_dashboard_title')}</h3>
            <p className="text-xs text-slate-400">{t('quality_dashboard_sub')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block mb-1">{t('avg_opd_wait')}</span>
            <span className="text-2xl font-bold text-white">18 {t('mins_suffix')}</span>
            <span className="text-[10px] text-emerald-400 block mt-1">↓ 12 {t('mins_suffix')} improvement</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block mb-1">{t('referral_completion_rate')}</span>
            <span className="text-2xl font-bold text-teal-400">78.5%</span>
            <span className="text-[10px] text-slate-400 block mt-1">22 of 28 transfers closed</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block mb-1">{t('maternal_followup_rate')}</span>
            <span className="text-2xl font-bold text-rose-400">92.0%</span>
            <span className="text-[10px] text-emerald-400 block mt-1">High compliance</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 block mb-1">{t('essential_medicine_stock')}</span>
            <span className="text-2xl font-bold text-amber-400">91.2%</span>
            <span className="text-[10px] text-amber-300 block mt-1">2 active stockout alerts</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default IntegratedCareScreens;
