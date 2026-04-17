import { describe, it, expect, beforeEach } from 'vitest';
import { addToCart, removeFromCart, clearCart, updateCartQuantity } from '../src/store/slices/ordersSlice';
import { setLocation, setSeatInfo, setTicketValidated } from '../src/store/slices/userSlice';
import { setCrowdData, setDemandData, setPredictions } from '../src/store/slices/analyticsSlice';

describe('Orders Slice', () => {
  let state: ReturnType<typeof ordersSlice.getInitialState>;

  beforeEach(() => {
    const initialState = {
      orders: [],
      currentOrder: null,
      cart: [],
      loading: false,
      error: null
    };
  });

  it('should add item to cart', () => {
    const action = addToCart({
      menuItemId: '1',
      name: 'Cheeseburger',
      quantity: 1,
      price: 12.99
    });
    
    expect(action.type).toBe('orders/addToCart');
    expect(action.payload).toEqual({
      menuItemId: '1',
      name: 'Cheeseburger',
      quantity: 1,
      price: 12.99
    });
  });

  it('should remove item from cart', () => {
    const action = removeFromCart('1');
    expect(action.type).toBe('orders/removeFromCart');
    expect(action.payload).toBe('1');
  });

  it('should clear cart', () => {
    const action = clearCart();
    expect(action.type).toBe('orders/clearCart');
  });

  it('should calculate cart total correctly', () => {
    const cart = [
      { menuItemId: '1', name: 'Burger', quantity: 2, price: 12.99 },
      { menuItemId: '2', name: 'Fries', quantity: 1, price: 6.99 }
    ];
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(32.97);
  });
});

describe('User Slice', () => {
  it('should set user location', () => {
    const location = { lat: 40.7128, lng: -74.0060, timestamp: new Date() };
    const action = setLocation(location);
    
    expect(action.type).toBe('user/setLocation');
    expect(action.payload).toEqual(location);
  });

  it('should set seat info', () => {
    const seatInfo = { section: 'A', row: '1', seat: '12' };
    const action = setSeatInfo(seatInfo);
    
    expect(action.type).toBe('user/setSeatInfo');
    expect(action.payload).toEqual(seatInfo);
  });

  it('should validate ticket', () => {
    const action = setTicketValidated(true);
    expect(action.type).toBe('user/setTicketValidated');
    expect(action.payload).toBe(true);
  });
});

describe('Analytics Slice', () => {
  it('should set crowd data', () => {
    const crowdData = [
      { zoneId: 'zone-1', density: 85, count: 850 },
      { zoneId: 'zone-2', density: 45, count: 450 }
    ];
    const action = setCrowdData(crowdData as any);
    
    expect(action.type).toBe('analytics/setCrowdData');
    expect(action.payload).toEqual(crowdData);
  });

  it('should set demand data', () => {
    const demandData = [
      { zoneId: 'zone-1', orders: 120, revenue: 1200 },
      { zoneId: 'zone-2', orders: 85, revenue: 850 }
    ];
    const action = setDemandData(demandData as any);
    
    expect(action.type).toBe('analytics/setDemandData');
  });
});

describe('Utility Functions', () => {
  it('should format currency correctly', () => {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    expect(formatCurrency(12.99)).toBe('$12.99');
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('should calculate distance between coordinates', () => {
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    
    const distance = calculateDistance(40.7128, -74.0060, 40.7580, -73.9855);
    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(7);
  });

  it('should get density color correctly', () => {
    const getDensityColor = (density: number) => {
      if (density >= 80) return '#D62828';
      if (density >= 60) return '#F77F00';
      if (density >= 40) return '#E0A458';
      return '#2EC4B6';
    };
    
    expect(getDensityColor(85)).toBe('#D62828');
    expect(getDensityColor(65)).toBe('#F77F00');
    expect(getDensityColor(45)).toBe('#E0A458');
    expect(getDensityColor(25)).toBe('#2EC4B6');
  });
});
