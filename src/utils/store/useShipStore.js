// utils/store/useShipStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useShipStore = create((set, get) => ({
    ships: [],
    loading: false,
    error: null,
    currentShip: null,

    // Fetch all ships
    fetchAllShips: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/ships");
            set({ ships: res.data, loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to fetch ships";
            set({ error, loading: false, ships: [] });
            return { success: false, error };
        }
    },

    // Fetch ship by ID
    fetchShipById: async id => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/ships/${id}`);
            set({ currentShip: res.data, loading: false });
            return { success: true, ship: res.data };
        } catch (err) {
            const error = err.response?.data?.message || "Failed to fetch ship";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Add new ship
    addShip: async shipData => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/ships", shipData);

            // Refresh ships list
            await get().fetchAllShips();

            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.message || "Failed to add ship";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update ship
    updateShip: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ships/${id}`, updatedData);

            // Refresh ships list
            await get().fetchAllShips();

            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to update ship";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Remove ship
    removeShip: async id => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/ships/${id}`);

            // Refresh ships list
            await get().fetchAllShips();

            set({ loading: false });
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to remove ship";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Clear current ship
    clearCurrentShip: () => set({ currentShip: null }),

    // Clear error
    clearError: () => set({ error: null }),

    // Set loading state
    setLoading: loading => set({ loading }),

    // Clear all ships (for cleanup)
    clearShips: () => set({ ships: [], currentShip: null, error: null }),

    // Clear all data
    clearAll: () =>
        set({
            ships: [],
            currentShip: null,
            error: null,
            loading: false
        })
}));

export default useShipStore;
