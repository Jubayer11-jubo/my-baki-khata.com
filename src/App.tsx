import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { SplashScreen } from './components/common/SplashScreen';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ShopsPage } from './pages/ShopsPage';
import { ShopLedgerPage } from './pages/ShopLedgerPage';
import { SearchFilterPage } from './pages/SearchFilterPage';
import { ReportsPage } from './pages/ReportsPage';
import { RemindersPage } from './pages/RemindersPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

// Modals
import { ShopModal } from './components/shops/ShopModal';
import { CreditModal } from './components/transactions/CreditModal';
import { PaymentModal } from './components/transactions/PaymentModal';
import { TransactionDetailsModal } from './components/transactions/TransactionDetailsModal';
import { ReminderModal } from './components/reminders/ReminderModal';

const AppContent: React.FC = () => {
  const { isSplashDone, isOnboarding, activeTab, selectedShopId } = useApp();

  // 1. Splash Screen
  if (!isSplashDone) {
    return <SplashScreen />;
  }

  // 2. First-time Welcome screen
  if (isOnboarding) {
    return <WelcomePage />;
  }

  // 3. Shop Details / Ledger Screen (if a shop is selected)
  if (selectedShopId) {
    return (
      <AppShell>
        <ShopLedgerPage />
        <ShopModal />
        <CreditModal />
        <PaymentModal />
        <TransactionDetailsModal />
        <ReminderModal />
      </AppShell>
    );
  }

  // 4. Tab Routing
  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardPage />;
      case 'shops':
        return <ShopsPage />;
      case 'search':
        return <SearchFilterPage />;
      case 'reports':
        return <ReportsPage />;
      case 'reminders':
        return <RemindersPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppShell>
      {renderCurrentTab()}
      {/* Global Modals */}
      <ShopModal />
      <CreditModal />
      <PaymentModal />
      <TransactionDetailsModal />
      <ReminderModal />
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
