import React, { useState } from 'react';
import { BadgePercent, Sparkles, Check, Clock, PlusCircle } from 'lucide-react';
import { translations } from '../i18n/translations';

interface PromotionsViewProps {
  language: 'kh' | 'en';
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({ language }) => {
  const t = translations[language];
  const [isActive, setIsActive] = useState(true);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Happy Afternoon Ritual ☕",
      discount: "15% OFF",
      desc: "បញ្ចុះតម្លៃ 15% លើភេសជ្ជៈកាហ្វេទឹកកកទាំងអស់ ចាប់ពីម៉ោង 2:00 ដល់ 5:00 ល្ងាច ជារៀងរាល់ថ្ងៃធ្វើការ។",
      active: true,
      time: "2:00 PM – 5:00 PM (Mon-Fri)"
    },
    {
      id: 2,
      title: "Croissant & Latte Morning Combo 🥐",
      discount: "$5.50 Combo",
      desc: "ទិញ Latte ជាមួយ French Croissant ក្នុងតម្លៃពិសេសត្រឹមតែ $5.50 (សន្សំបាន $1.00)។",
      active: true,
      time: "06:30 AM – 10:30 AM Daily"
    },
    {
      id: 3,
      title: "Weekend Roaster Special (20% OFF Beans)",
      discount: "20% OFF",
      desc: "បញ្ចុះតម្លៃ 20% លើកញ្ចប់គ្រាប់កាហ្វេ Arabica Whole Beans រៀងរាល់ថ្ងៃសៅរ៍ និងអាទិត្យ។",
      active: false,
      time: "Saturday & Sunday"
    }
  ]);

  const toggleCampaign = (id: number) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
          Special Offers
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
          {t.promotionsTitle}
        </h1>
      </div>

      {/* Hero Active Campaign Banner */}
      <article className="overflow-hidden rounded-3xl bg-[#6f4e37] p-8 text-[#fff8f0] shadow-xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BadgePercent className="w-56 h-56 -mr-10 -mt-10" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#edc08c]/20 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-[#edc08c] border border-[#edc08c]/30">
              <Sparkles className="w-3 h-3" />
              <span>{t.activeCampaign}</span>
            </span>
          </div>

          <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold">
            {t.promoTitle}
          </h2>
          <p className="mt-2 max-w-xl text-[#ecd9c7] text-sm leading-relaxed">
            {t.promoDesc}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="rounded-xl bg-[#fff8f0] px-5 py-2.5 text-xs font-bold text-[#6f4e37] shadow hover:bg-white transition cursor-pointer"
            >
              {isActive ? "ផ្អាកយុទ្ធនាការ (Pause)" : "បើកដំណើរការ (Activate)"}
            </button>
            <span className="text-xs text-[#ecd9c7] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Auto-applied to POS terminal during scheduled hours</span>
            </span>
          </div>
        </div>
      </article>

      {/* Campaign List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="glass-card rounded-2xl p-5 border border-[var(--line)] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold rounded-lg bg-[#f5e6d7] text-[#6f4e37] px-2.5 py-1">
                  {camp.discount}
                </span>
                <button
                  onClick={() => toggleCampaign(camp.id)}
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                    camp.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {camp.active ? 'Active' : 'Paused'}
                </button>
              </div>

              <h3 className="font-bold text-base text-[#261711] mt-3">{camp.title}</h3>
              <p className="text-xs text-[#846b5c] mt-1 leading-relaxed">{camp.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--line)]/60 text-[11px] text-[#846b5c] flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#6f4e37]" />
              <span>{camp.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
