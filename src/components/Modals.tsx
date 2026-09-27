import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Order, Product, Employee, OrderStatus } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Coffee' | 'Cold' | 'Pastry'>('Coffee');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    let finalImg = imageUrl.trim();
    if (!finalImg) {
      if (category === 'Coffee') {
        finalImg = 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=500&q=80';
      } else if (category === 'Cold') {
        finalImg = 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80';
      } else {
        finalImg = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80';
      }
    }

    onAdd({
      name: name.trim(),
      category,
      price: parseFloat(price),
      image: finalImg
    });

    setName('');
    setPrice('');
    setImageUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-[#fffdf9] p-6 text-[#38241b] shadow-2xl border border-[var(--line)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <h2 className="font-display text-xl font-bold">បន្ថែមភេសជ្ជៈ / មុខម្ហូបថ្មី</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">ឈ្មោះទំនិញ (Product Name)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ឧ. Spanish Latte, Chocolate Muffin"
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none focus:ring-2 focus:ring-[#c4a484] bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-bold">ប្រភេទ (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none font-semibold text-sm bg-white"
              >
                <option value="Coffee">Coffee (កាហ្វេ)</option>
                <option value="Cold">Cold (ភេសជ្ជៈត្រជាក់)</option>
                <option value="Pastry">Pastry (នំបុ័ង & នំផ្អែម)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">តម្លៃ ($ USD)</label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3.50"
                className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none font-bold text-sm bg-white"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">តំណភ្ជាប់រូបភាព (Image URL - មិនបង្ខំ)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none text-xs bg-white"
            />
            <p className="mt-1 text-[11px] text-[#846b5c]">
              ប្រសិនបើទុកទទេ ប្រព័ន្ធនឹងជ្រើសរើសរូបភាពស្អាតតាមប្រភេទដោយស្វ័យប្រវត្តិ។
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#6f4e37] py-3 font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer text-sm"
          >
            + រក្សាទុកមុខទំនិញថ្មីចូល Google Sheet
          </button>
        </form>
      </div>
    </div>
  );
};

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Omit<Employee, 'id'>) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Employee['role']>('Barista');
  const [shift, setShift] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shift) return;

    onAdd({
      name: name.trim(),
      role,
      shift: shift.trim(),
      phone: phone.trim() || '012 345 678',
      clockedIn: true
    });

    setName('');
    setShift('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-[#fffdf9] p-6 text-[#38241b] shadow-2xl border border-[var(--line)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <h2 className="font-display text-xl font-bold">បន្ថែមបុគ្គលិកថ្មី</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">ឈ្មោះពេញ</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ឧ. សុខ វិចិត្រ / Vichet Sok"
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none text-sm bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">តួនាទី / មុខតំណែង</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none font-medium text-sm bg-white"
            >
              <option value="Head Barista">Head Barista</option>
              <option value="Barista">Barista</option>
              <option value="Cashier">Cashier</option>
              <option value="Shift Lead">Shift Lead</option>
              <option value="Service Staff">Service Staff</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">វេនការងារ / ម៉ោងបំពេញការងារ</label>
            <input
              type="text"
              required
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              placeholder="ឧ. វេនព្រឹក 06:30 - 14:30"
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none text-sm bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">លេខទូរស័ព្ទ</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 678"
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#6f4e37] py-3 font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer text-sm"
          >
            រក្សាទុកបុគ្គលិក
          </button>
        </form>
      </div>
    </div>
  );
};

interface EditOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSave: (orderId: string, status: OrderStatus, notes: string) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, order, onClose, onSave }) => {
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'Completed');
  const [notes, setNotes] = useState(order?.notes || '');

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setNotes(order.notes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = () => {
    onSave(order.id, status, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-6 text-[#38241b] shadow-2xl border border-[var(--line)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <h2 className="font-display text-xl font-bold">កែប្រែប្រតិបត្តិការបញ្ជាទិញ</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs uppercase text-[#846b5c] font-bold">Order Reference</p>
            <p className="text-base font-bold text-[#6f4e37]">#{order.id} - {order.customer}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">ប្តូរស្ថានភាព</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none font-semibold text-sm bg-white"
            >
              <option value="Preparing">Preparing (កំពុងរៀបចំ)</option>
              <option value="Completed">Completed (រួចរាល់)</option>
              <option value="Cancelled">Cancelled (បានបោះបង់)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">កំណត់ចំណាំ Barista / Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ឧ. ស្ករតិច, ទឹកដោះគោសណ្តែក"
              className="w-full rounded-xl border border-[var(--line)] p-2.5 outline-none text-sm bg-white"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-[#6f4e37] py-3 font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer text-sm"
          >
            កែប្រែ &amp; រក្សាទុកទៅ Google Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
