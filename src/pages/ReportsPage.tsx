import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { calculationService } from '../services/calculationService';
import { backupService } from '../services/backupService';
import { formatTaka } from '../utils/formatters';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Store, 
  Wallet, 
  TrendingUp, 
  ArrowDownCircle 
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { overallBalance, totalCredit, totalPayment, showToast } = useApp();

  const [monthlyHistory, setMonthlyHistory] = useState<Array<{
    monthKey: string;
    monthLabel: string;
    credit: number;
    payment: number;
  }>>([]);

  const [shopBreakdown, setShopBreakdown] = useState<Array<{
    shopId: string;
    shopName: string;
    totalCredit: number;
    totalPayment: number;
    balance: number;
    percentage: number;
  }>>([]);

  const [isExportingCSV, setIsExportingCSV] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      const [history, breakdown] = await Promise.all([
        calculationService.getMonthlyHistory(6),
        calculationService.calculateShopSpendingBreakdown()
      ]);
      setMonthlyHistory(history);
      setShopBreakdown(breakdown);
    };

    loadReports();
  }, []);

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);
      const filename = await backupService.exportCSV();
      showToast(`এক্সেল/CSV ফাইল ডাউনলোড হয়েছে: ${filename} ✓`, 'success');
    } catch (e) {
      console.error(e);
      showToast('CSV ফাইল তৈরি করা যায়নি।', 'error');
    } finally {
      setIsExportingCSV(false);
    }
  };

  // Find max credit in monthly history to scale the mobile bar chart
  const maxMonthlyVal = Math.max(
    ...monthlyHistory.map(m => Math.max(m.credit, m.payment)),
    100
  );

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="বাকি ও খরচের রিপোর্ট"
        rightAction={
          <button
            onClick={handleExportCSV}
            disabled={isExportingCSV}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition active:scale-95"
            title="Excel / CSV রিপোর্ট ডাউনলোড করুন"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">CSV ডাউনলোড</span>
          </button>
        }
      />

      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: মোট বাকি */}
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center">
            <Wallet className="w-4 h-4 text-rose-600 dark:text-rose-400 mx-auto mb-1" />
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
              মোট বাকি
            </span>
            <div className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400 truncate">
              {formatTaka(overallBalance)}
            </div>
          </div>

          {/* Card 2: মোট কেনাকাটা */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
              মোট কেনাকাটা
            </span>
            <div className="text-sm sm:text-base font-extrabold text-amber-700 dark:text-amber-300 truncate">
              {formatTaka(totalCredit)}
            </div>
          </div>

          {/* Card 3: মোট পরিশোধ */}
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
            <ArrowDownCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
              মোট পরিশোধ
            </span>
            <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
              {formatTaka(totalPayment)}
            </div>
          </div>
        </div>

        {/* Monthly Spending History Chart (Pure CSS Mobile Optimized Real Bar Chart) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              মাসিক বাকি ও পরিশোধের চিত্র (শেষ ৬ মাস)
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-300">বাকি নেওয়া</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">টাকা পরিশোধ</span>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="pt-4 pb-2 flex items-end justify-between gap-2 h-44 border-b border-slate-200 dark:border-slate-700">
            {monthlyHistory.map((item, idx) => {
              const creditHeight = Math.round((item.credit / maxMonthlyVal) * 100);
              const paymentHeight = Math.round((item.payment / maxMonthlyVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    {/* Credit Bar */}
                    <div
                      style={{ height: `${Math.max(creditHeight, 4)}%` }}
                      className="w-1/2 max-w-[14px] bg-rose-500 rounded-t-md transition-all group-hover:bg-rose-600 relative"
                      title={`বাকি: ৳${item.credit}`}
                    />
                    {/* Payment Bar */}
                    <div
                      style={{ height: `${Math.max(paymentHeight, 4)}%` }}
                      className="w-1/2 max-w-[14px] bg-emerald-500 rounded-t-md transition-all group-hover:bg-emerald-600 relative"
                      title={`পরিশোধ: ৳${item.payment}`}
                    />
                  </div>

                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                    {item.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            * বারগুলোর উপর হোভার বা ট্যাপ করে সঠিক টাকার পরিমাণ দেখতে পারেন
          </p>
        </div>

        {/* Shop-wise Breakdown (দোকান অনুযায়ী বাকির অনুপাত) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              দোকান অনুযায়ী খরচের খতিয়ান
            </h3>
          </div>

          {shopBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              কোনো দোকানের তথ্য পাওয়া যায়নি
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {shopBreakdown.map(item => (
                <div key={item.shopId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.shopName}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        বাকি: {formatTaka(item.balance)}
                      </span>
                      <span className="text-slate-400 ml-2">
                        (মোট কেনাকাটা: {formatTaka(item.totalCredit)})
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export CSV CTA card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                এক্সেল শিটে সব হিসাব সংরক্ষণ করুন
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                অফলাইনে CSV ফাইলে পুরো হিসাব এক্সপোর্ট করুন
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition active:scale-95 flex-shrink-0"
          >
            ডাউনলোড
          </button>
        </div>
      </div>
    </div>
  );
};
