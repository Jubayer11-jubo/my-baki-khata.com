import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTaka } from '../../utils/formatters';
import { TrendingUp, ArrowDownCircle, Wallet } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { overallBalance, monthlyCredit, monthlyPayment } = useApp();

  return (
    <div className="space-y-3">
      {/* Primary Hero Card: মোট বাকি (Total Outstanding Debt) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-5 shadow-lg shadow-emerald-700/20">
        <div className="relative z-10">
          <div className="flex items-center justify-between opacity-90 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-200" />
              মোট বাকি (দোকানে পাওনা)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/40 text-white border border-emerald-400/30">
              সর্বমোট
            </span>
          </div>

          <div className="text-3xl font-extrabold tracking-tight mt-1 mb-2">
            {formatTaka(overallBalance)}
          </div>

          <p className="text-xs text-emerald-100/90 font-medium">
            {overallBalance > 0
              ? 'আপনার বিভিন্ন দোকানে মোট এই পরিমাণ বাকি রয়েছে'
              : overallBalance === 0
              ? 'আপনার কোনো দোকানে কোনো বাকি নেই! পরিচ্ছন্ন হিসাব।'
              : 'দোকানদারের কাছে আপনি অতিরিক্ত টাকা অগ্রিম দিয়েছেন'}
          </p>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-sm" />
        <div className="absolute right-14 -top-6 w-20 h-20 rounded-full bg-emerald-400/20 pointer-events-none" />
      </div>

      {/* 2 Grid Mini Cards: This Month Taken vs This Month Paid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: এই মাসে নিয়েছি */}
        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold">এই মাসে নিয়েছি</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-rose-200 truncate">
            {formatTaka(monthlyCredit)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">নতুন বাকি</span>
        </div>

        {/* Card 2: এই মাসে পরিশোধ */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 mb-1">
            <ArrowDownCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">এই মাসে পরিশোধ</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-emerald-200 truncate">
            {formatTaka(monthlyPayment)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">পরিশোধিত টাকা</span>
        </div>
      </div>
    </div>
  );
};
