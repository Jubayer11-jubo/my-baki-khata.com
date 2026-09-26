import { db } from '../db';
import type { Reminder } from '../../types';

export const reminderRepository = {
  async getAllReminders(): Promise<Reminder[]> {
    return await db.reminders.reverse().sortBy('dueDate');
  },

  async addReminder(data: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder> {
    const now = new Date().toISOString();
    const reminder: Reminder = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `rem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: now
    };
    await db.reminders.add(reminder);
    return reminder;
  },

  async toggleReminderStatus(id: string): Promise<boolean> {
    const existing = await db.reminders.get(id);
    if (!existing) return false;
    const newStatus = !existing.isCompleted;
    await db.reminders.update(id, { isCompleted: newStatus });
    return newStatus;
  },

  async updateReminder(id: string, updates: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Promise<void> {
    await db.reminders.update(id, updates);
  },

  async deleteReminder(id: string): Promise<void> {
    await db.reminders.delete(id);
  }
};
