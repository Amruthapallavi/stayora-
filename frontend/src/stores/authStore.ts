import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createAuthSlice } from '../stores/slices/authSlice';

import { AppState, AuthState } from '../types/storeTypes';
import { createPropertySlice } from './slices/propertySlice';
import { createChatSlice } from './slices/chatSlice';
import { createFeatureSlice } from './slices/featureSlice';
import { createServiceSlice } from './slices/serviceSlice';
import { createAdminSlice } from './slices/adminSlice';
import { createBookingSlice } from './slices/bookingSlice';

export const useAuthStore = create<AppState>()(
   persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createPropertySlice(...a),
      ...createChatSlice(...a),
      ...createFeatureSlice(...a),
      ...createServiceSlice(...a),
      ...createAdminSlice(...a),
      ...createBookingSlice(...a),
    }),
    {
      name: 'auth-storage',
    storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        user: state.user,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
