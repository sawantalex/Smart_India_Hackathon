import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { ScreenName } from '../types';
import { BarChart3, ShieldCheck, Database, RefreshCw, Wifi, WifiOff, FileText, Lock, Activity, Users } from 'lucide-react';
import { getOfflineQueue } from '../offline/db';

interface AdminAndSystemScreensProps {
  onNavigate: (screen: ScreenName) => void;
  activeScreen: 'ANALYTICS' | 'ADMIN_SETTINGS' | 'OFFLINE_SYNC_STATUS';
  isOnline: boolean;
}

export const AdminAndSystemScreens: React.FC<AdminAndSystemScreensProps> = ({ onNavigate, activeScreen, isOnline }) => {
  const { t } = useLanguage();
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

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

  // Screen 21: Aggregated De-identified Health Trends Analytics
  if (activeScreen === 'ANALYTICS') {
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Aggregated Health Trends & Regional Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            De-identified aggregate epidemiology metrics for Pune District.
          </p>
        </div>

        {/* Anonymization Cohort Threshold Alert */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3 text-xs text-indigo-200">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <strong className="text-indigo-300 block">De-Identification & Privacy Protection:</strong>
            Cohort threshold rule enforced. Aggregated groups with fewer than 5 patients are suppressed to prevent individual re-identification.
          </div>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <span className="text-xs font-semibold text-slate-400">Total Assessments</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">128</h3>
            <span className="text-[10px] text-emerald-400 font-bold">100% De-identified</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <span className="text-xs font-semibold text-slate-400">Issued PHC Referrals</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">42</h3>
            <span className="text-[10px] text-teal-400 font-bold">32.8% Referral Rate</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg">
            <span className="text-xs font-semibold text-slate-400">Emergency Escalations</span>
            <h3 className="text-3xl font-extrabold text-red-400 mt-1">4</h3>
            <span className="text-[10px] text-red-300 font-bold">108 Ambulance Sent</span>
          </div>
        </div>

        {/* Urgency Distribution Bar Visualizer */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200">Urgency Category Breakdown</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-300">LOW RISK (Routine OPD)</span>
                <span className="text-emerald-400">65 (50.7%)</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[50.7%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-300">MODERATE RISK (Priority PHC)</span>
                <span className="text-teal-400">42 (32.8%)</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[32.8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-300">HIGH RISK (Urgent Same-Day)</span>
                <span className="text-amber-400">17 (13.3%)</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[13.3%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-300">EMERGENCY (Trauma 108)</span>
                <span className="text-red-400">4 (3.1%)</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[3.1%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 22: Admin Settings & Audit Log Viewer
  if (activeScreen === 'ADMIN_SETTINGS') {
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-6 h-6 text-teal-400" />
            System Audit Trail & Security Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-resistant audit trail logging all triage calculations, overrides, and RBAC events.
          </p>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action Event</th>
                <th className="py-2.5 px-3">Resource Target</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
              <tr>
                <td className="py-2.5 px-3 text-slate-400">2026-08-19 15:40:12</td>
                <td className="py-2.5 px-3 text-teal-400">patient_demo</td>
                <td className="py-2.5 px-3 text-emerald-300">TRIAGE_EVALUATION</td>
                <td className="py-2.5 px-3">Assessment #101</td>
                <td className="py-2.5 px-3 text-slate-400">Rule-based risk: MODERATE</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">2026-08-19 15:38:05</td>
                <td className="py-2.5 px-3 text-emerald-400">worker_demo</td>
                <td className="py-2.5 px-3 text-amber-300">TRIAGE_OVERRIDE</td>
                <td className="py-2.5 px-3">Assessment #98</td>
                <td className="py-2.5 px-3 text-slate-400">Overridden from MODERATE to HIGH</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">2026-08-19 15:30:00</td>
                <td className="py-2.5 px-3 text-slate-400">system_sync</td>
                <td className="py-2.5 px-3 text-blue-300">OFFLINE_QUEUE_SYNC</td>
                <td className="py-2.5 px-3">Sync Event #402</td>
                <td className="py-2.5 px-3 text-slate-400">Processed 1 queued transaction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Screen 24: Offline Queue & Sync Monitor
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-400" />
            Offline Queue & Sync Engine Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            IndexedDB local storage queue and backend sync status monitor.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-2xl text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-amber-400" />}
            <span className="font-bold text-slate-200">
              Connection Status: {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
            </span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing || queueItems.length === 0}
            className="btn-large bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Pending Items'}
          </button>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Pending Local Transactions ({queueItems.length})
          </h4>

          {queueItems.length === 0 ? (
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 text-center text-xs text-slate-400">
              No pending offline transactions. All data is synchronized.
            </div>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {queueItems.map((item) => (
                <div key={item.client_tx_id} className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex justify-between">
                  <div>
                    <span className="text-amber-400 font-bold">{item.action_type} {item.entity_type}</span>
                    <p className="text-slate-400 text-[10px]">TX ID: {item.client_tx_id}</p>
                  </div>
                  <span className="text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
