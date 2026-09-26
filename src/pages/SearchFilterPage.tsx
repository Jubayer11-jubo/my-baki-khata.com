import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { formatTaka, formatDateBangla } from '../utils/formatters';
import { TRANSACTION_TYPES } from '../constants';
import type { TransactionType } from '../types';
import { Search, Filter, X, ArrowUpDown, Calendar } from 'lucide-react';

export const SearchFilterPage: React.FC = () => {
  const { transactions, shops, openTransactionDetails, setActiveTab } = useApp();

  const [query, setQuery] = useState('');
  const [selectedShopId, setSelectedShopId] = useState('ALL');
  const [selectedType, setSelectedType] = useState<TransactionType | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<'ALL_TIME' | 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM'>('ALL_TIME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('NEWEST');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const shopMap = useMemo(() => new Map(shops.map(s => [s.id, s.name])), [shops]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Shop filter
    if (selectedShopId !== 'ALL') {
      result = result.filter(t => t.shopId === selectedShopId);
    }

    // Type filter
    if (selectedType !== 'ALL') {
      result = result.filter(t => t.type === selectedType);
    }

    // Date range filter
    const now = new Date();
    if (dateRange === 'THIS_MONTH') {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const prefix = `${year}-${month}`;
      result = result.filter(t => t.date.startsWith(prefix));
    } else if (dateRange === 'LAST_MONTH') {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const year = lastMonthDate.getFullYear();
      const month = String(lastMonthDate.getMonth() + 1).padStart(2, '0');
      const prefix = `${year}-${month}`;
      result = result.filter(t => t.date.startsWith(prefix));
    } else if (dateRange === 'CUSTOM') {
      if (startDate) {
        result = result.filter(t => t.date >= startDate);
      }
      if (endDate) {
        result = result.filter(t => t.date <= endDate);
      }
    }

    // Search query: shop name, product name, notes, amount, date
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(t => {
        const sName = (shopMap.get(t.shopId) || '').toLowerCase();
        if (sName.includes(q)) return true;
        if (t.note && t.note.toLowerCase().includes(q)) return true;
        if (String(t.totalAmount).includes(q)) return true;
        if (t.date.includes(q)) return true;
        if (t.items && t.items.some(i => i.productName.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
      } else if (sortBy === 'OLDEST') {
        return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
      } else if (sortBy === 'AMOUNT_DESC') {
        return b.totalAmount - a.totalAmount;
      } else if (sortBy === 'AMOUNT_ASC') {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

    return result;
  }, [transactions, query, selectedShopId, selectedType, dateRange, startDate, endDate, sortBy, shopMap]);

  const activeFiltersCount = 
    (selectedShopId !== 'ALL' ? 1 : 0) +
    (selectedType !== 'ALL' ? 1 : 0) +
    (dateRange !== 'ALL_TIME' ? 1 : 0);

  const handleClearFilters = () => {
    setSelectedShopId('ALL');
    setSelectedType('ALL');
    setDateRange('ALL_TIME');
    setStartDate('');
    setEndDate('');
    setQuery('');
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="অনুসন্ধান ও ফিল্টার"
        showBack={true}
        onBack={() => setActiveTab('home')}
      />

      <div className="flex-1 px-4 py-4 space-y-3.5 overflow-y-auto">
        {/* Search input & Filter toggle button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="পণ্য, দোকান, তারিখ বা টাকা দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 shadow-xs"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setFilterPanelOpen(prev => !prev)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
              activeFiltersCount > 0 || filterPanelOpen
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>ফিল্টার</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-emerald-700 text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filter & Sort Panel */}
        {filterPanelOpen && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ফিল্টার অপশন
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-500 font-semibold hover:underline"
                >
                  ফিল্টার মুছুন
                </button>
              )}
            </div>

            {/* Shop select */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                দোকান
              </label>
              <select
                value={selectedShopId}
                onChange={e => setSelectedShopId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="ALL">সব দোকান</option>
                {shops.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Type & Date Range in grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  হিসাবের ধরন
                </label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="ALL">সব ধরন</option>
                  <option value="CREDIT">বাকি নেওয়া</option>
                  <option value="PAYMENT">পরিশোধ</option>
                  <option value="ADJUSTMENT">সমন্বয় / ছাড়</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  তারিখের সময়সীমা
                </label>
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="ALL_TIME">সব সময়</option>
                  <option value="THIS_MONTH">চলতি মাস</option>
                  <option value="LAST_MONTH">গত মাস</option>
                  <option value="CUSTOM">কাস্টম তারিখ</option>
                </select>
              </div>
            </div>

            {/* Custom Dates if CUSTOM is selected */}
            {dateRange === 'CUSTOM' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">শুরুর তারিখ</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">শেষের তারিখ</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                সাজানোর ক্রম
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="NEWEST">নতুন → পুরনো</option>
                <option value="OLDEST">পুরনো → নতুন</option>
                <option value="AMOUNT_DESC">সর্বোচ্চ টাকা → সর্বনিম্ন</option>
                <option value="AMOUNT_ASC">সর্বনিম্ন টাকা → সর্বোচ্চ</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>মোট {filteredTransactions.length} টি ফলাফল পাওয়া গেছে</span>
          {query && <span className="font-semibold text-emerald-600">"{query}"-এর অনুসন্ধান</span>}
        </div>

        {/* Results List */}
        {filteredTransactions.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2 mt-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              কোনো হিসাব পাওয়া যায়নি
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              অনুসন্ধানের শব্দ পরিবর্তন করে বা ফিল্টার ক্লিয়ার করে দেখুন
            </p>
            {(query || activeFiltersCount > 0) && (
              <button
                onClick={handleClearFilters}
                className="mt-2 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden">
            {filteredTransactions.map(tx => {
              const typeConfig = TRANSACTION_TYPES[tx.type] || TRANSACTION_TYPES.CREDIT;
              const shopName = shopMap.get(tx.shopId) || 'অজানা দোকান';

              let title = '';
              if (tx.items && tx.items.length > 0) {
                title = tx.items.map(i => i.productName).join(' + ');
              } else if (tx.note) {
                title = tx.note;
              } else {
                title = typeConfig.label;
              }

              return (
                <div
                  key={tx.id}
                  onClick={() => openTransactionDetails(tx.id)}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition active:bg-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${typeConfig.bg} ${typeConfig.color}`}>
                      {typeConfig.sign}
                    </div>

                    <div className="min-w-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                        {shopName}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                        {title}
                      </p>
                      <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDateBangla(tx.date)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <span className={`text-base font-extrabold ${typeConfig.color}`}>
                      {typeConfig.sign}{formatTaka(tx.totalAmount)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      {typeConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
