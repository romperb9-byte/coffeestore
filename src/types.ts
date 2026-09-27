export type Category = 'All' | 'Coffee' | 'Cold' | 'Pastry';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Coffee' | 'Cold' | 'Pastry';
  image: string;
}

export type OrderStatus = 'Completed' | 'Preparing' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Card' | 'QR Pay';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  payment: PaymentMethod;
  total: number;
  totalKhr?: number;
  notes?: string;
  items?: OrderItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Coffee' | 'Dairy' | 'Syrup' | 'Pastry' | 'Packaging';
  price: number;
  quantity: number;
  status: 'Available' | 'Low stock' | 'Sold out';
}

export interface Employee {
  id: string;
  name: string;
  role: 'Head Barista' | 'Barista' | 'Cashier' | 'Shift Lead' | 'Service Staff';
  shift: string;
  phone: string;
  clockedIn: boolean;
}

export type ActiveView = 
  | 'dashboard'
  | 'pos'
  | 'orders'
  | 'menu'
  | 'inventory'
  | 'employees'
  | 'reports'
  | 'promotions'
  | 'settings';

export type Language = 'kh' | 'en';
