import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, HandCoins, Store, BarChart2 } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { openCreditModal, openPaymentModal, openShopModal, setActiveTab } = useApp();

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
        দ্রুত কাজসমূহ
      </h3>

      <div className="grid grid-cols-4 gap-2">
        {/* Action 1: বাকি যোগ করুন */}
        <button
          onClick={() => openCreditModal()}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
            বাকি যোগ
          </span>
        </button>

        {/* Action 2: টাকা পরিশোধ */}
        <button
          onClick={() => openPaymentModal()}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <HandCoins className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
            পরিশোধ
          </span>
        </button>

        {/* Action 3: নতুন দোকান */}
        <button
          onClick={() => openShopModal()}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
            নতুন দোকান
          </span>
        </button>

        {/* Action 4: রিপোর্ট দেখুন */}
        <button
          onClick={() => setActiveTab('reports')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <BarChart2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
            রিপোর্ট
          </span>
        </button>
      </div>
    </div>
  );
};
