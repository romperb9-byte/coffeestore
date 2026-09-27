import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  exchangeRate: number;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  exchangeRate
}) => {
  if (!isOpen || !order) return null;

  const totalUsd = order.total;
  const totalKhr = order.totalKhr || Math.round(totalUsd * exchangeRate);

  const handlePrint = () => {
    let printFrame = document.getElementById("receipt-print-frame") as HTMLIFrameElement | null;
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "receipt-print-frame";
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
      document.body.appendChild(printFrame);
    }

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt #${order.id} - Bean & Bloom</title>
        <style>
          @page { margin: 6mm; size: auto; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            width: 290px;
            margin: 0 auto;
            padding: 12px;
            color: #1a1a1a;
            font-size: 13px;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .title { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
          .subtitle { font-size: 11px; color: #555; margin-top: 3px; }
          .divider { border-bottom: 1px dashed #777; margin: 10px 0; }
          .total-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; font-weight: bold; margin-top: 6px; }
          .item-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <div class="title">BEAN & BLOOM</div>
          <div class="subtitle">#42 St 240, Phnom Penh · Tel: 023 999 888</div>
          <div class="subtitle" style="margin-top: 4px;">Receipt #${order.id} · ${order.date}</div>
        </div>
        <div class="divider"></div>
        <div class="lines">
          ${(order.items && order.items.length > 0)
            ? order.items.map(i => `
                <div class="item-row">
                  <span>${i.quantity}x ${i.product.name}</span>
                  <span class="text-right">$${(i.product.price * i.quantity).toFixed(2)}</span>
                </div>
              `).join('')
            : `<div class="item-row"><span>${order.notes || "Beverage Order"}</span><span>$${order.total.toFixed(2)}</span></div>`
          }
        </div>
        <div class="divider"></div>
        <div class="total-row">
          <span>TOTAL PAID (${order.payment}):</span>
          <span class="text-right">
            $${totalUsd.toFixed(2)}<br>
            <span style="font-size:11px;color:#666;">${totalKhr.toLocaleString()} ៛</span>
          </span>
        </div>
        <div class="divider"></div>
        <div class="text-center subtitle" style="margin-top:12px;">
          Thank you! សូមអរគុណ!<br>Have a nice day ☕
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        printFrame?.contentWindow?.focus();
        printFrame?.contentWindow?.print();
      } catch {
        window.print();
      }
    }, 300);
  };

  const handleDownloadSlip = () => {
    const itemsText = order.items && order.items.length > 0
      ? order.items.map(i => `${i.quantity}x ${i.product.name.padEnd(20)} $${(i.product.price * i.quantity).toFixed(2)}`).join('\n')
      : `${order.notes || "Order items".padEnd(20)} $${order.total.toFixed(2)}`;

    const slipContent = `
========================================
           BEAN & BLOOM CAFE
        #42 St 240, Phnom Penh
            Tel: 023 999 888
========================================
Receipt #: ${order.id}
Date:      ${order.date}
Customer:  ${order.customer}
Payment:   ${order.payment}
Rate:      1$ = ${exchangeRate.toLocaleString()} KHR
----------------------------------------
ITEM                     AMOUNT
----------------------------------------
${itemsText}
----------------------------------------
TOTAL USD:               $${totalUsd.toFixed(2)}
TOTAL KHR:               ${totalKhr.toLocaleString()} ៛
========================================
         Thank you! សូមអរគុណ!
         Have a nice day ☕
========================================
    `.trim();

    const blob = new Blob([slipContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-[#fffdf9] p-6 text-[#38241b] shadow-2xl border border-[var(--line)]">
        <div className="flex justify-between items-start border-b border-[var(--line)] pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.15em] text-[#c77c35]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Receipt</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#261711] mt-0.5">Bean &amp; Bloom</h2>
            <p className="text-xs text-[#846b5c]">#42 St 240, Phnom Penh · Tel: 023 999 888</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 hover:bg-black/5 transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Receipt metadata */}
        <div className="mt-3 flex justify-between text-xs text-[#846b5c] border-b border-dashed border-[var(--line)] pb-2.5">
          <span>Order #{order.id}</span>
          <span>{order.date}</span>
        </div>

        {/* Item list */}
        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                <div>
                  <span className="font-bold text-[#38241b]">{item.quantity} × {item.product.name}</span>
                  <span className="block text-[11px] text-[#846b5c]">{item.product.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#6f4e37]">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <span className="block text-[10px] text-[#846b5c]">
                    {Math.round(item.product.price * item.quantity * exchangeRate).toLocaleString()} ៛
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-between text-sm py-2">
              <span className="font-medium text-[#38241b]">{order.notes || "Walk-in Beverage Order"}</span>
              <span className="font-bold text-[#6f4e37]">${order.total.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-3 border-t border-dashed border-[#c4a484]/60">
          <div className="flex justify-between text-xs text-[#846b5c] mb-1">
            <span>Payment Method:</span>
            <span className="font-bold text-[#38241b]">{order.payment}</span>
          </div>
          <div className="flex justify-between text-xs text-[#846b5c] mb-2">
            <span>Exchange Rate:</span>
            <span>1$ = {exchangeRate.toLocaleString()} ៛</span>
          </div>

          <div className="flex justify-between items-baseline text-lg font-bold border-t border-[var(--line)] pt-3">
            <span>Total Paid (សរុប)</span>
            <div className="text-right">
              <span className="block text-2xl text-[#6f4e37] font-black">${totalUsd.toFixed(2)}</span>
              <span className="block text-sm font-semibold text-[#846b5c]">
                {totalKhr.toLocaleString()} ៛
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2.5">
          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#6f4e37] py-3 font-bold text-white shadow-md hover:bg-[#583b27] transition active:scale-[0.98] cursor-pointer text-sm"
          >
            <Printer className="h-4 w-4" />
            <span>បោះពុម្ពវិក្កយបត្រ (Print)</span>
          </button>
          <button
            onClick={handleDownloadSlip}
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[#fffdf9] px-4 py-3 font-bold text-[#6f4e37] shadow-xs hover:bg-black/5 transition cursor-pointer text-sm"
            title="Download text receipt"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
