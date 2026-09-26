import { db } from '../database/db';
import type { BackupData, Shop, Transaction, TransactionItem, Payment, Reminder } from '../types';
import { APP_VERSION } from '../constants';

export const backupService = {
  /**
   * Export all database tables into a JSON file
   */
  async exportBackup(): Promise<string> {
    const shops = await db.shops.toArray();
    const transactions = await db.transactions.toArray();
    const transaction_items = await db.transaction_items.toArray();
    const payments = await db.payments.toArray();
    const reminders = await db.reminders.toArray();
    const settings = await db.settings.toArray();

    const settingsMap: Record<string, any> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    const backupData: BackupData = {
      app: 'আমার বাকি খাতা (My Baki Khat)',
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      shops,
      transactions,
      transaction_items,
      payments,
      reminders,
      settings: settingsMap
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `baki-khata-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return `baki-khata-backup-${today}.json`;
  },

  /**
   * Validate and restore backup JSON data
   */
  async restoreBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
    try {
      let data: any;
      try {
        data = JSON.parse(jsonString);
      } catch {
        return { success: false, message: 'ব্যাকআপ ফাইলটি সঠিক নয়। (ভুল ফরম্যাট)' };
      }

      // Validation
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'ব্যাকআপ ফাইলটি সঠিক নয়।' };
      }

      if (!Array.isArray(data.shops) || !Array.isArray(data.transactions)) {
        return { success: false, message: 'ব্যাকআপ ফাইলটি সঠিক নয়। প্রয়োজনীয় ডাটা অনুপস্থিত।' };
      }

      // Validate shop records
      for (const shop of data.shops) {
        if (!shop.id || !shop.name) {
          return { success: false, message: 'ব্যাকআপ ফাইলটিতে দোকানের তথ্যে ত্রুটি রয়েছে।' };
        }
      }

      // Validate transactions
      for (const tx of data.transactions) {
        if (!tx.id || !tx.shopId || !tx.type || typeof tx.totalAmount !== 'number') {
          return { success: false, message: 'ব্যাকআপ ফাইলটিতে হিসাব তথ্যে ত্রুটি রয়েছে।' };
        }
      }

      // Perform atomic restore in transaction
      await db.transaction('rw', [
        db.shops,
        db.transactions,
        db.transaction_items,
        db.payments,
        db.reminders,
        db.settings
      ], async () => {
        // Clear existing data
        await db.shops.clear();
        await db.transactions.clear();
        await db.transaction_items.clear();
        await db.payments.clear();
        await db.reminders.clear();

        // Restore shops
        if (data.shops.length > 0) {
          await db.shops.bulkAdd(data.shops);
        }

        // Restore transactions
        if (data.transactions.length > 0) {
          await db.transactions.bulkAdd(data.transactions);
        }

        // Restore items
        if (Array.isArray(data.transaction_items) && data.transaction_items.length > 0) {
          await db.transaction_items.bulkAdd(data.transaction_items);
        }

        // Restore payments
        if (Array.isArray(data.payments) && data.payments.length > 0) {
          await db.payments.bulkAdd(data.payments);
        }

        // Restore reminders
        if (Array.isArray(data.reminders) && data.reminders.length > 0) {
          await db.reminders.bulkAdd(data.reminders);
        }

        // Restore settings if present
        if (data.settings && typeof data.settings === 'object') {
          for (const [key, value] of Object.entries(data.settings)) {
            await db.settings.put({ key, value });
          }
        }
      });

      return { success: true, message: 'ডাটা সফলভাবে রিস্টোর হয়েছে ✓' };
    } catch (err: any) {
      console.error('Restore error:', err);
      return { success: false, message: 'হিসাবটি রিস্টোর করা যায়নি। ফাইলটি যাচাই করুন।' };
    }
  },

  /**
   * Export transactions as CSV for Excel / Google Sheets
   */
  async exportCSV(): Promise<string> {
    const shops = await db.shops.toArray();
    const shopMap = new Map(shops.map(s => [s.id, s.name]));

    const transactions = await db.transactions.reverse().sortBy('date');
    const items = await db.transaction_items.toArray();

    // Group items by transactionId
    const itemMap = new Map<string, TransactionItem[]>();
    for (const item of items) {
      const list = itemMap.get(item.transactionId) || [];
      list.push(item);
      itemMap.set(item.transactionId, list);
    }

    // CSV Headers
    const headers = ['তারিখ', 'দোকানের নাম', 'হিসাবের ধরন', 'পণ্য / বিবরণ', 'পরিমাণ', 'টাকা (৳)', 'পেমেন্ট মাধ্যম', 'নোট'];
    const rows: string[][] = [];

    for (const tx of transactions) {
      const shopName = shopMap.get(tx.shopId) || 'অজানা দোকান';
      const typeLabel = tx.type === 'CREDIT' ? 'বাকি নেওয়া' : tx.type === 'PAYMENT' ? 'পরিশোধ' : 'সমন্বয়';
      const txItems = itemMap.get(tx.id) || [];

      let productDetails = '';
      let qtyDetails = '';

      if (txItems.length > 0) {
        productDetails = txItems.map(i => i.productName).join('; ');
        qtyDetails = txItems.map(i => `${i.quantity || 1} ${i.unit || ''}`).join('; ');
      } else if (tx.note) {
        productDetails = tx.note;
      }

      rows.push([
        tx.date,
        `"${shopName.replace(/"/g, '""')}"`,
        `"${typeLabel}"`,
        `"${productDetails.replace(/"/g, '""')}"`,
        `"${qtyDetails.replace(/"/g, '""')}"`,
        String(tx.totalAmount),
        `"${tx.paymentMethod || ''}"`,
        `"${(tx.note || '').replace(/"/g, '""')}"`
      ]);
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `baki-khata-report-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return `baki-khata-report-${today}.csv`;
  },

  /**
   * Reset all database data with double confirmation
   */
  async resetAllData(): Promise<void> {
    await db.transaction('rw', [
      db.shops,
      db.transactions,
      db.transaction_items,
      db.payments,
      db.reminders,
      db.settings
    ], async () => {
      await db.shops.clear();
      await db.transactions.clear();
      await db.transaction_items.clear();
      await db.payments.clear();
      await db.reminders.clear();
      // Keep theme/onboarding or reset fully
      await db.settings.clear();
    });
  }
};
