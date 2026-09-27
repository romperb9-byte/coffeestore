import { Product, InventoryItem, Employee, Order } from '../types';

export const initialProducts: Product[] = [
  {
    id: "espresso",
    name: "Espresso Italiano",
    price: 2.50,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "latte",
    name: "Caramel Macchiato",
    price: 3.75,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    price: 3.50,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "coconut-americano",
    name: "Coconut Iced Americano",
    price: 3.80,
    category: "Cold",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "coldbrew",
    name: "Vanilla Cold Brew",
    price: 4.00,
    category: "Cold",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "matcha",
    name: "Iced Matcha Latte",
    price: 4.25,
    category: "Cold",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "croissant",
    name: "Butter French Croissant",
    price: 2.75,
    category: "Pastry",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80"
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Arabica Espresso Beans (1kg)",
    category: "Coffee",
    price: 18.50,
    quantity: 14,
    status: "Available"
  },
  {
    id: "inv-2",
    name: "Organic Oat Milk (1L)",
    category: "Dairy",
    price: 3.20,
    quantity: 4,
    status: "Low stock"
  },
  {
    id: "inv-3",
    name: "Vanilla Bean Syrup (750ml)",
    category: "Syrup",
    price: 8.00,
    quantity: 2,
    status: "Low stock"
  },
  {
    id: "inv-4",
    name: "Takeaway Cups 16oz (100pcs)",
    category: "Packaging",
    price: 12.00,
    quantity: 25,
    status: "Available"
  },
  {
    id: "inv-5",
    name: "Imported French Butter (500g)",
    category: "Dairy",
    price: 6.50,
    quantity: 8,
    status: "Available"
  }
];

export const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "សុខ វិចិត្រ (Vichet Sok)",
    role: "Head Barista",
    shift: "Morning 06:30 - 15:00",
    phone: "012 889 001",
    clockedIn: true
  },
  {
    id: "emp-2",
    name: "ចាន់ សុភ័ក្រ្ត (Sopheak Chan)",
    role: "Shift Lead",
    shift: "Midday 10:00 - 18:30",
    phone: "098 776 554",
    clockedIn: true
  },
  {
    id: "emp-3",
    name: "លី ស្រីម៉ៅ (Srey Mao Ly)",
    role: "Cashier",
    shift: "Evening 13:00 - 21:00",
    phone: "077 123 456",
    clockedIn: false
  }
];

export const initialOrders: Order[] = [
  {
    id: "CS-2048",
    customer: "Sokha Lim",
    date: "Today, 10:42",
    status: "Completed",
    payment: "Card",
    total: 14.50,
    notes: "Cold brew with oat milk",
    items: [
      { product: initialProducts[4], quantity: 2 },
      { product: initialProducts[2], quantity: 1 },
      { product: initialProducts[6], quantity: 1 }
    ]
  },
  {
    id: "CS-2047",
    customer: "Emma Davis",
    date: "Today, 10:31",
    status: "Preparing",
    payment: "Cash",
    total: 9.25,
    notes: "Extra hot caramel latte",
    items: [
      { product: initialProducts[1], quantity: 2 },
      { product: initialProducts[0], quantity: 1 }
    ]
  },
  {
    id: "CS-2046",
    customer: "Dara Chan",
    date: "Today, 09:50",
    status: "Completed",
    payment: "QR Pay",
    total: 12.45,
    notes: "2x Croissant + Espresso",
    items: [
      { product: initialProducts[0], quantity: 1 },
      { product: initialProducts[6], quantity: 2 }
    ]
  }
];
