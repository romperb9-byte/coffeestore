import React, { useState } from 'react';
import { Search, Trash2, Banknote, CreditCard, QrCode, Receipt, Plus, Minus } from 'lucide-react';
import { Product, Category, PaymentMethod, Order } from '../types';
import { translations } from '../i18n/translations';

interface POSViewProps {
  products: Product[];
  exchangeRate: number;
  language: 'kh' | 'en';
  onCheckoutComplete: (order: Order) => void;
  onOpenKHQR: (amountUsd: number) => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  exchangeRate,
  language,
  onCheckoutComplete,
  onOpenKHQR
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [cart, setCart] = useState<Map<string, { product: Product; quantity: number }>>(new Map());

  const categories: Category[] = ['All', 'Coffee', 'Cold', 'Pastry'];

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'Coffee': return t.coffee;
      case 'Cold': return t.cold;
      case 'Pastry': return t.pastry;
      default: return t.all;
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(product.id);
      if (existing) {
        next.set(product.id, { product, quantity: existing.quantity + 1 });
      } else {
        next.set(product.id, { product, quantity: 1 });
      }
      return next;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(productId);
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        next.delete(productId);
      } else {
        next.set(productId, { ...existing, quantity: newQty });
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart(new Map());
  };

  // Calculations
  const cartItems = Array.from(cart.values());
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxAmount = (subtotal - discountAmount) * 0.10;
  const grandTotalUsd = subtotal - discountAmount + taxAmount;
  const grandTotalKhr = Math.round(grandTotalUsd * exchangeRate);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (paymentMethod === 'QR Pay') {
      onOpenKHQR(grandTotalUsd);
      return;
    }

    executeFinalCheckout();
  };

  const executeFinalCheckout = () => {
    const newOrderId = "CS-" + Math.floor(2000 + Math.random() * 8000);
    const newOrder: Order = {
      id: newOrderId,
      customer: "ភ្ញៀវទូទៅ (Walk-in)",
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: "Completed",
      payment: paymentMethod,
      total: Number(grandTotalUsd.toFixed(2)),
      totalKhr: grandTotalKhr,
      notes: cartItems.map(i => `${i.quantity}x ${i.product.name}`).join(", "),
      items: cartItems.map(i => ({ product: i.product, quantity: i.quantity }))
    };

    onCheckoutComplete(newOrder);
    clearCart();
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
            {t.counterService}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
            {t.pos}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-[var(--line)] bg-[#fffdf9] px-3 py-1.5 text-xs font-bold text-[#6f4e37] shadow-xs">
            Register 01 · Google Sheet Connected
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Products Panel */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#846b5c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchProducts}
                className="w-full rounded-xl border border-[var(--line)] py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#c4a484] bg-white"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#6f4e37] border-[#6f4e37] text-white shadow-sm'
                      : 'border-[var(--line)] bg-white text-[#846b5c] hover:bg-stone-50'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addToCart(p)}
                className="glass-card overflow-hidden rounded-2xl text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg group cursor-pointer border border-[var(--line)]"
              >
                <div className="h-32 w-full overflow-hidden bg-[#eee1d3] relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=300&q=80';
                    }}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 rounded-lg bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {p.category}
                  </span>
                </div>
                <div className="p-3">
                  <span className="font-bold text-sm block truncate text-[#261711]">{p.name}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-bold text-base text-[#6f4e37] tabular-nums">
                      ${p.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-[#846b5c] tabular-nums">
                      {Math.round(p.price * exchangeRate).toLocaleString()} ៛
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <aside className="glass-card flex min-h-[580px] flex-col rounded-3xl p-5 border border-[var(--line)] shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#261711]">{t.currentOrder}</h2>
              <p className="mt-0.5 text-xs text-[#846b5c]">
                {cartCount} {t.itemsCount}
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition cursor-pointer"
                title="Clear Cart"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 space-y-2.5 overflow-y-auto py-4 max-h-[290px]">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center text-sm text-[#846b5c] flex flex-col items-center justify-center">
                <Receipt className="h-10 w-10 stroke-1 mb-2 opacity-40 text-[#6f4e37]" />
                <span className="font-semibold">{t.emptyCart}</span>
                <span className="text-xs opacity-75 mt-1">{t.emptyCartDesc}</span>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-[var(--line)] shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#261711]">{product.name}</p>
                    <p className="text-xs text-[#6f4e37] font-semibold tabular-nums">
                      ${product.price.toFixed(2)} · {Math.round(product.price * exchangeRate).toLocaleString()} ៛
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="h-7 w-7 rounded-lg border border-[var(--line)] font-bold text-sm hover:bg-stone-100 flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-5 text-center text-sm font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="h-7 w-7 rounded-lg border border-[var(--line)] font-bold text-sm hover:bg-stone-100 flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Totals & Checkout */}
          <div className="border-t border-[var(--line)] pt-4 space-y-3">
            <div className="flex gap-2">
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="flex-1 rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-semibold outline-none bg-white text-[#261711]"
              >
                <option value={0}>{t.noDiscount}</option>
                <option value={5}>{t.memberDiscount}</option>
                <option value={10}>{t.vipDiscount}</option>
                <option value={15}>{t.staffDiscount}</option>
              </select>
              <span className="rounded-xl bg-[#f5e6d7] px-3 py-2 text-xs font-bold text-[#6f4e37] flex items-center shrink-0">
                {t.taxRate}
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#846b5c]">
                <span>{t.subtotal}</span>
                <strong className="text-[#261711] tabular-nums">${subtotal.toFixed(2)}</strong>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t.discount} ({discountPercent}%)</span>
                  <strong className="tabular-nums">−${discountAmount.toFixed(2)}</strong>
                </div>
              )}
              <div className="flex justify-between text-[#846b5c]">
                <span>{t.tax}</span>
                <strong className="text-[#261711] tabular-nums">${taxAmount.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between border-t border-dashed border-[var(--line)] pt-2.5 text-base">
                <span className="font-bold text-[#261711]">{t.totalPaid}</span>
                <div className="text-right">
                  <strong className="block text-xl text-[#6f4e37] font-black tabular-nums">
                    ${grandTotalUsd.toFixed(2)}
                  </strong>
                  <span className="block text-xs font-bold text-[#846b5c] tabular-nums">
                    {grandTotalKhr.toLocaleString()} ៛
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`rounded-xl border py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'bg-[#6f4e37] border-[#6f4e37] text-white shadow-sm'
                    : 'border-[var(--line)] bg-white text-[#846b5c] hover:bg-stone-50'
                }`}
              >
                <Banknote className="h-3.5 w-3.5" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`rounded-xl border py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'bg-[#6f4e37] border-[#6f4e37] text-white shadow-sm'
                    : 'border-[var(--line)] bg-white text-[#846b5c] hover:bg-stone-50'
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QR Pay')}
                className={`rounded-xl border py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'QR Pay'
                    ? 'bg-[#6f4e37] border-[#6f4e37] text-white shadow-sm'
                    : 'border-[var(--line)] bg-white text-[#846b5c] hover:bg-stone-50'
                }`}
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>KHQR</span>
              </button>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6f4e37] py-3.5 font-bold text-white shadow-lg transition hover:bg-[#583b27] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              <Receipt className="h-4 w-4" />
              <span>{t.chargeButton}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
