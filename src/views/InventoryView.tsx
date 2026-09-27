import React, { useState } from 'react';
import { Plus, Minus, Trash2, Search, PackageCheck } from 'lucide-react';
import { InventoryItem } from '../types';
import { translations } from '../i18n/translations';

interface InventoryViewProps {
  inventory: InventoryItem[];
  exchangeRate: number;
  language: 'kh' | 'en';
  onAddInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  exchangeRate,
  language,
  onAddInventoryItem,
  onUpdateQuantity,
  onDeleteItem
}) => {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Coffee');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState<InventoryItem['status']>('Available');

  const filtered = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity) return;

    onAddInventoryItem({
      name: name.trim(),
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      status
    });

    setName('');
    setPrice('');
    setQuantity('');
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-emerald-800 bg-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Available
          </span>
        );
      case 'Low stock':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-amber-800 bg-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            Low stock
          </span>
        );
      case 'Sold out':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-red-800 bg-red-100">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Sold out
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
          {t.stockRoom}
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
          {t.stockManagement}
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
        {/* Left Form: Add Stock */}
        <aside className="glass-card h-fit rounded-3xl p-5 border border-[var(--line)]">
          <h2 className="text-lg font-bold text-[#261711] flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#6f4e37]" />
            <span>{t.addStockTitle}</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#38241b]">{t.itemName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arabica Coffee Beans"
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-xs outline-none bg-white text-[#261711]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#38241b]">{t.category}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-xs outline-none bg-white text-[#261711]"
              >
                <option value="Coffee">Coffee</option>
                <option value="Dairy">Dairy</option>
                <option value="Syrup">Syrup</option>
                <option value="Pastry">Pastry</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#38241b]">{t.unitPrice}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="12.50"
                  className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-xs outline-none bg-white font-bold"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#38241b]">{t.quantity}</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-xs outline-none bg-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#38241b]">{t.stockStatus}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-xs outline-none bg-white text-[#261711]"
              >
                <option value="Available">Available</option>
                <option value="Low stock">Low stock</option>
                <option value="Sold out">Sold out</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#6f4e37] py-2.5 text-xs font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer mt-2"
            >
              {t.addStockButton}
            </button>
          </form>
        </aside>

        {/* Right List: Stock Items */}
        <article className="glass-card overflow-hidden rounded-3xl border border-[var(--line)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] p-5">
            <div>
              <h2 className="text-lg font-bold text-[#261711]">{t.suppliesList}</h2>
              <p className="text-xs text-[#846b5c]">
                {filtered.length} {t.itemsCount} in stock
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#846b5c]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchStock}
                className="rounded-xl border border-[var(--line)] py-1.5 pl-8 pr-3 text-xs outline-none bg-white text-[#261711]"
              />
            </div>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-[#846b5c]">គ្មានទំនិញក្នុងស្តុកឡើយ។</p>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-black/[0.01] transition"
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#261711]">{item.name}</h4>
                    <p className="text-xs text-[#846b5c] mt-0.5">
                      {item.category} · ${item.price.toFixed(2)} ({Math.round(item.price * exchangeRate).toLocaleString()} ៛)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}

                    <div className="flex items-center rounded-xl border border-[var(--line)] bg-white p-1 text-xs shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 font-bold hover:bg-stone-100 rounded cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="min-w-6 text-center font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 font-bold hover:bg-stone-100 rounded cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete stock item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
