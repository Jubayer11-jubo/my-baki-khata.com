import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_NAME_BN, APP_TAGLINE } from '../constants';
import { CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { completeOnboarding } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="pt-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-1 shadow-xl shadow-emerald-600/30 flex items-center justify-center">
          <img src="/icons/icon.svg" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {APP_NAME_BN}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
          {APP_TAGLINE}
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="my-8 space-y-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
            আপনার বাকি হিসাব, এখন আপনার হাতেই
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            কোন দোকান থেকে কী নিয়েছেন এবং কত টাকা বাকি—সবকিছু সহজে হিসাব রাখুন। দোকানদার কত লিখে রাখল তা নিয়ে আর কোনো বিভ্রান্তি নয়!
          </p>

          <div className="mt-5 space-y-2.5">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>মুদি, ওষুধ, কাপড় সব দোকানের আলাদা খাতা</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>১০০% অফলাইনে চলে—ইন্টারনেটের কোনো প্রয়োজন নেই</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>সম্পূর্ণ নিরাপদ—আপনার ডাটা শুধু আপনার ফোনেই থাকবে</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pb-6">
        <button
          onClick={completeOnboarding}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98"
        >
          <span>শুরু করুন</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
