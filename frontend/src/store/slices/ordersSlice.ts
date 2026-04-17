import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '../../types';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  cart: Array<{ menuItemId: string; name: string; quantity: number; price: number }>;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  cart: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.orderId === action.payload.orderId);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    addToCart: (state, action: PayloadAction<{ menuItemId: string; name: string; quantity: number; price: number }>) => {
      const existingItem = state.cart.find(item => item.menuItemId === action.payload.menuItemId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.menuItemId !== action.payload);
    },
    updateCartQuantity: (state, action: PayloadAction<{ menuItemId: string; quantity: number }>) => {
      const item = state.cart.find(i => i.menuItemId === action.payload.menuItemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setOrders, addOrder, updateOrder, setCurrentOrder, addToCart, removeFromCart, updateCartQuantity, clearCart, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer;
