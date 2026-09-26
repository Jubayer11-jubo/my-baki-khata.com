import React from 'react';
import type { ShopWithBalance } from '../../types';
import { formatTaka, formatDateBangla } from '../../utils/formatters';
import { Store, ChevronRight, Calendar, Receipt } from 'lucide-react';

interface ShopCardProps {
  shop: ShopWithBalance;
  onClick: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick }) => {
  const hasBalance = shop.balance > 0;
  const isSurplus = shop.balance < 0;

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer active:scale-98"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon & Shop Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
              {shop.name}
            </h4>
            
            {shop.type && (
              <span className="inline-block text-xs text-slate-500 dark:text-slate-400 truncate">
                {shop.type}
              </span>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Receipt className="w-3 h-3 text-slate-400" />
                {shop.transactionCount} টি হিসাব
              </span>

              {shop.lastTransactionDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formatDateBangla(shop.lastTransactionDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Balance & Arrow */}
        <div className="text-right flex-shrink-0 flex items-center gap-2">
          <div>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {hasBalance ? 'বাকি' : isSurplus ? 'অগ্রিম' : 'পরিশোধিত'}
            </span>
            <span
              className={`text-base font-extrabold tracking-tight ${
                hasBalance
                  ? 'text-rose-600 dark:text-rose-400'
                  : isSurplus
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {formatTaka(Math.abs(shop.balance))}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        </div>
      </div>
    </div>
  );
};
