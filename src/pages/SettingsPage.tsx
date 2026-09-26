import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { backupService } from '../services/backupService';
import type { ThemeMode } from '../types';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  Info, 
  Check, 
  ShieldCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, refreshData, showToast, setActiveTab } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [secondConfirmOpen, setSecondConfirmOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Backup Export
  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const filename = await backupService.exportBackup();
      showToast(`ব্যাকআপ সফলভাবে তৈরি হয়েছে: ${filename} ✓`, 'success');
    } catch (e) {
      console.error(e);
      showToast('ব্যাকআপ তৈরি করা যায়নি। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Restore Trigger
  const handleRestoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Restore File Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsRestoring(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const result = await backupService.restoreBackup(content);
        if (result.success) {
          showToast('ডাটা সফলভাবে রিস্টোর হয়েছে ✓', 'success');
          await refreshData();
        } else {
          showToast(result.message, 'error');
        }
        setIsRestoring(false);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      showToast('ফাইল পড়তে সমস্যা হয়েছে।', 'error');
      setIsRestoring(false);
    }
  };

  // CSV Export
  const handleExportCSV = async () => {
    try {
      const filename = await backupService.exportCSV();
      showToast(`CSV ফাইল ডাউনলোড হয়েছে: ${filename} ✓`, 'success');
    } catch (e) {
      console.error(e);
      showToast('CSV ফাইল তৈরি করা যায়নি।', 'error');
    }
  };

  // Data Reset logic with double confirmation
  const handleFirstResetConfirm = () => {
    setConfirmResetOpen(false);
    setSecondConfirmOpen(true);
  };

  const handleFinalReset = async () => {
    try {
      await backupService.resetAllData();
      showToast('সমস্ত তথ্য সফলভাবে মুছে ফেলা হয়েছে', 'info');
      await refreshData();
      setSecondConfirmOpen(false);
      setActiveTab('home');
    } catch (err) {
      console.error(err);
      showToast('ডাটা মুছে ফেলা সম্ভব হয়নি।', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="সেটিংস ও ব্যাকআপ" />

      {/* Hidden file input for restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        {/* Section: থিম (Theme Selection) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            ডিসপ্লে থিম
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {/* Light */}
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition active:scale-95 ${
                theme === 'light'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs">☀️ লাইট</span>
            </button>

            {/* Dark */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs">🌙 ডার্ক</span>
            </button>

            {/* System */}
            <button
              onClick={() => setTheme('system')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition active:scale-95 ${
                theme === 'system'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Monitor className="w-5 h-5 text-slate-500" />
              <span className="text-xs">⚙️ সিস্টেম</span>
            </button>
          </div>
        </div>

        {/* Section: ব্যাকআপ ও রিস্টোর (Backup & Restore) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              ডাটা ব্যাকআপ ও রিস্টোর
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            আপনার হিসাবের সকল তথ্য আপনার ফোনেই সংরক্ষিত থাকে। ফোন পরিবর্তন বা নিরাপদ রাখার জন্য ব্যাকআপ ফাইল ডাউনলোড করে রাখতে পারেন।
          </p>

          <div className="space-y-2.5">
            {/* Backup Button */}
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-left transition active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    ডাটা ব্যাকআপ নিন (JSON)
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    সমস্ত দোকান, কেনাকাটা ও পরিশোধের ফাইল সংরক্ষণ
                  </span>
                </div>
              </div>
              <Check className="w-4 h-4 text-slate-400" />
            </button>

            {/* Restore Button */}
            <button
              onClick={handleRestoreClick}
              disabled={isRestoring}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-left transition active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    ডাটা রিস্টোর করুন (JSON)
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    পূর্বের সেভ করা ব্যাকআপ ফাইল থেকে তথ্য ফিরিয়ে আনুন
                  </span>
                </div>
              </div>
              <Check className="w-4 h-4 text-slate-400" />
            </button>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-left transition active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    এক্সেল / CSV রিপোর্ট ডাউনলোড
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    কম্পিউটার বা এক্সেলে দেখার জন্য ফাইল
                  </span>
                </div>
              </div>
              <Check className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section: অ্যাপ সম্পর্কিত ও রিসেট (About & Danger Zone) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            অন্যান্য
          </h3>

          {/* About App */}
          <button
            onClick={() => setActiveTab('about')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                অ্যাপ সম্পর্কিত তথ্য (About)
              </span>
            </div>
            <span className="text-xs text-slate-400">v1.0.0</span>
          </button>

          {/* Danger: Reset All Data */}
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="w-full p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-between text-rose-600 dark:text-rose-400 transition"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4" />
              <span className="font-bold text-sm">সব ডাটা মুছে ফেলুন</span>
            </div>
            <span className="text-xs font-semibold">রিসেট</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog 1 */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        title="সব ডাটা মুছে ফেলতে চান?"
        message="সতর্কতা: এই কাজটি করলে আপনার সব দোকান, কেনাকাটা, পরিশোধ এবং হিসাবের রেকর্ড মুছে যাবে। আপনি কি নিশ্চিত?"
        confirmText="হ্যাঁ, আমি নিশ্চিত"
        cancelText="না, বাতিল"
        isDestructive={true}
        onConfirm={handleFirstResetConfirm}
        onCancel={() => setConfirmResetOpen(false)}
      />

      {/* Second Confirmation Dialog (Double Safety for Total Reset) */}
      <ConfirmDialog
        isOpen={secondConfirmOpen}
        title="চূড়ান্ত সতর্কতা!"
        message="মুছে ফেলার পর এই ডাটা আর কোনোভাবেই ফেরত পাওয়া যাবে না! আপনি কি সত্যিই সম্পূর্ণ ডাটা ফ্যাক্টরি রিসেট করতে চান?"
        confirmText="সব ডাটা মুছে ফেলুন"
        cancelText="বাতিল করুন"
        isDestructive={true}
        onConfirm={handleFinalReset}
        onCancel={() => setSecondConfirmOpen(false)}
      />
    </div>
  );
};
