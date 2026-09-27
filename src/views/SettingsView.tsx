import React, { useState } from 'react';
import { Table, DownloadCloud, Save, RefreshCw, Database, Check } from 'lucide-react';
import { translations } from '../i18n/translations';

interface SettingsViewProps {
  language: 'kh' | 'en';
  exchangeRate: number;
  shopName: string;
  appsScriptUrl: string;
  onUpdateSettings: (newRate: number, newShopName: string, newUrl: string) => void;
  onSyncWithSheet: () => void;
  onExportJsonBackup: () => void;
  onResetSampleData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  exchangeRate,
  shopName,
  appsScriptUrl,
  onUpdateSettings,
  onSyncWithSheet,
  onExportJsonBackup,
  onResetSampleData
}) => {
  const t = translations[language];
  const [rate, setRate] = useState(exchangeRate.toString());
  const [name, setName] = useState(shopName);
  const [url, setUrl] = useState(appsScriptUrl);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRate = Number(rate);
    if (!parsedRate || parsedRate <= 0) return;

    onUpdateSettings(parsedRate, name.trim(), url.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
          System Settings
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
          {t.systemSettings}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Google Sheet Webhook / Apps Script Config */}
        <div className="glass-card rounded-3xl p-6 border border-[var(--line)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#261711] flex items-center gap-2">
              <Table className="text-emerald-600 h-5 w-5" />
              <span>{t.gsheetIntegration}</span>
            </h2>
            <span className="text-xs font-bold rounded-full px-2.5 py-1 bg-emerald-100 text-emerald-800">
              {t.connectedState}
            </span>
          </div>

          <p className="text-xs text-[#846b5c] leading-relaxed">
            {t.gsheetDesc}
          </p>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#38241b]" htmlFor="gas-url">
              Google Apps Script Web App URL
            </label>
            <input
              id="gas-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full rounded-xl border border-[var(--line)] p-3 text-xs font-mono outline-none bg-white text-[#261711]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSyncWithSheet}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#6f4e37] py-2.5 font-bold text-white shadow hover:bg-[#583b27] transition text-xs cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t.syncNow}</span>
            </button>
            <button
              type="button"
              onClick={onSyncWithSheet}
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 font-bold text-[#6f4e37] hover:bg-stone-50 transition text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <DownloadCloud className="h-4 w-4" />
              <span>{t.pullData}</span>
            </button>
          </div>
        </div>

        {/* Shop Info & Currency Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 border border-[var(--line)] space-y-4">
          <h2 className="text-lg font-bold text-[#261711]">
            {t.shopInfo}
          </h2>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#38241b]" htmlFor="shop-name-input">
              {t.shopName}
            </label>
            <input
              id="shop-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none bg-white text-sm text-[#261711]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#38241b]" htmlFor="exchange-rate-input">
              {t.exchangeRateLabel}
            </label>
            <div className="relative">
              <input
                id="exchange-rate-input"
                type="number"
                step="50"
                min="1000"
                required
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] p-2.5 pr-14 outline-none font-bold text-base text-[#6f4e37] bg-white tabular-nums"
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-[#846b5c]">
                ៛ (Riel)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#846b5c]">
              បច្ចុប្បន្ន 1 USD = {Number(rate || 0).toLocaleString()} ៛ (Update realtime across all screens)
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6f4e37] px-5 py-2.5 font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer text-xs"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? "បានរក្សាទុកជោគជ័យ!" : t.saveChanges}</span>
          </button>
        </form>
      </div>

      {/* Database Management & Backup */}
      <div className="glass-card rounded-3xl p-6 border border-[var(--line)]">
        <h3 className="text-base font-bold text-[#261711] flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-[#6f4e37]" />
          <span>Local Storage &amp; Offline Backup</span>
        </h3>
        <p className="text-xs text-[#846b5c] max-w-2xl leading-relaxed mb-4">
          រាល់មុខទំនិញ ស្តុក បុគ្គលិក និងការបញ្ជាទិញត្រូវបានរក្សាទុកដោយសុវត្ថិភាពនៅក្នុង Browser LocalStorage និង Sync ទៅកាន់ Google Sheet។ អ្នកអាចទាញយកឯកសារ JSON Backup បានគ្រប់ពេលវេលា។
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onExportJsonBackup}
            type="button"
            className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold text-[#6f4e37] shadow-xs hover:bg-stone-50 transition cursor-pointer"
          >
            Export Backup (.json)
          </button>
          <button
            onClick={onResetSampleData}
            type="button"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 shadow-xs hover:bg-red-100 transition cursor-pointer"
          >
            Reset Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};
