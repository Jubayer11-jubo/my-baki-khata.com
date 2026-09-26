import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { shopRepository } from '../../database/repositories/shopRepository';
import { COMMON_SHOP_TYPES } from '../../constants';
import { X, Store, Phone, MapPin, FileText, Check } from 'lucide-react';

export const ShopModal: React.FC = () => {
  const { shopModalOpen, closeShopModal, editingShop, refreshData, showToast } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingShop) {
      setName(editingShop.name || '');
      setType(editingShop.type || '');
      setPhone(editingShop.phone || '');
      setAddress(editingShop.address || '');
      setNote(editingShop.note || '');
    } else {
      setName('');
      setType('মুদি দোকান');
      setPhone('');
      setAddress('');
      setNote('');
    }
    setError('');
  }, [editingShop, shopModalOpen]);

  if (!shopModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('দোকানের নাম দেওয়া বাধ্যতামূলক');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingShop) {
        await shopRepository.updateShop(editingShop.id, {
          name: name.trim(),
          type: type.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          note: note.trim() || undefined
        });
        showToast('দোকানের তথ্য সফলভাবে আপডেট হয়েছে ✓', 'success');
      } else {
        await shopRepository.addShop({
          name: name.trim(),
          type: type.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          note: note.trim() || undefined
        });
        showToast('দোকান সফলভাবে যোগ হয়েছে ✓', 'success');
      }

      await refreshData();
      closeShopModal();
    } catch (err) {
      console.error(err);
      showToast('দোকানের তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {editingShop ? 'দোকানের তথ্য সম্পাদনা' : 'নতুন দোকান যোগ করুন'}
            </h3>
          </div>
          <button
            onClick={closeShopModal}
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
          {/* Shop Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              দোকানের নাম *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="যেমন: রহমান স্টোর, মা ফার্মেসি..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              required
              autoFocus
            />
          </div>

          {/* Shop Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              দোকানের ধরন
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            >
              <option value="">ধরন নির্বাচন করুন</option>
              {COMMON_SHOP_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              দোকানের মোবাইল নম্বর
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              দোকানের ঠিকানা / বাজার
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="যেমন: স্টেশন বাজার, ৩ নং গলি"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              নোট (ঐচ্ছিক)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="অতিরিক্ত কোনো তথ্য মনে রাখার জন্য..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-medium resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={closeShopModal}
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
              {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
