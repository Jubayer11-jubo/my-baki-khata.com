import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Share2, PlusSquare } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install, dismiss } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) return null;

  return (
    <>
      {isInstallable && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg border border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xs flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm tracking-wide">অ্যাপটি ফোনে ইনস্টল করুন</h4>
              <p className="text-xs text-emerald-100 truncate">সহজে সরাসরি হোম স্ক্রিন থেকে বাকি হিসাব রাখুন</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={install}
              className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-sm hover:bg-emerald-50 transition active:scale-95"
            >
              ইনস্টল করুন
            </button>
            <button
              onClick={dismiss}
              className="p-1.5 rounded-xl text-emerald-100 hover:bg-white/10 transition"
              title="এখন নয়"
              aria-label="এখন নয়"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isIOS && (
        <div className="mx-4 mb-4 p-3.5 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-slate-800 flex-shrink-0">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-200">আইফোনে সহজে অ্যাপ হিসেবে ব্যবহার করুন</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowIOSModal(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition"
            >
              কীভাবে?
            </button>
            <button
              onClick={dismiss}
              className="p-1 text-slate-400 hover:text-white"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                আইফোনে অ্যাপ ইনস্টল নির্দেশিকা
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <Share2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>১. Safari ব্রাউজারের নিচে থাকা <strong className="text-slate-900 dark:text-white">Share</strong> বাটনে চাপ দিন।</p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <PlusSquare className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>২. স্ক্রল করে <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong> নির্বাচন করুন।</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </>
  );
};
