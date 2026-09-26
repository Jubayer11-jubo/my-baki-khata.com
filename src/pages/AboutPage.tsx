import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { APP_NAME_BN, APP_NAME_EN, APP_TAGLINE, APP_VERSION } from '../constants';
import { ShieldCheck, Database, HardDrive, Smartphone, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="অ্যাপ সম্পর্কিত"
        showBack={true}
        onBack={() => setActiveTab('settings')}
      />

      <div className="flex-1 px-4 py-6 space-y-5 overflow-y-auto">
        {/* App Logo & Info */}
        <div className="text-center space-y-2 py-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-1 shadow-xl shadow-emerald-600/25 flex items-center justify-center">
            <img src="/icons/icon.svg" alt="App Logo" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {APP_NAME_BN}
          </h2>
          <p className="text-xs font-bold text-slate-400">
            {APP_NAME_EN}
          </p>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {APP_TAGLINE}
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
            সংস্করণ {APP_VERSION}
          </span>
        </div>

        {/* Core Principles */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            অ্যাপের মূল বৈশিষ্ট্য ও নিরাপত্তা
          </h3>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">
                  ১০০% অফলাইন ও লোকাল ডাটাবেস
                </strong>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  এই অ্যাপটি চালানোর জন্য কোনো ইন্টারনেট বা ক্লাউড সার্ভারের প্রয়োজন নেই। আপনার ব্রাউজারের নিজস্ব IndexedDB ডাটাবেসে সমস্ত তথ্য অত্যন্ত দ্রুত সংরক্ষিত হয়।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">
                  সম্পূর্ণ ব্যক্তিগত ও নিরাপদ
                </strong>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  আপনার খরচের হিসাব সম্পূর্ণ আপনার নিজস্ব। কোনো তৃতীয় পক্ষের ট্র্যাকিং বা সার্ভারে আপনার আর্থিক তথ্য পাঠানো হয় না।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">
                  সহজ ব্যাকআপ ও রিস্টোর
                </strong>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  যেকোনো সময় সেটিংস থেকে পুরো ডাটার ব্যাকআপ ফাইল (.json) এবং এক্সেল (.csv) ডাউনলোড করে রাখতে পারবেন এবং পরবর্তীতে রিস্টোর করতে পারবেন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">
                  ইনস্টলেবল প্রগ্রেসিভ ওয়েব অ্যাপ (PWA)
                </strong>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  অ্যান্ড্রয়েড এবং আইফোনে কোনো অ্যাপ স্টোর ছাড়াই হোম স্ক্রিনে সরাসরি আসল অ্যাপের মতো ইনস্টল করে ব্যবহার করা যায়।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1">
            তৈরি করা হয়েছে <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> দিয়ে গ্রাহকদের হিসাব সহজ রাখতে।
          </p>
          <p>© {new Date().getFullYear()} {APP_NAME_BN}। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </div>
  );
};
