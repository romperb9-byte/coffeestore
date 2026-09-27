import React, { useState } from 'react';
import { PlusCircle, Trash2, Tag, Coffee } from 'lucide-react';
import { Product } from '../types';
import { translations } from '../i18n/translations';

interface MenuViewProps {
  products: Product[];
  exchangeRate: number;
  language: 'kh' | 'en';
  onOpenAddModal: () => void;
  onDeleteProduct: (productId: string) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  products,
  exchangeRate,
  language,
  onOpenAddModal,
  onDeleteProduct
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'All' | 'Coffee' | 'Cold' | 'Pastry'>('All');

  const filtered = products.filter(p => filter === 'All' || p.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
            Kitchen &amp; Counter
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
            {t.menuCatalog}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Category Tabs */}
          <div className="flex gap-1 bg-stone-100 p-1 rounded-xl border border-[var(--line)]">
            {(['All', 'Coffee', 'Cold', 'Pastry'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  filter === cat ? 'bg-white text-[#6f4e37] shadow-xs' : 'text-[#846b5c] hover:text-[#261711]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6f4e37] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t.addProduct}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <article
            key={product.id}
            className="glass-card overflow-hidden rounded-3xl group relative border border-[var(--line)] hover:border-[#c4a484] transition"
          >
            <div className="h-44 w-full overflow-hidden bg-stone-200 relative">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80';
                }}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>{product.category}</span>
              </span>

              <button
                onClick={() => onDeleteProduct(product.id)}
                className="absolute top-3 right-3 rounded-xl bg-black/60 p-2 text-white/90 backdrop-blur-xs hover:bg-red-600 transition cursor-pointer"
                title="Delete Product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-[#261711]">{product.name}</h3>
                  <span className="inline-block mt-1 text-xs text-[#846b5c] font-medium">
                    Google Sheets Synchronized
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-black text-lg text-[#6f4e37] tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="block text-xs font-semibold text-[#846b5c] tabular-nums">
                    {Math.round(product.price * exchangeRate).toLocaleString()} ៛
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
