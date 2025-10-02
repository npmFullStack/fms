// utils/store/useBookingStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useBookingStore = create((set, get) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  // Fetch all bookings with status history
  fetchBookings: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/bookings");
      
      // Fetch status history for each booking
      const bookingsWithHistory = await Promise.all(
        (res.data.bookings || []).map(async (booking) => {
          try {
            const historyRes = await api.get(`/bookings/${booking.id}/history`);
            return {
              ...booking,
              status_history: historyRes.data.history || []
            };
          } catch (err) {
            console.error(`Failed to fetch history for ${booking.id}:`, err);
            return {
              ...booking,
              status_history: []
            };
          }
        })
      );
      
      set({ bookings: bookingsWithHistory, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch bookings",
        loading: false
      });
    }
  },

  // Fetch single booking
  fetchBookingById: async id => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/bookings/${id}`);
      
      // Fetch status history for this booking
      const historyRes = await api.get(`/bookings/${id}/history`);
      
      set({
        currentBooking: {
          ...(res.data.booking || res.data),
          status_history: historyRes.data.history || []
        },
        loading: false
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch booking",
        loading: false
      });
    }
  },

  // Create booking
  createBooking: async data => {
    try {
      set({ loading: true, error: null });
      const payload = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
      );
      const res = await api.post("/bookings", payload);
      await get().fetchBookings();
      set({ loading: false });
      return { success: true, booking: res.data.booking };
    } catch (err) {
      const error =
        err.response?.data?.error || "Failed to create booking";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update booking
  updateBooking: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const payload = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
      );
      const res = await api.put(`/bookings/${id}`, payload);
      await get().fetchBookings();
      set({ loading: false });
      return { success: true, booking: res.data };
    } catch (err) {
      const error =
        err.response?.data?.error || "Failed to update booking";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Delete booking
  deleteBooking: async id => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/bookings/${id}`);
      await get().fetchBookings();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const error =
        err.response?.data?.error || "Failed to delete booking";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update booking status history (create or update)
  updateBookingStatusHistory: async (bookingId, status, statusDate) => {
    try {
      set({ loading: true, error: null });
      
      // Get current booking's history from state
      const currentBooking = get().bookings.find(b => b.id === bookingId);
      const existingEntry = currentBooking?.status_history?.find(h => h.status === status);
      
      if (existingEntry) {
        // Update existing history entry
        await api.patch(`/bookings/history/${existingEntry.id}`, {
          status_date: statusDate
        });
      } else {
        // Create new history entry
        await api.post(`/bookings/${bookingId}/history`, {
          status,
          status_date: statusDate
        });
      }
      
      // Refresh all bookings to get updated data
      await get().fetchBookings();
      
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const error =
        err.response?.data?.error || "Failed to update status history";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      set({ loading: true, error: null });
      const res = await api.put(`/bookings/${id}/status`, {
        status
      });
      await get().fetchBookings();
      set({ loading: false });
      return { success: true, booking: res.data };
    } catch (err) {
      const error =
        err.response?.data?.error || "Failed to update booking status";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Reset helpers
  clearCurrentBooking: () => set({ currentBooking: null }),
  clearError: () => set({ error: null }),
  clearBookings: () =>
    set({ bookings: [], currentBooking: null, error: null })
}));

export default useBookingStore;