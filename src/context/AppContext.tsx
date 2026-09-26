import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Shop, 
  ShopWithBalance, 
  Transaction, 
  Reminder, 
  ThemeMode 
} from '../types';
import { shopRepository } from '../database/repositories/shopRepository';
import { transactionRepository } from '../database/repositories/transactionRepository';
import { reminderRepository } from '../database/repositories/reminderRepository';
import { settingsRepository } from '../database/repositories/settingsRepository';
import { calculationService } from '../services/calculationService';
import { notificationService } from '../services/notificationService';
import { useTheme } from '../hooks/useTheme';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation & Screen State
  activeTab: 'home' | 'shops' | 'search' | 'reports' | 'settings' | 'reminders' | 'about';
  setActiveTab: (tab: 'home' | 'shops' | 'search' | 'reports' | 'settings' | 'reminders' | 'about') => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;

  // Onboarding & Splash
  isOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  isSplashDone: boolean;

  // Data
  shops: ShopWithBalance[];
  transactions: Transaction[];
  reminders: Reminder[];
  overallBalance: number;
  monthlyCredit: number;
  monthlyPayment: number;
  totalCredit: number;
  totalPayment: number;
  loading: boolean;
  refreshData: () => Promise<void>;

  // Modals & Action Sheets
  creditModalOpen: boolean;
  openCreditModal: (shopId?: string, editTx?: Transaction) => void;
  closeCreditModal: () => void;
  
  paymentModalOpen: boolean;
  openPaymentModal: (shopId?: string, editTx?: Transaction) => void;
  closePaymentModal: () => void;

  shopModalOpen: boolean;
  openShopModal: (editShop?: Shop) => void;
  closeShopModal: () => void;

  reminderModalOpen: boolean;
  openReminderModal: (editReminder?: Reminder) => void;
  closeReminderModal: () => void;

  transactionDetailsId: string | null;
  openTransactionDetails: (txId: string) => void;
  closeTransactionDetails: () => void;

  targetShopIdForAction: string | null;
  editingTransaction: Transaction | null;
  editingShop: Shop | null;
  editingReminder: Reminder | null;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'shops' | 'search' | 'reports' | 'settings' | 'reminders' | 'about'>('home');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isSplashDone, setIsSplashDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // App Data
  const [shops, setShops] = useState<ShopWithBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [overallBalance, setOverallBalance] = useState<number>(0);
  const [monthlyCredit, setMonthlyCredit] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  // Modals
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [transactionDetailsId, setTransactionDetailsId] = useState<string | null>(null);

  const [targetShopIdForAction, setTargetShopIdForAction] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme hook
  const { theme, setTheme } = useTheme();

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Refresh all state from Dexie
  const refreshData = useCallback(async () => {
    try {
      const [shopsData, txData, remData, ovBal, mCredit, mPay, tCredit, tPay] = await Promise.all([
        calculationService.getShopsWithBalances(),
        transactionRepository.getAllTransactions(),
        reminderRepository.getAllReminders(),
        calculationService.calculateOverallBalance(),
        calculationService.calculateMonthlySpending(),
        calculationService.calculateMonthlyPayments(),
        calculationService.calculateTotalCredit(),
        calculationService.calculateTotalPayments()
      ]);

      // Enrich reminders with shopName
      const shopMap = new Map(shopsData.map(s => [s.id, s.name]));
      const enrichedReminders = remData.map(r => ({
        ...r,
        shopName: shopMap.get(r.shopId) || 'অজানা দোকান'
      }));

      setShops(shopsData);
      setTransactions(txData);
      setReminders(enrichedReminders);
      setOverallBalance(ovBal);
      setMonthlyCredit(mCredit);
      setMonthlyPayment(mPay);
      setTotalCredit(tCredit);
      setTotalPayment(tPay);

      // Check due reminders for notifications
      notificationService.checkDueReminders(enrichedReminders);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialization check
  useEffect(() => {
    const init = async () => {
      const completed = await settingsRepository.isOnboardingCompleted();
      setIsOnboarding(!completed);
      await refreshData();

      // Brief branded splash screen
      const timer = setTimeout(() => {
        setIsSplashDone(true);
      }, 700);

      return () => clearTimeout(timer);
    };

    init();
  }, [refreshData]);

  const completeOnboarding = async () => {
    await settingsRepository.setOnboardingCompleted(true);
    setIsOnboarding(false);
  };

  const openCreditModal = (shopId?: string, editTx?: Transaction) => {
    setTargetShopIdForAction(shopId || null);
    setEditingTransaction(editTx || null);
    setCreditModalOpen(true);
  };

  const closeCreditModal = () => {
    setCreditModalOpen(false);
    setTargetShopIdForAction(null);
    setEditingTransaction(null);
  };

  const openPaymentModal = (shopId?: string, editTx?: Transaction) => {
    setTargetShopIdForAction(shopId || null);
    setEditingTransaction(editTx || null);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setTargetShopIdForAction(null);
    setEditingTransaction(null);
  };

  const openShopModal = (editShop?: Shop) => {
    setEditingShop(editShop || null);
    setShopModalOpen(true);
  };

  const closeShopModal = () => {
    setShopModalOpen(false);
    setEditingShop(null);
  };

  const openReminderModal = (editReminder?: Reminder) => {
    setEditingReminder(editReminder || null);
    setReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setReminderModalOpen(false);
    setEditingReminder(null);
  };

  const openTransactionDetails = (txId: string) => {
    setTransactionDetailsId(txId);
  };

  const closeTransactionDetails = () => {
    setTransactionDetailsId(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedShopId,
        setSelectedShopId,
        isOnboarding,
        completeOnboarding,
        isSplashDone,
        shops,
        transactions,
        reminders,
        overallBalance,
        monthlyCredit,
        monthlyPayment,
        totalCredit,
        totalPayment,
        loading,
        refreshData,
        creditModalOpen,
        openCreditModal,
        closeCreditModal,
        paymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        shopModalOpen,
        openShopModal,
        closeShopModal,
        reminderModalOpen,
        openReminderModal,
        closeReminderModal,
        transactionDetailsId,
        openTransactionDetails,
        closeTransactionDetails,
        targetShopIdForAction,
        editingTransaction,
        editingShop,
        editingReminder,
        toasts,
        showToast,
        removeToast,
        theme,
        setTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
