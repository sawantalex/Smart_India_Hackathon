import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  const { t } = useLanguage();
  const [syncing, setSyncing] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState<string | null>(null);

  if (isOnline) return null;

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await ApiService.syncQueue();
      setSyncResult(res.message || 'Synced successfully!');
    } catch (e: any) {
      setSyncResult('Sync failed. Will retry automatically when connected.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t('offline_mode')}</span>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-md text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : t('sync_now')}
        </button>
      </div>
      {syncResult && (
        <div className="max-w-7xl mx-auto text-xs text-amber-300 mt-1 font-mono">
          {syncResult}
        </div>
      )}
    </div>
  );
};
