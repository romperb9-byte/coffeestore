import React from 'react';
import { X, QrCode, CheckCircle, ShieldCheck } from 'lucide-react';

interface KHQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amountUsd: number;
  exchangeRate: number;
  shopName: string;
}

export const KHQRModal: React.FC<KHQRModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amountUsd,
  exchangeRate,
  shopName
}) => {
  if (!isOpen) return null;

  const amountKhr = Math.round(amountUsd * exchangeRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-6 text-[#38241b] shadow-2xl border border-[var(--line)]">
        {/* KHQR Header */}
        <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs tracking-tighter">
              KH
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-[#261711]">KHQR · Bakong</h3>
              <p className="text-[10px] text-[#846b5c]">National Bank of Cambodia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-500 hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="mt-4 flex flex-col items-center">
          <p className="text-xs font-bold text-[#6f4e37]">{shopName}</p>
          <div className="mt-2 text-center">
            <span className="text-2xl font-black text-[#261711]">${amountUsd.toFixed(2)}</span>
            <span className="block text-xs font-bold text-[#846b5c] mt-0.5">
              {amountKhr.toLocaleString()} ៛
            </span>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-red-500 shadow-md relative group flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-stone-50 rounded-xl flex items-center justify-center border border-dashed border-stone-300 relative overflow-hidden">
              {/* Simulated crisp KHQR pattern */}
              <svg viewBox="0 0 100 100" className="w-44 h-44 text-[#1a1a1a]">
                <rect width="100" height="100" fill="white" />
                {/* Corner markers */}
                <rect x="6" y="6" width="22" height="22" fill="#d32f2f" rx="3" />
                <rect x="9" y="9" width="16" height="16" fill="white" rx="2" />
                <rect x="12" y="12" width="10" height="10" fill="#1a1a1a" rx="1" />

                <rect x="72" y="6" width="22" height="22" fill="#d32f2f" rx="3" />
                <rect x="75" y="9" width="16" height="16" fill="white" rx="2" />
                <rect x="78" y="12" width="10" height="10" fill="#1a1a1a" rx="1" />

                <rect x="6" y="72" width="22" height="22" fill="#d32f2f" rx="3" />
                <rect x="9" y="75" width="16" height="16" fill="white" rx="2" />
                <rect x="12" y="78" width="10" height="10" fill="#1a1a1a" rx="1" />

                {/* Simulated QR data blocks */}
                <rect x="36" y="10" width="8" height="8" fill="#1a1a1a" />
                <rect x="52" y="10" width="10" height="6" fill="#1a1a1a" />
                <rect x="36" y="24" width="6" height="10" fill="#1a1a1a" />
                <rect x="46" y="24" width="8" height="8" fill="#1a1a1a" />
                <rect x="58" y="24" width="6" height="12" fill="#1a1a1a" />

                <rect x="10" y="36" width="6" height="8" fill="#1a1a1a" />
                <rect x="22" y="36" width="8" height="6" fill="#1a1a1a" />
                <rect x="10" y="48" width="12" height="6" fill="#1a1a1a" />
                <rect x="26" y="48" width="6" height="10" fill="#1a1a1a" />

                <rect x="72" y="36" width="8" height="12" fill="#1a1a1a" />
                <rect x="84" y="36" width="6" height="8" fill="#1a1a1a" />
                <rect x="76" y="52" width="14" height="6" fill="#1a1a1a" />

                <rect x="36" y="44" width="28" height="28" fill="#fdfbf7" rx="4" />
                <circle cx="50" cy="58" r="9" fill="#c77c35" />
                {/* Coffee icon in center */}
                <path d="M47 55 h6 v4 a3 3 0 0 1 -6 0 z M53 56 h2 a1.5 1.5 0 0 1 0 3 h-2" fill="none" stroke="white" strokeWidth="1.2" />

                <rect x="34" y="80" width="10" height="10" fill="#1a1a1a" />
                <rect x="48" y="78" width="12" height="6" fill="#1a1a1a" />
                <rect x="64" y="80" width="8" height="10" fill="#1a1a1a" />
                <rect x="78" y="76" width="12" height="12" fill="#1a1a1a" />
              </svg>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#47735a] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KHQR Universal Acceptance</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-center text-[#846b5c] max-w-xs">
            ស្កេនជាមួយ ABA Mobile, ACLEDA, Wing Bank, ឬ Bakong App ណាមួយ
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#47735a] py-3 text-sm font-bold text-white shadow hover:bg-[#356048] transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>បញ្ជាក់ការទូទាត់ជោគជ័យ</span>
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-2 text-xs font-semibold text-[#846b5c] hover:bg-black/5 transition cursor-pointer"
          >
            បោះបង់
          </button>
        </div>
      </div>
    </div>
  );
};
