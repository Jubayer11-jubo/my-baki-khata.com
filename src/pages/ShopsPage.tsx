import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { ShopCard } from '../components/shops/ShopCard';
import { Store, Plus, Search, ArrowUpDown } from 'lucide-react';

export const ShopsPage: React.FC = () => {
  const { shops, setSelectedShopId, openShopModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'BALANCE' | 'NAME' | 'RECENT'>('BALANCE');

  const filteredShops = shops.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.type && s.type.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  });

  filteredShops.sort((a, b) => {
    if (sortBy === 'BALANCE') {
      return b.balance - a.balance;
    } else if (sortBy === 'NAME') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'RECENT') {
      return b.createdAt.localeCompare(a.createdAt);
    }
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col">
      <TopBar 
        title="আমার দোকানসমূহ" 
        rightAction={
          <button
            onClick={() => openShopModal()}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
            title="নতুন দোকান যোগ করুন"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন দোকান</span>
          </button>
        }
      />

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Search & Sort Controls */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="দোকান খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 shadow-xs appearance-none pr-8"
            >
              <option value="BALANCE">বাকি অনুযায়ী</option>
              <option value="NAME">নাম অনুযায়ী</option>
              <option value="RECENT">নতুন দোকান</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Shop List / Empty States */}
        {filteredShops.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3 mt-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mx-auto flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {searchQuery ? 'কোনো দোকান পাওয়া যায়নি' : 'এখনো কোনো দোকান যোগ করা হয়নি'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {searchQuery
                  ? 'ভিন্ন বানান বা শব্দ দিয়ে অনুসন্ধান করে দেখুন'
                  : 'আপনি যেসব দোকান থেকে বাকিতে কেনাকাটা করেন তাদের যোগ করুন'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => openShopModal()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                প্রথম দোকান যোগ করুন
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              মোট {filteredShops.length} টি দোকান
            </span>
            {filteredShops.map(shop => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onClick={() => setSelectedShopId(shop.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
