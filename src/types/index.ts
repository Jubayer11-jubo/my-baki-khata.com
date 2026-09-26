export type TransactionType = 'CREDIT' | 'PAYMENT' | 'ADJUSTMENT';

export type PaymentMethod = 'CASH' | 'BKASH' | 'NAGAD' | 'BANK' | 'OTHER';

export interface Shop {
  id: string;
  name: string;
  type?: string;
  phone?: string;
  address?: string;
  note?: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productName: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice: number;
}

export interface Transaction {
  id: string;
  shopId: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  totalAmount: number;
  note?: string;
  paymentMethod?: PaymentMethod;
  items?: TransactionItem[];
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface Payment {
  id: string;
  shopId: string;
  transactionId?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  note?: string;
  createdAt: string; // ISO String
}

export interface Reminder {
  id: string;
  shopId: string;
  shopName?: string;
  title: string;
  amount?: number;
  dueDate: string; // YYYY-MM-DD
  isCompleted: boolean;
  note?: string;
  createdAt: string; // ISO String
}

export interface AppSetting {
  key: string;
  value: any;
}

export interface ShopWithBalance extends Shop {
  balance: number;
  totalCredit: number;
  totalPayment: number;
  transactionCount: number;
  lastTransactionDate?: string;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  app: string;
  shops: Shop[];
  transactions: Transaction[];
  transaction_items: TransactionItem[];
  payments: Payment[];
  reminders: Reminder[];
  settings?: Record<string, any>;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageMode = 'bn' | 'en';

export interface FilterOptions {
  shopId?: string;
  type?: TransactionType | 'ALL';
  dateRange?: 'THIS_MONTH' | 'LAST_MONTH' | 'ALL_TIME' | 'CUSTOM';
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  sortBy?: 'NEWEST' | 'OLDEST' | 'AMOUNT_DESC' | 'AMOUNT_ASC';
}
