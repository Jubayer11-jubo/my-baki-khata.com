import { db } from '../database/db';
import type { Transaction, ShopWithBalance } from '../types';

export const calculationService = {
  /**
   * Calculate balance for a single shop based on all transactions.
   * CREDIT adds to balance (money owed)
   * PAYMENT subtracts from balance (money paid)
   * ADJUSTMENT: positive adds, negative subtracts
   */
  async calculateShopBalance(shopId: string): Promise<number> {
    const txs = await db.transactions.where('shopId').equals(shopId).toArray();
    let balancePaisa = 0;

    for (const t of txs) {
      const amountPaisa = Math.round(t.totalAmount * 100);
      if (t.type === 'CREDIT') {
        balancePaisa += amountPaisa;
      } else if (t.type === 'PAYMENT') {
        balancePaisa -= amountPaisa;
      } else if (t.type === 'ADJUSTMENT') {
        balancePaisa += amountPaisa;
      }
    }

    return balancePaisa / 100;
  },

  /**
   * Calculate total credit (purchases on debt) for a shop or across all shops
   */
  async calculateTotalCredit(shopId?: string): Promise<number> {
    let txs: Transaction[];
    if (shopId) {
      txs = await db.transactions.where('shopId').equals(shopId).toArray();
    } else {
      txs = await db.transactions.toArray();
    }

    let sumPaisa = 0;
    for (const t of txs) {
      if (t.type === 'CREDIT') {
        sumPaisa += Math.round(t.totalAmount * 100);
      }
    }
    return sumPaisa / 100;
  },

  /**
   * Calculate total payments made for a shop or across all shops
   */
  async calculateTotalPayments(shopId?: string): Promise<number> {
    let txs: Transaction[];
    if (shopId) {
      txs = await db.transactions.where('shopId').equals(shopId).toArray();
    } else {
      txs = await db.transactions.toArray();
    }

    let sumPaisa = 0;
    for (const t of txs) {
      if (t.type === 'PAYMENT') {
        sumPaisa += Math.round(t.totalAmount * 100);
      }
    }
    return sumPaisa / 100;
  },

  /**
   * Calculate overall net balance across all shops
   */
  async calculateOverallBalance(): Promise<number> {
    const txs = await db.transactions.toArray();
    let balancePaisa = 0;

    for (const t of txs) {
      const amountPaisa = Math.round(t.totalAmount * 100);
      if (t.type === 'CREDIT') {
        balancePaisa += amountPaisa;
      } else if (t.type === 'PAYMENT') {
        balancePaisa -= amountPaisa;
      } else if (t.type === 'ADJUSTMENT') {
        balancePaisa += amountPaisa;
      }
    }

    return balancePaisa / 100;
  },

  /**
   * Calculate spending (credit purchases) for a specific month (default: current month)
   */
  async calculateMonthlySpending(targetDate = new Date()): Promise<number> {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;

    const txs = await db.transactions.toArray();
    let sumPaisa = 0;

    for (const t of txs) {
      if (t.type === 'CREDIT' && t.date.startsWith(prefix)) {
        sumPaisa += Math.round(t.totalAmount * 100);
      }
    }

    return sumPaisa / 100;
  },

  /**
   * Calculate payments made for a specific month (default: current month)
   */
  async calculateMonthlyPayments(targetDate = new Date()): Promise<number> {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;

    const txs = await db.transactions.toArray();
    let sumPaisa = 0;

    for (const t of txs) {
      if (t.type === 'PAYMENT' && t.date.startsWith(prefix)) {
        sumPaisa += Math.round(t.totalAmount * 100);
      }
    }

    return sumPaisa / 100;
  },

  /**
   * Get all shops enriched with their calculated balances and metrics
   */
  async getShopsWithBalances(): Promise<ShopWithBalance[]> {
    const shops = await db.shops.toArray();
    const txs = await db.transactions.toArray();

    // Group transactions by shopId
    const shopTxMap = new Map<string, Transaction[]>();
    for (const t of txs) {
      const list = shopTxMap.get(t.shopId) || [];
      list.push(t);
      shopTxMap.set(t.shopId, list);
    }

    const result: ShopWithBalance[] = [];

    for (const shop of shops) {
      const shopTxs = shopTxMap.get(shop.id) || [];
      let balancePaisa = 0;
      let creditPaisa = 0;
      let paymentPaisa = 0;
      let lastDate: string | undefined = undefined;

      // Sort transactions to find latest date
      shopTxs.sort((a, b) => b.date.localeCompare(a.date));
      if (shopTxs.length > 0) {
        lastDate = shopTxs[0].date;
      }

      for (const t of shopTxs) {
        const amtPaisa = Math.round(t.totalAmount * 100);
        if (t.type === 'CREDIT') {
          creditPaisa += amtPaisa;
          balancePaisa += amtPaisa;
        } else if (t.type === 'PAYMENT') {
          paymentPaisa += amtPaisa;
          balancePaisa -= amtPaisa;
        } else if (t.type === 'ADJUSTMENT') {
          balancePaisa += amtPaisa;
        }
      }

      result.push({
        ...shop,
        balance: balancePaisa / 100,
        totalCredit: creditPaisa / 100,
        totalPayment: paymentPaisa / 100,
        transactionCount: shopTxs.length,
        lastTransactionDate: lastDate
      });
    }

    // Sort by outstanding balance descending, then created date
    result.sort((a, b) => b.balance - a.balance || b.createdAt.localeCompare(a.createdAt));
    return result;
  },

  /**
   * Get shop-wise spending breakdown for reports
   */
  async calculateShopSpendingBreakdown(): Promise<Array<{
    shopId: string;
    shopName: string;
    totalCredit: number;
    totalPayment: number;
    balance: number;
    percentage: number;
  }>> {
    const shopsWithBal = await this.getShopsWithBalances();
    const overallCredit = shopsWithBal.reduce((acc, s) => acc + s.totalCredit, 0);

    return shopsWithBal.map(s => ({
      shopId: s.id,
      shopName: s.name,
      totalCredit: s.totalCredit,
      totalPayment: s.totalPayment,
      balance: s.balance,
      percentage: overallCredit > 0 ? Math.round((s.totalCredit / overallCredit) * 100) : 0
    }));
  },

  /**
   * Get month-by-month spending history for last 6 months
   */
  async getMonthlyHistory(monthCount = 6): Promise<Array<{
    monthKey: string; // e.g. "2026-09"
    monthLabel: string; // e.g. "সেপ্টেম্বর"
    credit: number;
    payment: number;
  }>> {
    const bengaliMonthNames = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const txs = await db.transactions.toArray();
    const now = new Date();
    const result = [];

    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
      const monthLabel = `${bengaliMonthNames[d.getMonth()]}`;

      let creditPaisa = 0;
      let paymentPaisa = 0;

      for (const t of txs) {
        if (t.date.startsWith(monthKey)) {
          const amt = Math.round(t.totalAmount * 100);
          if (t.type === 'CREDIT') creditPaisa += amt;
          else if (t.type === 'PAYMENT') paymentPaisa += amt;
        }
      }

      result.push({
        monthKey,
        monthLabel,
        credit: creditPaisa / 100,
        payment: paymentPaisa / 100
      });
    }

    return result;
  },

  /**
   * Helper to safely calculate item line totals
   */
  calculateItemTotal(quantity?: number, unitPrice?: number): number {
    if (!quantity || !unitPrice || isNaN(quantity) || isNaN(unitPrice)) return 0;
    const paisa = Math.round(quantity * unitPrice * 100);
    return paisa / 100;
  }
};
