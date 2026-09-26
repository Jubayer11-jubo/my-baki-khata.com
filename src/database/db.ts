import Dexie, { type Table } from 'dexie';
import type { 
  Shop, 
  Transaction, 
  TransactionItem, 
  Payment, 
  Reminder, 
  AppSetting 
} from '../types';

export class BakiKhataDatabase extends Dexie {
  shops!: Table<Shop, string>;
  transactions!: Table<Transaction, string>;
  transaction_items!: Table<TransactionItem, string>;
  payments!: Table<Payment, string>;
  reminders!: Table<Reminder, string>;
  settings!: Table<AppSetting, string>;
  app_metadata!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('BakiKhataDB');

    // Schema version 1
    this.version(1).stores({
      shops: 'id, name, type, createdAt, updatedAt',
      transactions: 'id, shopId, type, date, createdAt, updatedAt',
      transaction_items: 'id, transactionId, productName',
      payments: 'id, shopId, transactionId, date, createdAt',
      reminders: 'id, shopId, dueDate, isCompleted, createdAt',
      settings: 'key',
      app_metadata: 'key'
    });
  }
}

export const db = new BakiKhataDatabase();
