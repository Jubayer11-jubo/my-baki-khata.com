import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { reminderRepository } from '../../database/repositories/reminderRepository';
import { notificationService } from '../../services/notificationService';
import { getTodayDateString, formatTaka } from '../../utils/formatters';
import { X, Bell, Calendar, Store, Check } from 'lucide-react';

export const ReminderModal: React.FC = () => {
  const {
    reminderModalOpen,
    closeReminderModal,
    shops,
    editingReminder,
    refreshData,
    showToast
  } = useApp();

  const [shopId, setShopId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingReminder) {
      setShopId(editingReminder.shopId);
      setTitle(editingReminder.title);
      setAmount(editingReminder.amount ? String(editingReminder.amount) : '');
      setDueDate(editingReminder.dueDate);
      setNote(editingReminder.note || '');
    } else {
      setShopId(shops.length > 0 ? shops[0].id : '');
      setTitle('');
      setAmount('');
      setDueDate(getTodayDateString());
      setNote('');
    }
    setError('');
  }, [reminderModalOpen, editingReminder, shops]);

  if (!reminderModalOpen) return null;

  const handleShopChange = (selectedId: string) => {
    setShopId(selectedId);
    const shop = shops.find(s => s.id === selectedId);
    if (shop && !title) {
      setTitle(`${shop.name}-এর বাকি পরিশোধ করতে হবে`);
      if (shop.balance > 0 && !amount) {
        setAmount(String(shop.balance));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      setError('দোকান নির্বাচন করুন');
      return;
    }
    if (!title.trim()) {
      setError('রিমাইন্ডারের শিরোনাম দিন');
      return;
    }

    try {
      setIsSubmitting(true);
      // Ask for notification permission if not asked yet
      if (notificationService.isSupported() && notificationService.getPermission() === 'default') {
        await notificationService.requestPermission();
      }

      const parsedAmount = amount ? parseFloat(amount) : undefined;

      if (editingReminder) {
        await reminderRepository.updateReminder(editingReminder.id, {
          shopId,
          title: title.trim(),
          amount: parsedAmount,
          dueDate,
          note: note.trim() || undefined
        });
        showToast('রিমাইন্ডার সফলভাবে আপডেট হয়েছে ✓', 'success');
      } else {
        await reminderRepository.addReminder({
          shopId,
          title: title.trim(),
          amount: parsedAmount,
          dueDate,
          isCompleted: false,
          note: note.trim() || undefined
        });
        showToast('রিমাইন্ডার সফলভাবে যোগ হয়েছে ✓', 'success');
      }

      await refreshData();
      closeReminderModal();
    } catch (err) {
      console.error(err);
      showToast('রিমাইন্ডার সংরক্ষণ করা যায়নি।', 'error');
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
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {editingReminder ? 'রিমাইন্ডার সম্পাদনা' : 'নতুন বাকি পরিশোধের তাগিদ'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                কখন কোন দোকানের বাকি দিতে হবে মনে রাখুন
              </span>
            </div>
          </div>
          <button
            onClick={closeReminderModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
          {/* Shop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              দোকান নির্বাচন করুন *
            </label>
            <select
              value={shopId}
              onChange={e => handleShopChange(e.target.value)}
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
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              বিবরণ / শিরোনাম *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="যেমন: চালের বাকি পরিশোধ করতে হবে"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Amount & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                টাকার পরিমাণ (৳)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                তারিখ *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                required
              />
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
              placeholder="অতিরিক্ত কোনো তথ্য..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={closeReminderModal}
              className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md shadow-amber-600/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'রিমাইন্ডার সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
