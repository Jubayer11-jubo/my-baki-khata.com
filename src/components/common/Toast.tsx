import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-11/12 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-top-4 ${
              isSuccess
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
                : isError
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/20'
                : 'bg-slate-900 text-white border-slate-700 shadow-slate-900/20'
            }`}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-100" />}
              {isError && <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-100" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 flex-shrink-0 text-slate-300" />}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
