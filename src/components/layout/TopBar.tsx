import React from 'react';
import { useApp } from '../../context/AppContext';
import { OfflineBadge } from '../common/OfflineBadge';
import { ArrowLeft, Moon, Sun, Bell, Search } from 'lucide-react';
import { APP_NAME_BN } from '../../constants';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction
}) => {
  const { theme, setTheme, setActiveTab, reminders } = useApp();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const pendingRemindersCount = reminders.filter(r => !r.isCompleted).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: Back button OR App Brand */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-md shadow-emerald-600/20 flex items-center justify-center">
                <img src="/icons/icon.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
              {title || APP_NAME_BN}
            </h1>
            {subtitle ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate -mt-0.5">
                {subtitle}
              </p>
            ) : (
              <div className="flex items-center gap-1.5 -mt-0.5">
                <OfflineBadge compact />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1.5">
          {rightAction ? (
            rightAction
          ) : (
            <>
              {/* Quick Search Button */}
              <button
                onClick={() => setActiveTab('search')}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                title="খুঁজুন"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Reminders Button */}
              <button
                onClick={() => setActiveTab('reminders')}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                title="তাগিদ / রিমাইন্ডার"
                aria-label="Reminders"
              >
                <Bell className="w-5 h-5" />
                {pendingRemindersCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                title={theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
