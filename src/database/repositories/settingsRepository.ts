import { db } from '../db';

export const settingsRepository = {
  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const item = await db.settings.get(key);
    return item ? (item.value as T) : defaultValue;
  },

  async setSetting(key: string, value: any): Promise<void> {
    await db.settings.put({ key, value });
  },

  async isOnboardingCompleted(): Promise<boolean> {
    return await this.getSetting<boolean>('onboarding_completed', false);
  },

  async setOnboardingCompleted(completed = true): Promise<void> {
    await this.setSetting('onboarding_completed', completed);
  }
};
