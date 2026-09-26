import { db } from '../db';
import type { Shop } from '../../types';

export const shopRepository = {
  async getAllShops(): Promise<Shop[]> {
    return await db.shops.reverse().sortBy('createdAt');
  },

  async getShopById(id: string): Promise<Shop | undefined> {
    return await db.shops.get(id);
  },

  async addShop(shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shop> {
    const now = new Date().toISOString();
    const newShop: Shop = {
      ...shopData,
      id: crypto.randomUUID ? crypto.randomUUID() : `shop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };

    await db.shops.add(newShop);
    return newShop;
  },

  async updateShop(id: string, updates: Partial<Omit<Shop, 'id' | 'createdAt'>>): Promise<void> {
    await db.shops.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteShop(id: string, cascade = true): Promise<void> {
    await db.transaction('rw', [db.shops, db.transactions, db.transaction_items, db.payments, db.reminders], async () => {
      await db.shops.delete(id);
      if (cascade) {
        // Delete all transactions and their items
        const shopTransactions = await db.transactions.where('shopId').equals(id).toArray();
        const txIds = shopTransactions.map(t => t.id);

        for (const txId of txIds) {
          await db.transaction_items.where('transactionId').equals(txId).delete();
        }

        await db.transactions.where('shopId').equals(id).delete();
        await db.payments.where('shopId').equals(id).delete();
        await db.reminders.where('shopId').equals(id).delete();
      }
    });
  },

  async searchShops(query: string): Promise<Shop[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAllShops();
    return await db.shops.filter(shop => 
      shop.name.toLowerCase().includes(q) ||
      (shop.type ? shop.type.toLowerCase().includes(q) : false) ||
      (shop.phone ? shop.phone.toLowerCase().includes(q) : false) ||
      (shop.address ? shop.address.toLowerCase().includes(q) : false)
    ).toArray();
  }
};
