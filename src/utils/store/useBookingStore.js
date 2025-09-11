// utils/store/useBookingStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useBookingStore = create(set => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,

    // Fetch all bookings
    fetchBookings: async () => {
        try {
            set({ loading: true, error: null });
            const res = await api.get("/api/bookings");
            set({ bookings: res.data || [], loading: false });
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
            const res = await api.get(`/api/bookings/${id}`);
            set({ currentBooking: res.data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.error || "Failed to fetch booking",
                loading: false
            });
        }
    },

    // Create booking
    createBooking: async (data) => {
  try {
    set({ loading: true, error: null });

    const { hwb_number, booking_number, ...rest } = data; // remove read-only fields
    const payload = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, v === "" ? null : v])
    );

    const res = await api.post("/api/bookings", payload);
    await set.getState().fetchBookings();
    set({ loading: false });
    return { success: true, booking: res.data };
  } catch (err) {
    const error = err.response?.data?.error || "Failed to create booking";
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
            const res = await api.put(`/api/bookings/${id}`, payload);
            await set.getState().fetchBookings();
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
            await api.delete(`/api/bookings/${id}`);
            await set.getState().fetchBookings();
            set({ loading: false });
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.error || "Failed to delete booking";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update booking status
    updateBookingStatus: async (id, status) => {
        try {
            set({ loading: true, error: null });
            const res = await api.patch(`/api/bookings/${id}/status`, {
                status
            });
            await set.getState().fetchBookings();
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
