import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { transactionRepository } from '../../database/repositories/transactionRepository';
import { getTodayDateString, formatTaka } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../constants';
import type { PaymentMethod } from '../../types';
import { X, HandCoins, Check, Calendar, CreditCard, FileText } from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    paymentModalOpen,
    closePaymentModal,
    shops,
    targetShopIdForAction,
    editingTransaction,
    refreshData,
    showToast,
    openShopModal
  } = useApp();

  const [shopId, setShopId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction && editingTransaction.type === 'PAYMENT') {
      setShopId(editingTransaction.shopId);
      setAmount(String(editingTransaction.totalAmount));
      setDate(editingTransaction.date);
      setMethod(editingTransaction.paymentMethod || 'CASH');
      setNote(editingTransaction.note || '');
    } else {
      setShopId(targetShopIdForAction || (shops.length > 0 ? shops[0].id : ''));
      setAmount('');
      setDate(getTodayDateString());
      setMethod('CASH');
      setNote('');
    }
    setError('');
  }, [paymentModalOpen, editingTransaction, targetShopIdForAction, shops]);

  if (!paymentModalOpen) return null;

  const selectedShop = shops.find(s => s.id === shopId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      setError('দোকান নির্বাচন করুন');
      return;
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      setError('পরিশোধের সঠিক টাকার পরিমাণ দিন');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingTransaction) {
        await transactionRepository.updatePayment(editingTransaction.id, {
          shopId,
          date,
          amount: payAmount,
          method,
          note: note.trim() || undefined
        });
        showToast('পরিশোধের তথ্য আপডেট হয়েছে ✓', 'success');
      } else {
        await transactionRepository.addPayment({
          shopId,
          date,
          amount: payAmount,
          method,
          note: note.trim() || undefined
        });
        showToast('পরিশোধের হিসাব যোগ হয়েছে ✓', 'success');
      }

      await refreshData();
      closePaymentModal();
    } catch (err) {
      console.error(err);
      showToast('পরিশোধ সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {editingTransaction ? 'পরিশোধের হিসাব সম্পাদনা' : 'টাকা পরিশোধ'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                দোকানদারকে দেওয়া বাকি টাকার হিসাব
              </span>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shop Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                দোকান নির্বাচন করুন *
              </label>
              <button
                type="button"
                onClick={() => {
                  closePaymentModal();
                  openShopModal();
                }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + নতুন দোকান
              </button>
            </div>
            <select
              value={shopId}
              onChange={e => setShopId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">দোকান বেছে নিন</option>
              {shops.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({formatTaka(s.balance)} বাকি)
                </option>
              ))}
            </select>

            {/* Current Balance Banner for Selected Shop */}
            {selectedShop && (
              <div className="mt-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>এই দোকানে বর্তমান বাকি:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatTaka(selectedShop.balance)}
                </span>
              </div>
            )}
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              পরিশোধের পরিমাণ (৳) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ৳
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                placeholder="0"
                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-extrabold focus:ring-2 focus:ring-emerald-500"
                required
                autoFocus
              />
            </div>
            {/* Quick quick amount pills */}
            {selectedShop && selectedShop.balance > 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAmount(String(selectedShop.balance))}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                >
                  সব বাকি পরিশোধ ({formatTaka(selectedShop.balance)})
                </button>
              </div>
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                তারিখ *
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                পেমেন্ট মাধ্যম
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              নোট / মন্তব্য (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="যেমন: বিকাশে পাঠানো হয়েছে, ট্রানজ্যাকশন আইডি..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={closePaymentModal}
              className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'পরিশোধ সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
