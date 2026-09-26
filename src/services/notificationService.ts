import type { Reminder } from '../types';

export const notificationService = {
  isSupported(): boolean {
    return 'Notification' in window;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    return await Notification.requestPermission();
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  showNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        ...options
      });
      return true;
    } catch (e) {
      console.warn('Could not trigger notification:', e);
      return false;
    }
  },

  checkDueReminders(reminders: Reminder[]): void {
    const today = new Date().toISOString().split('T')[0];
    const dueReminders = reminders.filter(r => !r.isCompleted && r.dueDate <= today);

    for (const r of dueReminders) {
      this.showNotification(`বাকি পরিশোধের তাগিদ: ${r.title}`, {
        body: `${r.shopName || 'দোকান'} - ${r.amount ? `৳${r.amount}` : ''} পরিশোধের তারিখ আজ।`,
        tag: `reminder-${r.id}`
      });
    }
  }
};
