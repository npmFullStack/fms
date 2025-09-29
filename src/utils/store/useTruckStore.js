// utils/store/useTruckStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useTruckStore = create((set, get) => ({
    trucks: [],
    loading: false,
    error: null,
    currentTruck: null,

    // Fetch all trucks
    fetchTrucks: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/trucks");
            set({ trucks: res.data, loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch trucks";
            set({ error, loading: false, trucks: [] });
            return { success: false, error };
        }
    },

    // Fetch single truck by ID
    fetchTruckById: async id => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/trucks/${id}`);
            set({ currentTruck: res.data, loading: false });
            return { success: true, truck: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Add truck
    addTruck: async truckData => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/trucks", truckData);

            // Refresh trucks list
            await get().fetchTrucks();

            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to add truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update truck
    updateTruck: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/trucks/${id}`, updatedData);
            await get().fetchTrucks(); // ✅ Changed from fetchAllTrucks
            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to update truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Delete truck
    removeTruck: async id => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/trucks/${id}`);
            await get().fetchTrucks(); // ✅ Changed from fetchAllTrucks
            set({ loading: false });
            return { success: true };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to remove truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Helpers
    clearCurrentTruck: () => set({ currentTruck: null }),
    clearError: () => set({ error: null }),
    setLoading: loading => set({ loading }),
    clearTrucks: () => set({ trucks: [], currentTruck: null, error: null }),
    clearAll: () =>
        set({
            trucks: [],
            currentTruck: null,
            error: null,
            loading: false
        })
}));

export default useTruckStore;
