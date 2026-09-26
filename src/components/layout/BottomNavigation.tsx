import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Store, Plus, BarChart3, Settings, ShoppingBag, ArrowDownLeft, X } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedShopId, openCreditModal, openPaymentModal } = useApp();
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const handleTabClick = (tab: 'home' | 'shops' | 'reports' | 'settings') => {
    setSelectedShopId(null);
    setActiveTab(tab);
    setActionMenuOpen(false);
  };

  const handleOpenCredit = () => {
    setActionMenuOpen(false);
    openCreditModal();
  };

  const handleOpenPayment = () => {
    setActionMenuOpen(false);
    openPaymentModal();
  };

  return (
    <>
      {/* Floating Action Menu Overlay (when center + is clicked) */}
      {actionMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActionMenuOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 mb-20 shadow-2xl space-y-3 animate-in slide-in-from-bottom-6 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                নতুন হিসাব যোগ করুন
              </h3>
              <button 
                onClick={() => setActionMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Choice 1: Add Credit (বাকি নেওয়া) */}
            <button
              onClick={handleOpenCredit}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-left hover:bg-rose-100 dark:hover:bg-rose-950/70 transition active:scale-98"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-600/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">বাকি যোগ করুন</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">দোকান থেকে বাকিতে নেওয়া কেনাকাটা</p>
              </div>
            </button>

            {/* Quick Choice 2: Add Payment (টাকা পরিশোধ) */}
            <button
              onClick={handleOpenPayment}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-left hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition active:scale-98"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">টাকা পরিশোধ</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">দোকানদারকে বাকির টাকা পরিশোধ</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 transition-colors pb-safe"
        aria-label="Main Navigation"
      >
        <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around relative">
          {/* Tab 1: Home (🏠 হোম) */}
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors active:scale-95 ${
              activeTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">হোম</span>
          </button>

          {/* Tab 2: Shops (🏪 দোকান) */}
          <button
            onClick={() => handleTabClick('shops')}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors active:scale-95 ${
              activeTab === 'shops'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">দোকান</span>
          </button>

          {/* Center Tab: Add (➕ নতুন হিসাব) - Visually Emphasized */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => setActionMenuOpen(prev => !prev)}
              className={`w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white dark:border-slate-900 ${
                actionMenuOpen ? 'rotate-45' : ''
              }`}
              title="নতুন হিসাব যোগ করুন"
              aria-label="Add transaction"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Tab 4: Reports (📊 রিপোর্ট) */}
          <button
            onClick={() => handleTabClick('reports')}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors active:scale-95 ${
              activeTab === 'reports'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">রিপোর্ট</span>
          </button>

          {/* Tab 5: Settings (⚙️ সেটিংস) */}
          <button
            onClick={() => handleTabClick('settings')}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors active:scale-95 ${
              activeTab === 'settings'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">সেটিংস</span>
          </button>
        </div>
      </nav>
    </>
  );
};
