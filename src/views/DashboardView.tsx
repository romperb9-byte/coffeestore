import React from 'react';
import { CircleDollarSign, TrendingUp, ShoppingBag, Users, Award, PlusCircle } from 'lucide-react';
import { RevenueChart } from '../components/RevenueChart';
import { Product, Order, Employee } from '../types';
import { translations } from '../i18n/translations';

interface DashboardViewProps {
  onOpenPos: () => void;
  products: Product[];
  orders: Order[];
  employees: Employee[];
  exchangeRate: number;
  language: 'kh' | 'en';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenPos,
  products,
  orders,
  employees,
  exchangeRate,
  language
}) => {
  const t = translations[language];

  // Calculate dynamic metrics
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const todaySalesUsd = completedOrders.reduce((acc, o) => acc + o.total, 0);
  const todaySalesKhr = Math.round(todaySalesUsd * exchangeRate);

  // Month baseline plus today's sales
  const monthSalesUsd = 1254.30 + (todaySalesUsd > 36.2 ? todaySalesUsd - 36.2 : 0);
  const monthSalesKhr = Math.round(monthSalesUsd * exchangeRate);

  const totalOrdersCount = orders.length;
  const staffOnDutyCount = employees.filter(e => e.clockedIn).length;
  const totalStaffCount = employees.length;

  const topSellers = products.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Greeting & Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
            {t.operations}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold sm:text-4xl text-[#261711]">
            {t.welcome}
          </h1>
          <p className="mt-1 text-sm text-[#846b5c]">
            {t.welcomeCopy}
          </p>
        </div>

        <button
          onClick={onOpenPos}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6f4e37] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#583b27] hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t.newSale}</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Metric 1: Today's Sales */}
        <article className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-[#846b5c]">{t.todaySales}</p>
              <p className="mt-2 text-2xl font-bold text-[#6f4e37] tracking-tight">
                ${todaySalesUsd.toFixed(2)}
              </p>
              <p className="text-xs font-bold text-[#846b5c] tabular-nums">
                {todaySalesKhr.toLocaleString()} ៛
              </p>
              <p className="mt-2 text-xs font-semibold text-[#47735a] flex items-center gap-1">
                <span>↑</span> {t.liveFromSheet}
              </p>
            </div>
            <div className="h-fit rounded-xl bg-[#f5e6d7] p-3 text-[#a95e27]">
              <CircleDollarSign className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        </article>

        {/* Metric 2: Monthly Revenue */}
        <article className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-[#846b5c]">{t.monthlyRevenue}</p>
              <p className="mt-2 text-2xl font-bold text-[#6f4e37] tracking-tight">
                ${monthSalesUsd.toFixed(2)}
              </p>
              <p className="text-xs font-bold text-[#846b5c] tabular-nums">
                {monthSalesKhr.toLocaleString()} ៛
              </p>
              <p className="mt-2 text-xs font-semibold text-[#47735a] flex items-center gap-1">
                <span>↑</span> 8.2% {t.thisMonth}
              </p>
            </div>
            <div className="h-fit rounded-xl bg-[#e8f2e9] p-3 text-[#47735a]">
              <TrendingUp className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        </article>

        {/* Metric 3: Total Orders */}
        <article className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-[#846b5c]">{t.totalOrders}</p>
              <p className="mt-2 text-2xl font-bold text-[#261711] tracking-tight">
                {totalOrdersCount}
              </p>
              <p className="mt-3 text-xs font-semibold text-[#47735a] flex items-center gap-1">
                <span>↑</span> {totalOrdersCount} {t.ordersPlaced}
              </p>
            </div>
            <div className="h-fit rounded-xl bg-[#f6ead9] p-3 text-[#b2722c]">
              <ShoppingBag className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        </article>

        {/* Metric 4: Staff on duty */}
        <article className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-[#846b5c]">{t.activeStaff}</p>
              <p className="mt-2 text-2xl font-bold text-[#261711] tracking-tight">
                {staffOnDutyCount} / {totalStaffCount}
              </p>
              <p className="mt-3 text-xs font-semibold text-[#47735a] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>{t.onShiftToday}</span>
              </p>
            </div>
            <div className="h-fit rounded-xl bg-[#eee7f4] p-3 text-[#76558a]">
              <Users className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        </article>
      </div>

      {/* Main Two-Column Row */}
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        {/* Left Card: Revenue Overview */}
        <article className="glass-card rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#261711]">{t.revenueOverview}</h2>
              <p className="mt-0.5 text-xs text-[#846b5c]">{t.salesThisWeek}</p>
            </div>
            <span className="rounded-xl bg-[#f5e6d7] px-3 py-1.5 text-xs font-bold text-[#6f4e37]">
              {t.thisWeek}
            </span>
          </div>

          <div className="mt-5">
            <RevenueChart exchangeRate={exchangeRate} />
          </div>
        </article>

        {/* Right Card: Best Sellers */}
        <article className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-3">
              <div>
                <h2 className="text-xl font-bold text-[#261711]">{t.bestSellers}</h2>
                <p className="mt-0.5 text-xs text-[#846b5c]">{t.lovedThisWeek}</p>
              </div>
              <Award className="h-5 w-5 text-[#c77c35]" />
            </div>

            <div className="mt-5 space-y-3.5">
              {topSellers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-[#fffdf9] p-3 border border-[var(--line)] hover:border-[#c4a484] transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=150&q=80';
                      }}
                      className="h-12 w-12 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="truncate">
                      <p className="font-bold text-sm text-[#261711] truncate">{item.name}</p>
                      <p className="text-xs text-[#846b5c]">{item.category}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <span className="block font-bold text-sm text-[#6f4e37] tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#846b5c] tabular-nums">
                      {Math.round(item.price * exchangeRate).toLocaleString()} ៛
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[var(--line)]/60 flex justify-between items-center text-xs text-[#846b5c]">
            <span>Google Sheets Menu sync</span>
            <button
              onClick={onOpenPos}
              className="text-[#6f4e37] font-bold hover:underline"
            >
              Order now →
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
