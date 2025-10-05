// utils/store/usePaymentStore.js
import { create } from "zustand";
import api from "../../config/axios";

const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: false,
  error: null,

  // Create new payment intent (PayMongo)
  createPayment: async (paymentData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/payments", paymentData);

      if (res.data?.success) {
        set({ loading: false });
        return { success: true, data: res.data.data };
      } else {
        const error = res.data?.message || "Payment creation failed";
        set({ loading: false, error });
        return { success: false, error };
      }
    } catch (err) {
      const error =
        err.response?.data?.message || "Failed to create payment intent";
      set({ loading: false, error });
      return { success: false, error };
    }
  },

  // Fetch all payments for a booking
  fetchPaymentsByBooking: async (booking_id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/payments/${booking_id}`);
      set({ payments: res.data?.data || [], loading: false });
      return { success: true, data: res.data?.data };
    } catch (err) {
      const error =
        err.response?.data?.message || "Failed to fetch payments";
      set({ error, loading: false, payments: [] });
      return { success: false, error };
    }
  },

  // Helpers
  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ loading }),
  clearPayments: () =>
    set({ payments: [], loading: false, error: null }),
}));

export default usePaymentStore;
