import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { shopRepository } from '../database/repositories/shopRepository';
import { formatTaka, formatDateBangla } from '../utils/formatters';
import { TRANSACTION_TYPES } from '../constants';
import { 
  PlusCircle, 
  HandCoins, 
  Edit, 
  Trash2, 
  Phone, 
  MapPin, 
  FileText, 
  ShoppingBag,
  Bell
} from 'lucide-react';

export const ShopLedgerPage: React.FC = () => {
  const {
    selectedShopId,
    setSelectedShopId,
    shops,
    transactions,
    openCreditModal,
    openPaymentModal,
    openShopModal,
    openReminderModal,
    openTransactionDetails,
    refreshData,
    showToast
  } = useApp();

  const [confirmDeleteShop, setConfirmDeleteShop] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'PAYMENT'>('ALL');

  const shop = shops.find(s => s.id === selectedShopId);

  if (!shop) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 mb-4">দোকানটি খুঁজে পাওয়া যায়নি</p>
        <button
          onClick={() => setSelectedShopId(null)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm"
        >
          দোকানের তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  // Filter transactions for this shop
  const shopTransactions = transactions.filter(t => t.shopId === shop.id);
  const filteredTxs = shopTransactions.filter(t => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const handleDeleteShop = async () => {
    try {
      await shopRepository.deleteShop(shop.id, true);
      showToast(`"${shop.name}" দোকান এবং এর হিসাব মুছে ফেলা হয়েছে ✓`, 'success');
      await refreshData();
      setSelectedShopId(null);
    } catch (err) {
      console.error(err);
      showToast('দোকানটি মুছে ফেলা যায়নি।', 'error');
    }
  };

  const hasBalance = shop.balance > 0;
  const isSurplus = shop.balance < 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* TopBar with Back Button */}
      <TopBar
        title={shop.name}
        subtitle={shop.type || 'দোকানের খাতা'}
        showBack={true}
        onBack={() => setSelectedShopId(null)}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() => openReminderModal({
                id: '',
                shopId: shop.id,
                title: `${shop.name}-এর বাকি পরিশোধ`,
                amount: shop.balance > 0 ? shop.balance : undefined,
                dueDate: new Date().toISOString().split('T')[0],
                isCompleted: false,
                createdAt: ''
              })}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="তাগিদ / রিমাইন্ডার সেট করুন"
            >
              <Bell className="w-4 h-4 text-amber-500" />
            </button>
            <button
              onClick={() => openShopModal(shop)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="দোকানের তথ্য সম্পাদনা"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDeleteShop(true)}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="দোকান মুছে ফেলুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Outstanding Balance Banner */}
        <div className={`p-5 rounded-3xl border shadow-md text-center ${
          hasBalance
            ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
            : isSurplus
            ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60'
            : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
        }`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            {hasBalance ? 'বর্তমান বাকি' : isSurplus ? 'অগ্রিম জমা' : 'পরিশোধিত (সব বাকি চুকিয়ে দেওয়া হয়েছে)'}
          </span>
          <div className={`text-3xl sm:text-4xl font-black tracking-tight ${
            hasBalance
              ? 'text-rose-600 dark:text-rose-400'
              : isSurplus
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {formatTaka(Math.abs(shop.balance))}
          </div>

          <div className="flex justify-center gap-6 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
            <div>
              <span className="text-slate-400 block">মোট নিয়েছি</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatTaka(shop.totalCredit)}
              </span>
            </div>
            <div className="border-r border-slate-200 dark:border-slate-800" />
            <div>
              <span className="text-slate-400 block">মোট পরিশোধ</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatTaka(shop.totalPayment)}
              </span>
            </div>
          </div>
        </div>

        {/* Shop Contact / Details (if available) */}
        {(shop.phone || shop.address || shop.note) && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5">
            {shop.phone && (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${shop.phone}`} className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                  {shop.phone}
                </a>
              </div>
            )}
            {shop.address && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{shop.address}</span>
              </div>
            )}
            {shop.note && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{shop.note}</span>
              </div>
            )}
          </div>
        )}

        {/* 2 Primary Action Buttons: Add Credit / Add Payment */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openCreditModal(shop.id)}
            className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>বাকি যোগ করুন</span>
          </button>

          <button
            onClick={() => openPaymentModal(shop.id)}
            className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <HandCoins className="w-4 h-4" />
            <span>টাকা পরিশোধ</span>
          </button>
        </div>

        {/* Transaction History & Filter Pills */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              হিসাবের খাতা ({filteredTxs.length})
            </h3>

            {/* Filter pills */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-semibold">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterType === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                সব
              </button>
              <button
                onClick={() => setFilterType('CREDIT')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterType === 'CREDIT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                বাকি
              </button>
              <button
                onClick={() => setFilterType('PAYMENT')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterType === 'PAYMENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                পরিশোধ
              </button>
            </div>
          </div>

          {filteredTxs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এই দোকানে এখনো কোনো হিসাব লিপিবদ্ধ নেই
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden">
              {filteredTxs.map(tx => {
                const typeConfig = TRANSACTION_TYPES[tx.type] || TRANSACTION_TYPES.CREDIT;

                let title = '';
                if (tx.type === 'CREDIT') {
                  if (tx.items && tx.items.length > 0) {
                    title = tx.items.map(i => `${i.productName}${i.quantity ? ` (${i.quantity} ${i.unit || ''})` : ''}`).join(', ');
                  } else {
                    title = tx.note || 'বাকিতে ক্রয়';
                  }
                } else if (tx.type === 'PAYMENT') {
                  title = tx.paymentMethod ? `টাকা পরিশোধ (${tx.paymentMethod})` : 'টাকা পরিশোধ';
                } else {
                  title = 'সমন্বয় / ছাড়';
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
                          {title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{formatDateBangla(tx.date)}</span>
                          {tx.note && tx.type === 'CREDIT' && (
                            <span className="truncate max-w-[140px] text-slate-500">
                              • {tx.note}
                            </span>
                          )}
                        </div>
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

      {/* Delete Shop Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteShop}
        title="দোকান মুছে ফেলতে চান?"
        message={`আপনি কি "${shop.name}" দোকানটি মুছে ফেলতে চান? এতে এই দোকানের সমস্ত বাকি ও পরিশোধের হিসাবও মুছে যাবে!`}
        confirmText="হ্যাঁ, দোকান মুছুন"
        cancelText="না"
        isDestructive={true}
        onConfirm={handleDeleteShop}
        onCancel={() => setConfirmDeleteShop(false)}
      />
    </div>
  );
};
