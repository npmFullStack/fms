// utils/store/useBookingStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useBookingStore = create((set, get) => ({
    bookings: [],
    loading: false,
    error: null,
    currentBooking: null,

    // Fetch all bookings
    fetchBookings: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/api/bookings");
            set({ bookings: res.data || [], loading: false });
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.error || "Failed to fetch bookings";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Fetch booking by ID
    fetchBookingById: async id => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/api/bookings/${id}`);
            set({ currentBooking: res.data, loading: false });
            return { success: true, booking: res.data };
        } catch (err) {
            const error =
                err.response?.data?.error || "Failed to fetch booking";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Create new booking
    createBooking: async bookingData => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/api/bookings", bookingData);
            // Refresh bookings list
            await get().fetchBookings();
            set({ loading: false });
            return { success: true, booking: res.data };
        } catch (err) {
            const error =
                err.response?.data?.error || "Failed to create booking";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update booking
    updateBooking: async (id, bookingData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/api/bookings/${id}`, bookingData);
            // Refresh bookings list
            await get().fetchBookings();
            // Update currentBooking if it's the same booking being edited
            if (get().currentBooking?.id === id) {
                set({
                    currentBooking: { ...get().currentBooking, ...bookingData }
                });
            }
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
        set({ loading: true, error: null });
        try {
            await api.delete(`/api/bookings/${id}`);
            // Refresh bookings list
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

    // Update booking status
    updateBookingStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const res = await api.patch(`/api/bookings/${id}/status`, {
                status
            });
            // Refresh bookings list
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

    // Get bookings by customer ID
    getBookingsByCustomerId: async customerId => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/api/bookings/customer/${customerId}`);
            set({ loading: false });
            return { success: true, bookings: res.data };
        } catch (err) {
            const error =
                err.response?.data?.error ||
                "Failed to fetch customer bookings";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Clear current booking
    clearCurrentBooking: () => set({ currentBooking: null }),

    // Clear error
    clearError: () => set({ error: null }),

    // Clear all bookings
    clearBookings: () =>
        set({ bookings: [], currentBooking: null, error: null })
}));

export default useBookingStore;
