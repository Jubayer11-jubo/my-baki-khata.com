import React from 'react';
import { APP_NAME_BN, APP_TAGLINE } from '../../constants';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300">
      <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md p-1.5 shadow-2xl flex items-center justify-center mb-5 animate-bounce">
        <img src="/icons/icon.svg" alt="App Logo" className="w-full h-full object-contain" />
      </div>

      <h1 className="text-3xl font-black tracking-tight mb-2">
        {APP_NAME_BN}
      </h1>

      <p className="text-xs sm:text-sm font-medium text-emerald-100 text-center max-w-xs">
        {APP_TAGLINE}
      </p>

      <div className="mt-8 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white/60 animate-ping" />
        <span className="text-xs text-emerald-200">লোড হচ্ছে...</span>
      </div>
    </div>
  );
};
