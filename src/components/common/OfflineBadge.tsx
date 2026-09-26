import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const isOnline = useOnlineStatus();

  if (compact) {
    return (
      <div 
        title={isOnline ? 'অনলাইন মোড সক্রিয়' : 'অফলাইন মোড - ডাটা সুরক্ষিত আছে'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs ${
          isOnline
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <span>{isOnline ? 'অনলাইন' : 'অফলাইন'}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
        isOnline
          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>🟢 অনলাইন</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
          <span>🔴 অফলাইন (ডাটা সুরক্ষিত)</span>
        </>
      )}
    </div>
  );
};
