import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Vendor } from '../../types';

interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  loading: false,
  error: null
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload;
    },
    updateVendor: (state, action: PayloadAction<Vendor>) => {
      const index = state.vendors.findIndex(v => v.vendorId === action.payload.vendorId);
      if (index !== -1) {
        state.vendors[index] = action.payload;
      }
    },
    setCurrentVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setVendors, updateVendor, setCurrentVendor, setLoading, setError } = vendorSlice.actions;
export default vendorSlice.reducer;
