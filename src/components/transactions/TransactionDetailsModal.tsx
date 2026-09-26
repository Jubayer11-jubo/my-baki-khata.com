import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { transactionRepository } from '../../database/repositories/transactionRepository';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatTaka, formatDateBangla, formatTimeBangla } from '../../utils/formatters';
import { TRANSACTION_TYPES } from '../../constants';
import { X, Edit2, Trash2, Store, Calendar, Clock, FileText, CreditCard } from 'lucide-react';

export const TransactionDetailsModal: React.FC = () => {
  const {
    transactionDetailsId,
    closeTransactionDetails,
    transactions,
    shops,
    openCreditModal,
    openPaymentModal,
    refreshData,
    showToast
  } = useApp();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!transactionDetailsId) return null;

  const transaction = transactions.find(t => t.id === transactionDetailsId);
  if (!transaction) return null;

  const shop = shops.find(s => s.id === transaction.shopId);
  const typeConfig = TRANSACTION_TYPES[transaction.type] || TRANSACTION_TYPES.CREDIT;

  const handleEdit = () => {
    closeTransactionDetails();
    if (transaction.type === 'CREDIT') {
      openCreditModal(transaction.shopId, transaction);
    } else if (transaction.type === 'PAYMENT') {
      openPaymentModal(transaction.shopId, transaction);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await transactionRepository.deleteTransaction(transaction.id);
      showToast('হিসাবটি সফলভাবে মুছে ফেলা হয়েছে ✓', 'success');
      await refreshData();
      setConfirmDeleteOpen(false);
      closeTransactionDetails();
    } catch (err) {
      console.error(err);
      showToast('হিসাবটি মুছে ফেলা যায়নি।', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div 
          className="w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}>
                {typeConfig.sign} {typeConfig.label}
              </span>
            </div>
            <button
              onClick={closeTransactionDetails}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Hero */}
          <div className="text-center py-3 mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
              মোট পরিমাণ
            </span>
            <div className={`text-3xl font-extrabold ${typeConfig.color}`}>
              {typeConfig.sign} {formatTaka(transaction.totalAmount)}
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3.5 mb-6 text-sm">
            {/* Shop */}
            <div className="flex items-start gap-3">
              <Store className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">দোকান</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {shop ? shop.name : 'অজানা দোকান'}
                </span>
                {shop?.type && <span className="text-xs text-slate-400 ml-1.5">({shop.type})</span>}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">তারিখ</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateBangla(transaction.date)}
                  </span>
                </div>
              </div>

              {transaction.createdAt && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">সময়</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatTimeBangla(transaction.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method (if PAYMENT) */}
            {transaction.type === 'PAYMENT' && transaction.paymentMethod && (
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">পরিশোধের মাধ্যম</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {transaction.paymentMethod}
                  </span>
                </div>
              </div>
            )}

            {/* Product items (if CREDIT) */}
            {transaction.type === 'CREDIT' && transaction.items && transaction.items.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                  পণ্যের বিস্তারিত তালিকা:
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
                  {transaction.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">
                          {item.productName}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {item.quantity ? `${item.quantity} ${item.unit || ''}` : ''}
                          {item.unitPrice ? ` × ৳${item.unitPrice}` : ''}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {formatTaka(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {transaction.note && (
              <div className="flex items-start gap-3 pt-1">
                <FileText className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">নোট</span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {transaction.note}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Edit & Delete */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={isDeleting}
              className="py-3 px-4 rounded-2xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              মুছে ফেলুন
            </button>

            <button
              onClick={handleEdit}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              সম্পাদনা
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="হিসাব মুছে ফেলতে চান?"
        message="আপনি কি এই হিসাবটি মুছে ফেলতে চান? মুছে ফেললে দোকানের বাকি হিসেবে তা সমন্বয় হয়ে যাবে।"
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="না"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
};
