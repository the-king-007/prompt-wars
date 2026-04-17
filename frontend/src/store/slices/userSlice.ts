import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SeatInfo, GeoLocation } from '../../types';

interface UserState {
  currentLocation: GeoLocation | null;
  seatInfo: SeatInfo | null;
  ticketValidated: boolean;
  notifications: Array<{ id: string; title: string; message: string; read: boolean; timestamp: Date }>;
}

const initialState: UserState = {
  currentLocation: null,
  seatInfo: null,
  ticketValidated: false,
  notifications: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<GeoLocation>) => {
      state.currentLocation = action.payload;
    },
    setSeatInfo: (state, action: PayloadAction<SeatInfo>) => {
      state.seatInfo = action.payload;
    },
    setTicketValidated: (state, action: PayloadAction<boolean>) => {
      state.ticketValidated = action.payload;
    },
    addNotification: (state, action: PayloadAction<{ id: string; title: string; message: string; timestamp: Date }>) => {
      state.notifications.unshift({ ...action.payload, read: false });
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { setLocation, setSeatInfo, setTicketValidated, addNotification, markNotificationRead, clearNotifications } = userSlice.actions;
export default userSlice.reducer;
