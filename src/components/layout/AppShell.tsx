import React from 'react';
import { ToastContainer } from '../common/Toast';
import { BottomNavigation } from './BottomNavigation';
import { useApp } from '../../context/AppContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarding } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center text-slate-800 dark:text-slate-100 transition-colors">
      <ToastContainer />
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-xl flex flex-col relative pb-20">
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Hide bottom nav on onboarding screen */}
        {!isOnboarding && <BottomNavigation />}
      </div>
    </div>
  );
};
