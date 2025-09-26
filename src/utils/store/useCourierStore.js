// utils/store/useCourierStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useCourierStore = create((set, get) => ({
  courierData: {},
  loading: false,
  error: null,

  // Fetch shipping timeline data by HWB or booking number
  fetchShippingTimeline: async (query) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/couriers/public/search/${query}`);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.error || "Failed to fetch shipping data";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Store courier data for a specific booking
  setCourierData: (bookingId, data) => {
    set((state) => ({
      courierData: {
        ...state.courierData,
        [bookingId]: data
      }
    }));
  },

  clearError: () => set({ error: null })
}));

export default useCourierStore;