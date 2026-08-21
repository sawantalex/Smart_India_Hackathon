import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { ScreenName } from '../types';
import {
  BarChart3,
  ShieldCheck,
  Database,
  RefreshCw,
  Wifi,
  WifiOff,
  Lock,
  Activity,
  Users,
  Search,
  FileText,
  Building2,
  Calendar,
  AlertTriangle,
  User,
  Eye,
  X,
  Download,
  Stethoscope,
  Clock
} from 'lucide-react';
import { getOfflineQueue } from '../offline/db';

interface AdminAndSystemScreensProps {
  onNavigate: (screen: ScreenName) => void;
  activeScreen: 'ANALYTICS' | 'ADMIN_SETTINGS' | 'OFFLINE_SYNC_STATUS';
  isOnline: boolean;
}

interface PatientRecord {
  id: string;
  abdm_id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  symptoms: string;
  risk_category: 'EMERGENCY' | 'HIGH' | 'MODERATE' | 'LOW';
  triage_date: string;
  assigned_worker: string;
  facility: string;
  clinical_notes: string;
}

export const AdminAndSystemScreens: React.FC<AdminAndSystemScreensProps> = ({ onNavigate, activeScreen, isOnline }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PATIENTS' | 'REFERRALS' | 'QUEUE' | 'AUDIT'>('OVERVIEW');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedPatientModal, setSelectedPatientModal] = useState<PatientRecord | null>(null);

  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Mock Patient Master Registry Dataset
  const [patients] = useState<PatientRecord[]>([
    {
      id: "PAT-001",
      abdm_id: "91-8842-1092-3341",
      name: "Ramesh Tukaram Patil",
      age: 45,
      gender: "Male",
      village: "Khed, Pune",
      symptoms: "High Fever (तेज़ बुखार), Severe Chest Pain (सीने में दर्द)",
      risk_category: "EMERGENCY",
      triage_date: "2026-08-21 14:30",
      assigned_worker: "Sunita ASHA (Khed)",
      facility: "Khed Primary Health Centre",
      clinical_notes: "Emergency 108 ambulance dispatched. Patient evaluated for acute chest pain & fever."
    },
    {
      id: "PAT-002",
      abdm_id: "91-4421-9012-7711",
      name: "Sunita Aniket Pawar",
      age: 32,
      gender: "Female",
      village: "Manchar, Pune",
      symptoms: "Persistent Cough, Difficulty Breathing (सांस लेने में तकलीफ)",
      risk_category: "HIGH",
      triage_date: "2026-08-21 11:15",
      assigned_worker: "Anjali Worker (Manchar)",
      facility: "Manchar Sub-District Hospital",
      clinical_notes: "Maternal ANC 3rd trimester track. Recommended urgent PHC OPD evaluation within 24h."
    },
    {
      id: "PAT-003",
      abdm_id: "91-7709-1234-8899",
      name: "Aniket Sambhaji Shinde",
      age: 58,
      gender: "Male",
      village: "Junnar, Pune",
      symptoms: "Severe Abdominal Pain (पेट में दर्द), Vomiting",
      risk_category: "HIGH",
      triage_date: "2026-08-21 09:40",
      assigned_worker: "Pooja ASHA (Junnar)",
      facility: "Rural Hospital Junnar",
      clinical_notes: "Clinician override applied by ASHA worker from MODERATE to HIGH based on dehydration."
    },
    {
      id: "PAT-004",
      abdm_id: "91-1122-3344-5566",
      name: "Meena Vikas Kadam",
      age: 27,
      gender: "Female",
      village: "Khed, Pune",
      symptoms: "Mild Headache & Body Pain",
      risk_category: "MODERATE",
      triage_date: "2026-08-20 16:20",
      assigned_worker: "Sunita ASHA (Khed)",
      facility: "Khed Primary Health Centre",
      clinical_notes: "Self-limiting viral prodrome. Recommended oral hydration and REST."
    },
    {
      id: "PAT-005",
      abdm_id: "91-9988-7766-5544",
      name: "Ganesh Maruti Thorat",
      age: 62,
      gender: "Male",
      village: "Ambegaon, Pune",
      symptoms: "Mild Sneezing & Runny Nose",
      risk_category: "LOW",
      triage_date: "2026-08-20 10:05",
      assigned_worker: "Varsha Worker (Ambegaon)",
      facility: "Ambegaon Sub-Centre",
      clinical_notes: "Non-urgent upper respiratory symptoms. Advice provided via voice assistant."
    }
  ]);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const items = await getOfflineQueue();
    setQueueItems(items);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await ApiService.syncQueue();
      await loadQueue();
      alert('Sync completed successfully.');
    } catch (e: any) {
      alert(`Sync issue: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          p.village.toLowerCase().includes(patientSearch.toLowerCase()) ||
                          p.abdm_id.includes(patientSearch);
    const matchesRisk = selectedRiskFilter === 'ALL' || p.risk_category === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Admin Panel Header Banner */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Executive Control Center
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
                ABDM Compliant • RBAC Level 4
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t('admin_panel_title')}</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">{t('admin_panel_sub')}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Exporting Patient Master Database (JSON/CSV)...")}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-teal-400" /> Export Records
            </button>
            <button
              onClick={() => onNavigate('QUALITY_DASHBOARD')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/40 transition"
            >
              <BarChart3 className="w-4 h-4" /> Quality Dashboard
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> {t('tab_executive')}
          </button>

          <button
            onClick={() => setActiveTab('PATIENTS')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'PATIENTS' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> {t('tab_patient_registry')} ({patients.length})
          </button>

          <button
            onClick={() => setActiveTab('REFERRALS')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'REFERRALS' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> {t('tab_referrals')}
          </button>

          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'QUEUE' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> {t('tab_queue_tokens')}
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'AUDIT' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" /> {t('tab_audit_logs')}
          </button>
        </div>
      </div>

      {/* Tab 1: Executive Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total Patients Registered</span>
                <Users className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">1,420</h3>
              <span className="text-[10px] text-teal-400 font-bold block mt-1">100% ABDM Linked</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-slate-400 mb-2">
                <span className="text-xs font-semibold">Active ASHA Workers</span>
                <Stethoscope className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">34</h3>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">Pune Rural Sub-districts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total Triage Consultations</span>
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">842</h3>
              <span className="text-[10px] text-indigo-300 font-bold block mt-1">Voice & Text Triage</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center text-slate-400 mb-2">
                <span className="text-xs font-semibold">108 Emergency Escalations</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-red-400">14</h3>
              <span className="text-[10px] text-red-300 font-bold block mt-1">Immediate Ambulance Sent</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Regional Triage Risk Distribution</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-slate-300">LOW RISK (Routine OPD Care)</span>
                  <span className="text-emerald-400">426 (50.6%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[50.6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-slate-300">MODERATE RISK (Priority PHC Visit)</span>
                  <span className="text-teal-400">274 (32.5%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[32.5%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-slate-300">HIGH RISK (Urgent Same-Day Evaluation)</span>
                  <span className="text-amber-400">128 (15.2%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[15.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-slate-300">EMERGENCY (Trauma 108 Dispatch)</span>
                  <span className="text-red-400">14 (1.7%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[1.7%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Patient Master Registry & Case Files */}
      {activeTab === 'PATIENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Patient Master Registry</h3>
              <p className="text-xs text-slate-400">Complete clinical logs and triage assessments across Pune rural district</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={t('search_patient_placeholder')}
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={selectedRiskFilter}
                onChange={(e) => setSelectedRiskFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="EMERGENCY">EMERGENCY</option>
                <option value="HIGH">HIGH RISK</option>
                <option value="MODERATE">MODERATE</option>
                <option value="LOW">LOW RISK</option>
              </select>
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Patient & ABDM ID</th>
                  <th className="py-3 px-3">Age / Gender</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Latest Symptoms</th>
                  <th className="py-3 px-3">Risk Level</th>
                  <th className="py-3 px-3">Assigned Worker</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{p.id} • ABDM: {p.abdm_id}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{p.age} yrs / {p.gender}</td>
                    <td className="py-3 px-3 text-slate-300">{p.village}</td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{p.symptoms}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        p.risk_category === 'EMERGENCY' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                        p.risk_category === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        p.risk_category === 'MODERATE' ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {p.risk_category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{p.assigned_worker}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedPatientModal(p)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: ASHA Referrals Tracker */}
      {activeTab === 'REFERRALS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xl font-bold text-white">ASHA Worker Referrals & Overrides</h3>
          <p className="text-xs text-slate-400">Track cases referred by community health workers with clinician overrides</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-3">Referral ID</th>
                  <th className="py-3 px-3">Patient Code</th>
                  <th className="py-3 px-3">Target Facility</th>
                  <th className="py-3 px-3">Original AI Urgency</th>
                  <th className="py-3 px-3">Worker Override</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                <tr>
                  <td className="py-3 px-3 text-indigo-400 font-bold">REF-10928A</td>
                  <td className="py-3 px-3">PAT-001</td>
                  <td className="py-3 px-3 text-slate-200 font-sans">Khed Primary Health Centre</td>
                  <td className="py-3 px-3 text-amber-400">HIGH</td>
                  <td className="py-3 px-3 text-red-400 font-bold">EMERGENCY (Chest Pain)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans font-bold">COMPLETED</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-indigo-400 font-bold">REF-10929B</td>
                  <td className="py-3 px-3">PAT-003</td>
                  <td className="py-3 px-3 text-slate-200 font-sans">Rural Hospital Junnar</td>
                  <td className="py-3 px-3 text-teal-400">MODERATE</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">HIGH (Severe Vomiting)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-sans font-bold">IN_PROGRESS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: OPD Queue & Token Logs */}
      {activeTab === 'QUEUE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xl font-bold text-white">Live OPD Queue Tokens Monitor</h3>
          <p className="text-xs text-slate-400">Active facility tokens, queue positions, and estimated wait times</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-3">Token No.</th>
                  <th className="py-3 px-3">Facility</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3">Est. Wait Time</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                <tr>
                  <td className="py-3 px-3 text-amber-400 font-bold text-base">T-004</td>
                  <td className="py-3 px-3 text-slate-200 font-sans">Khed Primary Health Centre</td>
                  <td className="py-3 px-3 font-sans">General OPD</td>
                  <td className="py-3 px-3 text-white font-bold">#3 in line</td>
                  <td className="py-3 px-3 text-amber-300">~25 mins</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-sans font-bold">WAITING</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-amber-400 font-bold text-base">T-005</td>
                  <td className="py-3 px-3 text-slate-200 font-sans">Manchar Sub-District Hospital</td>
                  <td className="py-3 px-3 font-sans">Maternal OPD</td>
                  <td className="py-3 px-3 text-white font-bold">#1 in line</td>
                  <td className="py-3 px-3 text-emerald-400">~10 mins</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-bold">CALLING</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: System Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xl font-bold text-white">System Security Audit Trail</h3>
          <p className="text-xs text-slate-400">Tamper-resistant audit log tracking triage evaluations, worker overrides, and access events</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Resource Target</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                <tr>
                  <td className="py-2.5 px-3 text-slate-400">2026-08-21 14:30:12</td>
                  <td className="py-2.5 px-3 text-indigo-400">patient_demo</td>
                  <td className="py-2.5 px-3 text-red-300">TRIAGE_EVALUATION</td>
                  <td className="py-2.5 px-3">Assessment #101</td>
                  <td className="py-2.5 px-3 text-slate-400">Emergency rule triggered (Chest pain)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-400">2026-08-21 11:15:05</td>
                  <td className="py-2.5 px-3 text-emerald-400">worker_demo</td>
                  <td className="py-2.5 px-3 text-amber-300">TRIAGE_OVERRIDE</td>
                  <td className="py-2.5 px-3">Assessment #98</td>
                  <td className="py-2.5 px-3 text-slate-400">Overridden from MODERATE to HIGH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPatientModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-indigo-400">{selectedPatientModal.id} • ABDM: {selectedPatientModal.abdm_id}</span>
                <h3 className="text-xl font-bold text-white">{selectedPatientModal.name}</h3>
                <p className="text-xs text-slate-400">{selectedPatientModal.age} yrs • {selectedPatientModal.gender} • {selectedPatientModal.village}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Triage Symptoms Recorded:</span>
                <p className="text-sm font-semibold text-white">{selectedPatientModal.symptoms}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Risk Category:</span>
                  <span className="text-sm font-extrabold text-amber-400">{selectedPatientModal.risk_category}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Assigned Health Facility:</span>
                  <span className="text-xs font-semibold text-slate-200">{selectedPatientModal.facility}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Clinician Notes & Advice:</span>
                <p className="text-xs text-slate-300">{selectedPatientModal.clinical_notes}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedPatientModal(null);
                  onNavigate('PATIENT_TIMELINE');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
              >
                Open Full Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
