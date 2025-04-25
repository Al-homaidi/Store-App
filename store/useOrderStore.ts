import { create } from 'zustand';
import { Order, CartItem } from '@/types';

interface OrderStore {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  
  addOrder: (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending',
      total,
      items: [...items],
    };
    
    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));
    
    return newOrder;
  },
  
  getOrderById: (id: string) => {
    return get().orders.find((order) => order.id === id);
  },
}));