import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { translations } from '../i18n/translations';

interface ReportsViewProps {
  language: 'kh' | 'en';
  exchangeRate: number;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ language, exchangeRate }) => {
  const t = translations[language];

  const weeklyOrdersData = [
    { day: "Mon", orders: 78 },
    { day: "Tue", orders: 92 },
    { day: "Wed", orders: 85 },
    { day: "Thu", orders: 112 },
    { day: "Fri", orders: 104 },
    { day: "Sat", orders: 138 },
    { day: "Sun", orders: 124 }
  ];

  const maxOrders = 150;

  const monthlyGrowthData = [
    { month: "Apr", count: 930 },
    { month: "May", count: 1008 },
    { month: "Jun", count: 1092 },
    { month: "Jul", count: 1184 },
    { month: "Aug", count: 1324 },
    { month: "Sep", count: 1429 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
          Performance &amp; Analytics
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
          {t.analytics}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Orders Bar Chart */}
        <article className="glass-card rounded-3xl p-6 border border-[var(--line)]">
          <div className="flex justify-between items-center border-b border-[var(--line)]/60 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#261711]">{t.weeklySales}</h2>
              <p className="text-xs text-[#846b5c]">Transactions count per weekday</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#6f4e37]" />
          </div>

          <div className="mt-6 flex items-end justify-between h-52 pt-4 px-2">
            {weeklyOrdersData.map((d) => {
              const heightPercent = (d.orders / maxOrders) * 100;
              return (
                <div key={d.day} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[10px] font-bold text-[#846b5c] opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.orders}
                  </span>
                  <div className="w-8 sm:w-10 bg-[#f5e6d7] rounded-xl flex items-end overflow-hidden h-36">
                    <div
                      className="w-full bg-[#6f4e37] rounded-xl transition-all duration-500 group-hover:bg-[#583b27]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#846b5c]">{d.day}</span>
                </div>
              );
            })}
          </div>
        </article>

        {/* Customer Growth Line Chart */}
        <article className="glass-card rounded-3xl p-6 border border-[var(--line)]">
          <div className="flex justify-between items-center border-b border-[var(--line)]/60 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#261711]">{t.customerGrowth}</h2>
              <p className="text-xs text-[#846b5c]">Active coffee club patrons</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#47735a]" />
          </div>

          <div className="mt-6 h-52 flex flex-col justify-end">
            <svg viewBox="0 0 400 130" className="w-full h-36 overflow-visible">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#47735a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#47735a" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="20" y1="20" x2="380" y2="20" stroke="#ead8c3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="65" x2="380" y2="65" stroke="#ead8c3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="380" y2="110" stroke="#ead8c3" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area */}
              <path
                d="M 30,95 L 90,82 L 150,68 L 220,52 L 290,34 L 360,18 L 360,115 L 30,115 Z"
                fill="url(#growthGrad)"
              />

              {/* Line */}
              <path
                d="M 30,95 L 90,82 L 150,68 L 220,52 L 290,34 L 360,18"
                fill="none"
                stroke="#47735a"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {[
                { x: 30, y: 95, val: 930 },
                { x: 90, y: 82, val: 1008 },
                { x: 150, y: 68, val: 1092 },
                { x: 220, y: 52, val: 1184 },
                { x: 290, y: 34, val: 1324 },
                { x: 360, y: 18, val: 1429 }
              ].map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#47735a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </svg>

            {/* Labels */}
            <div className="flex justify-between px-2 pt-2 text-xs font-semibold text-[#846b5c]">
              {monthlyGrowthData.map(m => (
                <span key={m.month}>{m.month}</span>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Summary Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-4 border border-[var(--line)]">
          <p className="text-xs text-[#846b5c] font-semibold">Average Ticket Size</p>
          <p className="text-xl font-bold text-[#6f4e37] mt-1">$6.80</p>
          <p className="text-xs text-[#846b5c]">~{Math.round(6.8 * exchangeRate).toLocaleString()} ៛ per order</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-[var(--line)]">
          <p className="text-xs text-[#846b5c] font-semibold">Peak Rush Hours</p>
          <p className="text-xl font-bold text-[#261711] mt-1">07:30 - 09:45 AM</p>
          <p className="text-xs text-[#47735a]">Morning espresso rush</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-[var(--line)]">
          <p className="text-xs text-[#846b5c] font-semibold">Repeat Customer Rate</p>
          <p className="text-xl font-bold text-[#261711] mt-1">68.4%</p>
          <p className="text-xs text-[#47735a]">High customer retention</p>
        </div>
      </div>
    </div>
  );
};
