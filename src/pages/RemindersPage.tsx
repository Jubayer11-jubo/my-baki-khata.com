import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/layout/TopBar';
import { reminderRepository } from '../database/repositories/reminderRepository';
import { notificationService } from '../services/notificationService';
import { formatTaka, formatDateBangla } from '../utils/formatters';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Trash2, 
  Edit2, 
  AlertCircle 
} from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { reminders, openReminderModal, refreshData, showToast, setActiveTab } = useApp();

  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>(() => 
    notificationService.getPermission()
  );

  const handleToggleStatus = async (id: string) => {
    try {
      const newStatus = await reminderRepository.toggleReminderStatus(id);
      showToast(newStatus ? 'তাগিদটি সম্পন্ন চিহ্নিত করা হয়েছে ✓' : 'তাগিদটি আবার সক্রিয় করা হয়েছে', 'info');
      await refreshData();
    } catch (e) {
      console.error(e);
      showToast('স্ট্যাটাস পরিবর্তন করা যায়নি।', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reminderRepository.deleteReminder(id);
      showToast('রিমাইন্ডার মুছে ফেলা হয়েছে ✓', 'success');
      await refreshData();
    } catch (e) {
      console.error(e);
      showToast('রিমাইন্ডার মুছে ফেলা যায়নি।', 'error');
    }
  };

  const handleEnableNotifications = async () => {
    const perm = await notificationService.requestPermission();
    setNotificationPerm(perm);
    if (perm === 'granted') {
      showToast('নোটিফিকেশন পারমিশন সক্রিয় হয়েছে ✓', 'success');
    } else {
      showToast('নোটিফিকেশন পারমিশন পাওয়া যায়নি।', 'error');
    }
  };

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="পরিশোধের তাগিদ ও রিমাইন্ডার"
        showBack={true}
        onBack={() => setActiveTab('home')}
        rightAction={
          <button
            onClick={() => openReminderModal()}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
            title="নতুন তাগিদ যোগ করুন"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন তাগিদ</span>
          </button>
        }
      />

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Notification Permission Banner (if not granted) */}
        {notificationService.isSupported() && notificationPerm !== 'granted' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 min-w-0">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>মোবাইলে যথাসময়ে নোটিফিকেশন পেতে পারমিশন দিন</span>
            </div>
            <button
              onClick={handleEnableNotifications}
              className="px-2.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 flex-shrink-0 shadow-xs"
            >
              অনুমতি দিন
            </button>
          </div>
        )}

        {/* Pending Reminders */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            বাকি পরিশোধের তাগিদ ({pendingReminders.length})
          </h3>

          {pendingReminders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                বর্তমানে কোনো আসন্ন পরিশোধের তাগিদ নেই
              </p>
              <button
                onClick={() => openReminderModal()}
                className="mt-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs hover:bg-amber-600"
              >
                + নতুন তাগিদ যোগ করুন
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingReminders.map(rem => (
                <div
                  key={rem.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleStatus(rem.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 flex-shrink-0"
                      title="পরিশোধ সম্পন্ন চিহ্নিত করুন"
                    >
                      <Circle className="w-5 h-5" />
                    </button>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {rem.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {rem.shopName}
                        </span>
                        {rem.amount && (
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            • {formatTaka(rem.amount)}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Calendar className="w-3 h-3" />
                          {formatDateBangla(rem.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openReminderModal(rem)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="সম্পাদনা"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div className="space-y-2.5 pt-3">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
              সম্পন্ন তাগিদ ({completedReminders.length})
            </h3>

            <div className="space-y-2 opacity-75">
              {completedReminders.map(rem => (
                <div
                  key={rem.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleStatus(rem.id)}
                      className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                      title="আবার সক্রিয় করুন"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div className="min-w-0">
                      <span className="line-through text-slate-400 font-medium truncate block">
                        {rem.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {rem.shopName} {rem.amount ? `• ${formatTaka(rem.amount)}` : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
