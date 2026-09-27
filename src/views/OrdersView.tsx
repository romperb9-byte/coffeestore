import React, { useState } from 'react';
import { Download, Filter, Eye, Edit3 } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { translations } from '../i18n/translations';

interface OrdersViewProps {
  orders: Order[];
  exchangeRate: number;
  language: 'kh' | 'en';
  onEditOrder: (order: Order) => void;
  onViewReceipt: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  exchangeRate,
  language,
  onEditOrder,
  onViewReceipt
}) => {
  const t = translations[language];
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (order.notes && order.notes.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            {t.statusCompleted}
          </span>
        );
      case 'Preparing':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100/80">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            {t.statusPreparing}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-red-800 bg-red-100/80">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            {t.statusCancelled}
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Payment', 'Total (USD)', 'Total (KHR)', 'Notes'];
    const rows = filteredOrders.map(o => [
      o.id,
      `"${o.customer}"`,
      `"${o.date}"`,
      o.status,
      o.payment,
      o.total.toFixed(2),
      Math.round(o.total * exchangeRate),
      `"${(o.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bean_bloom_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
            Service Floor
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
            {t.orderHistory}
          </h1>
          <p className="mt-1 text-sm text-[#846b5c]">
            {t.orderHistoryDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs font-semibold outline-none bg-white text-[#261711] shadow-xs"
          >
            <option value="All">{t.allStatuses}</option>
            <option value="Completed">{t.statusCompleted}</option>
            <option value="Preparing">{t.statusPreparing}</option>
            <option value="Cancelled">{t.statusCancelled}</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl bg-[#6f4e37] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{t.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Orders Table Card */}
      <article className="glass-card overflow-hidden rounded-3xl border border-[var(--line)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#fbf2e9] text-xs uppercase text-[#846b5c] border-b border-[var(--line)] font-semibold">
              <tr>
                <th className="p-4">{t.orderId}</th>
                <th className="p-4">{t.customer}</th>
                <th className="p-4">{t.date}</th>
                <th className="p-4">{t.status}</th>
                <th className="p-4">{t.paymentMethod}</th>
                <th className="p-4">{t.totalAmount}</th>
                <th className="p-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-[#846b5c]">
                    គ្មានទិន្នន័យការបញ្ជាទិញឡើយ។ (No orders found)
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/[0.02] transition">
                    <td className="p-4 font-bold text-[#6f4e37] whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#261711] block">{order.customer}</span>
                      {order.notes && (
                        <span className="text-xs text-[#846b5c] block truncate max-w-xs">
                          {order.notes}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-[#846b5c] whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="rounded-lg bg-stone-100 border border-stone-200 px-2.5 py-1 text-xs font-bold text-[#38241b]">
                        {order.payment}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-[#261711] block tabular-nums">
                        ${order.total.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-[#6f4e37] tabular-nums">
                        {Math.round(order.total * exchangeRate).toLocaleString()} ៛
                      </span>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="rounded-xl border border-[var(--line)] bg-white p-2 text-[#6f4e37] hover:bg-[#6f4e37] hover:text-white transition shadow-xs cursor-pointer"
                          title="View Receipt"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEditOrder(order)}
                          className="rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[#6f4e37] shadow-xs hover:bg-[#6f4e37] hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>{t.editOperation}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
};
