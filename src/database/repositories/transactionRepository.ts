import { db } from '../db';
import type { 
  Transaction, 
  TransactionItem, 
  Payment, 
  TransactionType, 
  PaymentMethod,
  FilterOptions 
} from '../../types';

export const transactionRepository = {
  async getAllTransactions(): Promise<Transaction[]> {
    const list = await db.transactions.reverse().sortBy('date');
    // Attach items if available
    for (const t of list) {
      if (t.type === 'CREDIT') {
        t.items = await db.transaction_items.where('transactionId').equals(t.id).toArray();
      }
    }
    return list;
  },

  async getTransactionsByShop(shopId: string): Promise<Transaction[]> {
    const list = await db.transactions
      .where('shopId')
      .equals(shopId)
      .reverse()
      .sortBy('date');

    for (const t of list) {
      if (t.type === 'CREDIT') {
        t.items = await db.transaction_items.where('transactionId').equals(t.id).toArray();
      }
    }
    return list;
  },

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const transaction = await db.transactions.get(id);
    if (transaction && transaction.type === 'CREDIT') {
      transaction.items = await db.transaction_items.where('transactionId').equals(id).toArray();
    }
    return transaction;
  },

  async addCreditTransaction(params: {
    shopId: string;
    date: string;
    items: Array<Omit<TransactionItem, 'id' | 'transactionId'>>;
    note?: string;
  }): Promise<Transaction> {
    const now = new Date().toISOString();
    const txId = crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Safe integer/currency sum
    let totalPaisa = 0;
    const itemsToSave: TransactionItem[] = [];

    for (const item of params.items) {
      const itemPaisa = Math.round(Number(item.totalPrice || 0) * 100);
      totalPaisa += itemPaisa;

      itemsToSave.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        transactionId: txId,
        productName: item.productName.trim(),
        quantity: item.quantity ? Number(item.quantity) : undefined,
        unit: item.unit ? item.unit.trim() : undefined,
        unitPrice: item.unitPrice ? Number(item.unitPrice) : undefined,
        totalPrice: Number(item.totalPrice)
      });
    }

    const totalAmount = totalPaisa / 100;

    const transaction: Transaction = {
      id: txId,
      shopId: params.shopId,
      type: 'CREDIT',
      date: params.date,
      totalAmount,
      note: params.note ? params.note.trim() : undefined,
      items: itemsToSave,
      createdAt: now,
      updatedAt: now
    };

    await db.transaction('rw', [db.transactions, db.transaction_items], async () => {
      await db.transactions.add(transaction);
      for (const item of itemsToSave) {
        await db.transaction_items.add(item);
      }
    });

    return transaction;
  },

  async addPayment(params: {
    shopId: string;
    amount: number;
    date: string;
    method: PaymentMethod;
    note?: string;
  }): Promise<Transaction> {
    const now = new Date().toISOString();
    const txId = crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const payId = crypto.randomUUID ? crypto.randomUUID() : `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const paymentAmount = Math.round(Number(params.amount) * 100) / 100;

    const transaction: Transaction = {
      id: txId,
      shopId: params.shopId,
      type: 'PAYMENT',
      date: params.date,
      totalAmount: paymentAmount,
      paymentMethod: params.method,
      note: params.note ? params.note.trim() : undefined,
      createdAt: now,
      updatedAt: now
    };

    const payment: Payment = {
      id: payId,
      shopId: params.shopId,
      transactionId: txId,
      amount: paymentAmount,
      date: params.date,
      method: params.method,
      note: params.note ? params.note.trim() : undefined,
      createdAt: now
    };

    await db.transaction('rw', [db.transactions, db.payments], async () => {
      await db.transactions.add(transaction);
      await db.payments.add(payment);
    });

    return transaction;
  },

  async addAdjustment(params: {
    shopId: string;
    amount: number;
    date: string;
    note?: string;
  }): Promise<Transaction> {
    const now = new Date().toISOString();
    const txId = crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const totalAmount = Math.round(Number(params.amount) * 100) / 100;

    const transaction: Transaction = {
      id: txId,
      shopId: params.shopId,
      type: 'ADJUSTMENT',
      date: params.date,
      totalAmount,
      note: params.note ? params.note.trim() : undefined,
      createdAt: now,
      updatedAt: now
    };

    await db.transactions.add(transaction);
    return transaction;
  },

  async updateCreditTransaction(
    id: string,
    params: {
      shopId: string;
      date: string;
      items: Array<Omit<TransactionItem, 'id' | 'transactionId'>>;
      note?: string;
    }
  ): Promise<void> {
    const now = new Date().toISOString();
    let totalPaisa = 0;
    const itemsToSave: TransactionItem[] = [];

    for (const item of params.items) {
      const itemPaisa = Math.round(Number(item.totalPrice || 0) * 100);
      totalPaisa += itemPaisa;

      itemsToSave.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        transactionId: id,
        productName: item.productName.trim(),
        quantity: item.quantity ? Number(item.quantity) : undefined,
        unit: item.unit ? item.unit.trim() : undefined,
        unitPrice: item.unitPrice ? Number(item.unitPrice) : undefined,
        totalPrice: Number(item.totalPrice)
      });
    }

    const totalAmount = totalPaisa / 100;

    await db.transaction('rw', [db.transactions, db.transaction_items], async () => {
      await db.transactions.update(id, {
        shopId: params.shopId,
        date: params.date,
        totalAmount,
        note: params.note ? params.note.trim() : undefined,
        updatedAt: now
      });

      // Clear existing items and re-add
      await db.transaction_items.where('transactionId').equals(id).delete();
      for (const item of itemsToSave) {
        await db.transaction_items.add(item);
      }
    });
  },

  async updatePayment(
    id: string,
    params: {
      shopId: string;
      date: string;
      amount: number;
      method: PaymentMethod;
      note?: string;
    }
  ): Promise<void> {
    const now = new Date().toISOString();
    const paymentAmount = Math.round(Number(params.amount) * 100) / 100;

    await db.transaction('rw', [db.transactions, db.payments], async () => {
      await db.transactions.update(id, {
        shopId: params.shopId,
        date: params.date,
        totalAmount: paymentAmount,
        paymentMethod: params.method,
        note: params.note ? params.note.trim() : undefined,
        updatedAt: now
      });

      // Update matching payment record if exists
      const payment = await db.payments.where('transactionId').equals(id).first();
      if (payment) {
        await db.payments.update(payment.id, {
          shopId: params.shopId,
          date: params.date,
          amount: paymentAmount,
          method: params.method,
          note: params.note ? params.note.trim() : undefined
        });
      }
    });
  },

  async deleteTransaction(id: string): Promise<void> {
    await db.transaction('rw', [db.transactions, db.transaction_items, db.payments], async () => {
      await db.transactions.delete(id);
      await db.transaction_items.where('transactionId').equals(id).delete();
      await db.payments.where('transactionId').equals(id).delete();
    });
  },

  async filterTransactions(options: FilterOptions): Promise<Transaction[]> {
    let txs = await this.getAllTransactions();

    if (options.shopId && options.shopId !== 'ALL') {
      txs = txs.filter(t => t.shopId === options.shopId);
    }

    if (options.type && options.type !== 'ALL') {
      txs = txs.filter(t => t.type === options.type);
    }

    if (options.dateRange) {
      const now = new Date();
      if (options.dateRange === 'THIS_MONTH') {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const prefix = `${year}-${month}`;
        txs = txs.filter(t => t.date.startsWith(prefix));
      } else if (options.dateRange === 'LAST_MONTH') {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const year = lastMonthDate.getFullYear();
        const month = String(lastMonthDate.getMonth() + 1).padStart(2, '0');
        const prefix = `${year}-${month}`;
        txs = txs.filter(t => t.date.startsWith(prefix));
      } else if (options.dateRange === 'CUSTOM') {
        if (options.startDate) {
          txs = txs.filter(t => t.date >= options.startDate!);
        }
        if (options.endDate) {
          txs = txs.filter(t => t.date <= options.endDate!);
        }
      }
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.trim().toLowerCase();
      txs = txs.filter(t => {
        // match note
        if (t.note && t.note.toLowerCase().includes(q)) return true;
        // match amount
        if (String(t.totalAmount).includes(q)) return true;
        // match items
        if (t.items && t.items.some(item => item.productName.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    // Sort
    const sortBy = options.sortBy || 'NEWEST';
    txs.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
      } else if (sortBy === 'OLDEST') {
        return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
      } else if (sortBy === 'AMOUNT_DESC') {
        return b.totalAmount - a.totalAmount;
      } else if (sortBy === 'AMOUNT_ASC') {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

    return txs;
  }
};
