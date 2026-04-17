import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CrowdData, DemandData, Prediction } from '../../types';

interface AnalyticsState {
  crowdData: CrowdData[];
  demandData: DemandData[];
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  crowdData: [],
  demandData: [],
  predictions: [],
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setCrowdData: (state, action: PayloadAction<CrowdData[]>) => {
      state.crowdData = action.payload;
    },
    setDemandData: (state, action: PayloadAction<DemandData[]>) => {
      state.demandData = action.payload;
    },
    setPredictions: (state, action: PayloadAction<Prediction[]>) => {
      state.predictions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setCrowdData, setDemandData, setPredictions, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
