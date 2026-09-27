/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Coffee,
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  NotebookTabs,
  Package,
  BadgeCheck,
  BarChart3,
  BadgePercent,
  Settings,
  Menu,
  X,
  Search,
  Coins,
  Table,
  Moon,
  Sun,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

import {
  ActiveView,
  Language,
  Product,
  InventoryItem,
  Employee,
  Order,
  OrderStatus
} from './types';

import {
  initialProducts,
  initialInventory,
  initialEmployees,
  initialOrders
} from './data/initialData';

import { translations } from './i18n/translations';

// Components & Views
import { DashboardView } from './views/DashboardView';
import { POSView } from './views/POSView';
import { OrdersView } from './views/OrdersView';
import { MenuView } from './views/MenuView';
import { InventoryView } from './views/InventoryView';
import { EmployeesView } from './views/EmployeesView';
import { ReportsView } from './views/ReportsView';
import { PromotionsView } from './views/PromotionsView';
import { SettingsView } from './views/SettingsView';

// Modals
import { ReceiptModal } from './components/ReceiptModal';
import { KHQRModal } from './components/KHQRModal';
import { AddProductModal, AddEmployeeModal, EditOrderModal } from './components/Modals';

export default function App() {
  // Navigation & Language & Theme
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('bb_language') as Language) || 'kh';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('bb_theme') === 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Core App Data (synced with localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bb_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('bb_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('bb_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bb_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('bb_exchange_rate');
    return saved ? Number(saved) : 4100;
  });

  const [shopName, setShopName] = useState<string>(() => {
    return localStorage.getItem('bb_shop_name') || 'Bean & Bloom Coffee Roasters';
  });

  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('bb_apps_script_url') || '';
  });

  // Modals & Feedback
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  const [khqrModalOpen, setKhqrModalOpen] = useState(false);
  const [khqrAmount, setKhqrAmount] = useState<number>(0);

  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

  const [editOrderModalOpen, setEditOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const t = translations[language];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('bb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bb_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('bb_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('bb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bb_exchange_rate', exchangeRate.toString());
  }, [exchangeRate]);

  useEffect(() => {
    localStorage.setItem('bb_shop_name', shopName);
  }, [shopName]);

  useEffect(() => {
    localStorage.setItem('bb_apps_script_url', appsScriptUrl);
  }, [appsScriptUrl]);

  useEffect(() => {
    localStorage.setItem('bb_language', language);
    document.documentElement.lang = language === 'kh' ? 'km' : 'en';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('bb_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 2800);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'kh' ? 'en' : 'kh';
      showToast(next === 'kh' ? 'បានប្តូរទៅជាភាសាខ្មែរ' : 'Switched to English');
      return next;
    });
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      showToast(next ? 'Dark Mode' : 'Light Mode');
      return next;
    });
  };

  // Google Sheets sync simulation & real fetch if URL is set
  const syncWithSheet = async () => {
    setIsSyncing(true);
    showToast('កំពុងភ្ជាប់ & Sync ជាមួយ Google Sheet...');

    if (appsScriptUrl && appsScriptUrl.startsWith('http')) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'syncAll',
            payload: { products, inventory, employees, orders, exchangeRate }
          })
        });
      } catch (err) {
        console.warn('Network sync error:', err);
      }
    }

    setTimeout(() => {
      setIsSyncing(false);
      showToast('បាន Sync ទិន្នន័យទៅកាន់ Google Sheet ជោគជ័យ!');
    }, 900);
  };

  // POS Checkout Handler
  const handleCheckoutComplete = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setActiveReceiptOrder(newOrder);
    setReceiptModalOpen(true);
    showToast(`ការបញ្ជាទិញ #${newOrder.id} ត្រូវបានកត់ត្រា និង Sync!`);

    // Async sync in background
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'newOrder', payload: newOrder })
      }).catch(() => {});
    }
  };

  const handleOpenKHQR = (amount: number) => {
    setKhqrAmount(amount);
    setKhqrModalOpen(true);
  };

  const handleConfirmKHQR = () => {
    setKhqrModalOpen(false);
    const newOrderId = "CS-" + Math.floor(2000 + Math.random() * 8000);
    const newOrder: Order = {
      id: newOrderId,
      customer: "ភ្ញៀវស្កេន KHQR (Bakong)",
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: "Completed",
      payment: "QR Pay",
      total: Number(khqrAmount.toFixed(2)),
      totalKhr: Math.round(khqrAmount * exchangeRate),
      notes: "KHQR Bakong Mobile Payment"
    };
    handleCheckoutComplete(newOrder);
  };

  // Orders handlers
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditOrderModalOpen(true);
  };

  const handleSaveOrderStatus = (orderId: string, status: OrderStatus, notes: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, notes } : o));
    showToast(`បានកែប្រែស្ថានភាព #${orderId} ទៅជា ${status}!`);
  };

  const handleViewReceipt = (order: Order) => {
    setActiveReceiptOrder(order);
    setReceiptModalOpen(true);
  };

  // Menu handlers
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProductData,
      id: "prod-" + Date.now()
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`បានបន្ថែម "${newProd.name}" ចូល Menu!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('បានលុបទំនិញពី Menu Google Sheet!');
  };

  // Inventory handlers
  const handleAddInventory = (newItemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: "inv-" + Date.now()
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`បានបន្ថែម "${newItem.name}" ចូលស្តុក!`);
  };

  const handleUpdateInventoryQty = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextQty = Math.max(0, item.quantity + delta);
      let nextStatus = item.status;
      if (nextQty === 0) nextStatus = 'Sold out';
      else if (nextQty <= 3) nextStatus = 'Low stock';
      else nextStatus = 'Available';
      return { ...item, quantity: nextQty, status: nextStatus };
    }));
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    showToast('បានលុបទំនិញពីស្តុក!');
  };

  // Employee handlers
  const handleAddEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: "emp-" + Date.now()
    };
    setEmployees(prev => [...prev, newEmp]);
    showToast(`បានបន្ថែមបុគ្គលិក "${newEmp.name}"!`);
  };

  const handleToggleEmployeeClock = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== id) return emp;
      const nextState = !emp.clockedIn;
      showToast(`${emp.name}: ${nextState ? 'On Duty' : 'Off Duty'}`);
      return { ...emp, clockedIn: nextState };
    }));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast('បានលុបបុគ្គលិក!');
  };

  // Settings handlers
  const handleUpdateSettings = (newRate: number, newName: string, newUrl: string) => {
    setExchangeRate(newRate);
    setShopName(newName);
    setAppsScriptUrl(newUrl);
    showToast('បានរក្សាទុកការកំណត់ និងអត្រាប្តូរប្រាក់!');
  };

  const handleExportJsonBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      shopName,
      exchangeRate,
      products,
      inventory,
      employees,
      orders
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bean_bloom_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ទាញយកឯកសារ JSON Backup ជោគជ័យ!');
  };

  const handleResetSampleData = () => {
    if (confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យទៅជាគំរូដើមឡើងវិញមែនទេ? (Reset to default)')) {
      setProducts(initialProducts);
      setInventory(initialInventory);
      setEmployees(initialEmployees);
      setOrders(initialOrders);
      setExchangeRate(4100);
      showToast('បានកំណត់ទិន្នន័យគំរូដើមឡើងវិញ!');
    }
  };

  // Nav list items with matching icons
  const navItems = [
    { id: 'dashboard' as ActiveView, label: t.dashboard, icon: LayoutDashboard },
    { id: 'pos' as ActiveView, label: t.pos, icon: ShoppingBag },
    { id: 'orders' as ActiveView, label: t.orders, icon: ReceiptText },
    { id: 'menu' as ActiveView, label: t.menu, icon: NotebookTabs },
    { id: 'inventory' as ActiveView, label: t.inventory, icon: Package },
    { id: 'employees' as ActiveView, label: t.employees, icon: BadgeCheck },
    { id: 'reports' as ActiveView, label: t.reports, icon: BarChart3 },
    { id: 'promotions' as ActiveView, label: t.promotions, icon: BadgePercent },
    { id: 'settings' as ActiveView, label: t.settings, icon: Settings },
  ];

  return (
    <div className="app-shell flex w-full">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`sidebar-container fixed inset-y-0 left-0 z-50 flex flex-col p-4 text-[#fff8f0] transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between px-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c77c35] text-white shadow-lg shrink-0">
              <Coffee className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[.15em] text-[#fff8f0]">BEAN &amp; BLOOM</p>
              <p className="text-xs text-[#d9bfa9] font-khmer">{t.appSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden rounded-lg p-1 text-[#dec8b4] hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#c4a484]/20 text-[#fff8f0] shadow-inset border-l-4 border-[#d89852]'
                    : 'text-[#dec8b4] hover:bg-[#c4a484]/15 hover:text-[#fff8f0]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Google Sheet Status Card */}
        <div className="mt-4 rounded-2xl bg-[#332016] p-4 text-[#ecd9c7] border border-[#483023]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t.sheetSyncedTitle}
              </p>
            </div>
            <button
              onClick={syncWithSheet}
              disabled={isSyncing}
              className="rounded p-1 hover:bg-white/10 text-xs text-[#dec8b4] transition cursor-pointer disabled:opacity-50"
              title="Sync now"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed opacity-85">
            {t.sheetSyncedDesc}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-[270px] min-h-screen flex-1 flex flex-col w-full overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-[var(--line)] bg-[var(--cream)]/85 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-[var(--line)] p-2 text-[#6f4e37] lg:hidden hover:bg-black/5 transition cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Input */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#846b5c]" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={t.search}
                className="w-64 md:w-80 rounded-xl border border-[var(--line)] py-2 pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-[#c4a484] bg-white text-[#261711]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Exchange Rate Pill */}
            <div
              onClick={() => setActiveView('settings')}
              className="hidden items-center rounded-xl bg-white px-3 py-1.5 border border-[var(--line)] text-xs font-bold text-[#6f4e37] md:flex gap-1.5 shadow-xs cursor-pointer hover:border-[#c4a484] transition"
              title="Click to change exchange rate in Settings"
            >
              <Coins className="h-3.5 w-3.5 text-amber-600" />
              <span>1$ = {exchangeRate.toLocaleString()} ៛</span>
            </div>

            {/* Google Sheets Badge */}
            <button
              onClick={syncWithSheet}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[#846b5c] shadow-xs hover:border-emerald-500 transition cursor-pointer"
              title="Sync with Google Sheet"
            >
              <Table className="h-3.5 w-3.5 text-emerald-600" />
              <span>Google Sheets</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs font-bold text-[#6f4e37] shadow-xs hover:bg-stone-50 transition cursor-pointer active:scale-95"
              aria-label="Toggle Language"
            >
              {language === 'kh' ? 'EN' : 'KH'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              className="rounded-xl border border-[var(--line)] bg-white p-2.5 text-[#6f4e37] shadow-xs hover:bg-stone-50 transition cursor-pointer active:scale-95"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => setActiveView('settings')}
              className="flex items-center gap-2 rounded-xl p-1 text-left cursor-pointer hover:bg-black/5 transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6f4e37] text-sm font-bold text-white shadow">
                AM
              </span>
              <span className="hidden md:block">
                <span className="block text-sm font-bold leading-tight text-[#261711]">Alex Morgan</span>
                <span className="block text-xs text-[#846b5c]">Store Manager</span>
              </span>
            </button>
          </div>
        </header>

        {/* View Workspace */}
        <div className="p-4 sm:p-7 flex-1">
          {activeView === 'dashboard' && (
            <DashboardView
              onOpenPos={() => setActiveView('pos')}
              products={products}
              orders={orders}
              employees={employees}
              exchangeRate={exchangeRate}
              language={language}
            />
          )}

          {activeView === 'pos' && (
            <POSView
              products={products}
              exchangeRate={exchangeRate}
              language={language}
              onCheckoutComplete={handleCheckoutComplete}
              onOpenKHQR={handleOpenKHQR}
            />
          )}

          {activeView === 'orders' && (
            <OrdersView
              orders={orders}
              exchangeRate={exchangeRate}
              language={language}
              onEditOrder={handleEditOrder}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {activeView === 'menu' && (
            <MenuView
              products={products}
              exchangeRate={exchangeRate}
              language={language}
              onOpenAddModal={() => setAddProductModalOpen(true)}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView
              inventory={inventory}
              exchangeRate={exchangeRate}
              language={language}
              onAddInventoryItem={handleAddInventory}
              onUpdateQuantity={handleUpdateInventoryQty}
              onDeleteItem={handleDeleteInventory}
            />
          )}

          {activeView === 'employees' && (
            <EmployeesView
              employees={employees}
              language={language}
              onOpenAddModal={() => setAddEmployeeModalOpen(true)}
              onToggleClock={handleToggleEmployeeClock}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              language={language}
              exchangeRate={exchangeRate}
            />
          )}

          {activeView === 'promotions' && (
            <PromotionsView
              language={language}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              language={language}
              exchangeRate={exchangeRate}
              shopName={shopName}
              appsScriptUrl={appsScriptUrl}
              onUpdateSettings={handleUpdateSettings}
              onSyncWithSheet={syncWithSheet}
              onExportJsonBackup={handleExportJsonBackup}
              onResetSampleData={handleResetSampleData}
            />
          )}
        </div>
      </main>

      {/* MODALS */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={activeReceiptOrder}
        exchangeRate={exchangeRate}
      />

      <KHQRModal
        isOpen={khqrModalOpen}
        onClose={() => setKhqrModalOpen(false)}
        onConfirm={handleConfirmKHQR}
        amountUsd={khqrAmount}
        exchangeRate={exchangeRate}
        shopName={shopName}
      />

      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        onAdd={handleAddProduct}
      />

      <AddEmployeeModal
        isOpen={addEmployeeModalOpen}
        onClose={() => setAddEmployeeModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <EditOrderModal
        isOpen={editOrderModalOpen}
        order={editingOrder}
        onClose={() => setEditOrderModalOpen(false)}
        onSave={handleSaveOrderStatus}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#261711] border border-[#583b27] px-4 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
