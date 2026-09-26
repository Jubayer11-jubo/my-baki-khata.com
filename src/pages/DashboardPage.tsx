import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ShopCard } from '../components/shops/ShopCard';
import { InstallPrompt } from '../components/common/InstallPrompt';
import { formatTaka, formatDateBangla } from '../utils/formatters';
import { TRANSACTION_TYPES } from '../constants';
import { Store, ShoppingBag, Plus, ArrowRight, Clock } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    shops,
    transactions,
    setSelectedShopId,
    setActiveTab,
    openShopModal,
    openCreditModal,
    openTransactionDetails
  } = useApp();

  const handleSelectShop = (shopId: string) => {
    setSelectedShopId(shopId);
  };

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  // Shop lookup map
  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  return (
    <div className="flex-1 flex flex-col">
      <TopBar />

      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        {/* PWA Install Banner */}
        <InstallPrompt />

        {/* Dashboard 3 Metric Summary Cards */}
        <SummaryCards />

        {/* Quick Actions (বাকি যোগ, টাকা পরিশোধ, নতুন দোকান, রিপোর্ট) */}
        <QuickActions />

        {/* Section: আমার দোকানগুলো */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              আমার দোকানগুলো ({shops.length})
            </h3>

            {shops.length > 0 && (
              <button
                onClick={() => setActiveTab('shops')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
              >
                সব দোকান
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {shops.length === 0 ? (
            /* Empty State for Shops */
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  এখনো কোনো দোকান যোগ করা হয়নি
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  যেসব দোকান থেকে বাকি নেন, তাদের নাম যোগ করে হিসাব শুরু করুন
                </p>
              </div>
              <button
                onClick={() => openShopModal()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                প্রথম দোকান যোগ করুন
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {shops.slice(0, 4).map(shop => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  onClick={() => handleSelectShop(shop.id)}
                />
              ))}

              {shops.length > 4 && (
                <button
                  onClick={() => setActiveTab('shops')}
                  className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  আরও {shops.length - 4} টি দোকান দেখুন...
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section: সাম্প্রতিক হিসাব (Recent Transactions) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              সাম্প্রতিক হিসাব
            </h3>

            {transactions.length > 0 && (
              <button
                onClick={() => setActiveTab('search')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
              >
                সব হিসাব
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {transactions.length === 0 ? (
            /* Empty State for Transactions */
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  এখনো কোনো বাকি হিসাব নেই
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  দোকান থেকে বাকিতে কেনাকাটা করলে তা সহজেই এখানে লিখে রাখুন
                </p>
              </div>
              <button
                onClick={() => openCreditModal()}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                নতুন হিসাব যোগ করুন
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden">
              {recentTransactions.map(tx => {
                const typeConfig = TRANSACTION_TYPES[tx.type] || TRANSACTION_TYPES.CREDIT;
                const shopName = shopMap.get(tx.shopId) || 'অজানা দোকান';

                let description = '';
                if (tx.items && tx.items.length > 0) {
                  description = tx.items.map(i => i.productName).join(' + ');
                } else if (tx.note) {
                  description = tx.note;
                } else {
                  description = typeConfig.label;
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
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {shopName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {description}
                        </p>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          {formatDateBangla(tx.date)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <span className={`text-sm font-extrabold ${typeConfig.color}`}>
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
    </div>
  );
};
