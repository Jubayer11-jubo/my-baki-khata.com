import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { transactionRepository } from '../../database/repositories/transactionRepository';
import { calculationService } from '../../services/calculationService';
import { getTodayDateString, formatTaka } from '../../utils/formatters';
import { COMMON_UNITS } from '../../constants';
import { X, Plus, Trash2, ShoppingBag, Check } from 'lucide-react';

interface ProductItemState {
  productName: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  totalPrice: string;
}

export const CreditModal: React.FC = () => {
  const { 
    creditModalOpen, 
    closeCreditModal, 
    shops, 
    targetShopIdForAction, 
    editingTransaction,
    refreshData, 
    showToast,
    openShopModal
  } = useApp();

  const [shopId, setShopId] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [items, setItems] = useState<ProductItemState[]>([
    { productName: '', quantity: '1', unit: 'কেজি', unitPrice: '', totalPrice: '' }
  ]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction && editingTransaction.type === 'CREDIT') {
      setShopId(editingTransaction.shopId);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');

      if (editingTransaction.items && editingTransaction.items.length > 0) {
        setItems(editingTransaction.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity ? String(item.quantity) : '1',
          unit: item.unit || 'কেজি',
          unitPrice: item.unitPrice ? String(item.unitPrice) : '',
          totalPrice: String(item.totalPrice)
        })));
      } else {
        setItems([{
          productName: editingTransaction.note || 'পণ্য',
          quantity: '1',
          unit: 'কেজি',
          unitPrice: String(editingTransaction.totalAmount),
          totalPrice: String(editingTransaction.totalAmount)
        }]);
      }
    } else {
      setShopId(targetShopIdForAction || (shops.length > 0 ? shops[0].id : ''));
      setDate(getTodayDateString());
      setNote('');
      setItems([
        { productName: '', quantity: '1', unit: 'কেজি', unitPrice: '', totalPrice: '' }
      ]);
    }
    setError('');
  }, [creditModalOpen, editingTransaction, targetShopIdForAction, shops]);

  if (!creditModalOpen) return null;

  const handleItemChange = (index: number, field: keyof ProductItemState, value: string) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    // Auto-calculate totalPrice if quantity and unitPrice exist
    if (field === 'quantity' || field === 'unitPrice') {
      const q = parseFloat(field === 'quantity' ? value : current.quantity);
      const p = parseFloat(field === 'unitPrice' ? value : current.unitPrice);
      if (!isNaN(q) && !isNaN(p) && q >= 0 && p >= 0) {
        current.totalPrice = String(calculationService.calculateItemTotal(q, p));
      }
    } else if (field === 'totalPrice') {
      // If user typed total price directly, update unit price if quantity is valid
      const t = parseFloat(value);
      const q = parseFloat(current.quantity);
      if (!isNaN(t) && !isNaN(q) && q > 0) {
        current.unitPrice = (t / q).toFixed(2).replace(/\.00$/, '');
      }
    }

    updated[index] = current;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      { productName: '', quantity: '1', unit: 'কেজি', unitPrice: '', totalPrice: '' }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) {
      // Just clear first row
      setItems([{ productName: '', quantity: '1', unit: 'কেজি', unitPrice: '', totalPrice: '' }]);
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate Grand Total across all rows
  const grandTotal = items.reduce((sum, item) => {
    const amt = parseFloat(item.totalPrice);
    return isNaN(amt) ? sum : sum + amt;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      setError('অনুগ্রহ করে একটি দোকান নির্বাচন করুন');
      return;
    }

    // Validate items
    const validItems: Array<{
      productName: string;
      quantity?: number;
      unit?: string;
      unitPrice?: number;
      totalPrice: number;
    }> = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const pName = item.productName.trim();
      const tPrice = parseFloat(item.totalPrice);

      if (!pName) {
        setError(`পণ্য নং ${i + 1}-এর নাম দেওয়া বাধ্যতামূলক`);
        return;
      }

      if (isNaN(tPrice) || tPrice <= 0) {
        setError(`পণ্য "${pName}"-এর সঠিক দাম দিন`);
        return;
      }

      const qty = parseFloat(item.quantity);
      const uPrice = parseFloat(item.unitPrice);

      validItems.push({
        productName: pName,
        quantity: isNaN(qty) ? undefined : qty,
        unit: item.unit.trim() || undefined,
        unitPrice: isNaN(uPrice) ? undefined : uPrice,
        totalPrice: tPrice
      });
    }

    if (validItems.length === 0) {
      setError('কমপক্ষে একটি পণ্যের হিসাব যোগ করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingTransaction) {
        await transactionRepository.updateCreditTransaction(editingTransaction.id, {
          shopId,
          date,
          items: validItems,
          note: note.trim() || undefined
        });
        showToast('হিসাব সফলভাবে আপডেট হয়েছে ✓', 'success');
      } else {
        await transactionRepository.addCreditTransaction({
          shopId,
          date,
          items: validItems,
          note: note.trim() || undefined
        });
        showToast('হিসাব সফলভাবে যোগ হয়েছে ✓', 'success');
      }

      await refreshData();
      closeCreditModal();
    } catch (err) {
      console.error(err);
      showToast('হিসাবটি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[94vh] flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {editingTransaction ? 'বাকি হিসাব সম্পাদনা' : 'নতুন বাকি যোগ করুন'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                দোকান থেকে বাকিতে কেনাকাটার বিবরণ
              </span>
            </div>
          </div>
          <button
            onClick={closeCreditModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Shop Selection & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  দোকান নির্বাচন করুন *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    closeCreditModal();
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
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">দোকান বেছে নিন</option>
                {shops.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({formatTaka(s.balance)} বাকি)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
          </div>

          {/* Multiple Products List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                পণ্যের তালিকা ({items.length} টি)
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                পণ্য যোগ করুন
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      পণ্য #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-md"
                        title="পণ্য সরান"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Product Name */}
                  <input
                    type="text"
                    value={item.productName}
                    onChange={e => handleItemChange(idx, 'productName', e.target.value)}
                    placeholder="পণ্যের নাম (যেমন: চাল, তেল, ডাল...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    required
                  />

                  {/* Quantity, Unit, Unit Price, Total Price in responsive row */}
                  <div className="grid grid-cols-4 gap-2">
                    {/* Qty */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">পরিমাণ</label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                        placeholder="1"
                        className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                      />
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">একক</label>
                      <select
                        value={item.unit}
                        onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                        className="w-full px-1.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                      >
                        {COMMON_UNITS.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">একক দাম (৳)</label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={item.unitPrice}
                        onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                        placeholder="160"
                        className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                      />
                    </div>

                    {/* Total Price */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">মোট (৳) *</label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={item.totalPrice}
                        onChange={e => handleItemChange(idx, 'totalPrice', e.target.value)}
                        placeholder="320"
                        className="w-full px-2 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 text-xs font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="যেমন: বিকেলে আনা হয়েছে, ভাই পাঠিয়েছে..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
            />
          </div>

          {/* Grand Total Summary Display */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
              সর্বমোট বাকি টাকা:
            </span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatTaka(grandTotal)}
            </span>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={closeCreditModal}
              className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting || grandTotal <= 0}
              className="w-2/3 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-600/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'হিসাব সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
