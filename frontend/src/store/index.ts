import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import ordersReducer from './slices/ordersSlice';
import analyticsReducer from './slices/analyticsSlice';
import vendorReducer from './slices/vendorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    orders: ordersReducer,
    analytics: analyticsReducer,
    vendor: vendorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
