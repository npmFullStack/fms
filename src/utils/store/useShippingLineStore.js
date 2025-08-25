import { create } from "zustand";
import api from "../../config/axios";

const useShippingLineStore = create((set, get) => ({
  ships: [],
  loading: false,
  error: null,
  currentShip: null,

  // Fetch all ships for a shipping line
  fetchShips: async (shippingLineId) => {
    if (!shippingLineId) return { success: false, error: "Shipping Line ID is required" };
    
    set({ loading: true, error: null });
    try {
      const res = await api.get("/ships");
      // Filter ships by shipping line ID
      const shippingLineShips = res.data.filter(ship => ship.shipping_line_id === shippingLineId);
      
      set({
        ships: shippingLineShips,
        loading: false
      });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to fetch ships";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Fetch ship by ID
  fetchShipById: async (id) => {
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
  addShip: async (shipData) => {
    set({ loading: true, error: null });
    try {
      await api.post("/ships", shipData);
      
      // Refresh ships list for the shipping line
      if (shipData.shippingLineId) {
        await get().fetchShips(shipData.shippingLineId);
      }
      
      set({ loading: false });
      return { success: true };
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
      await api.put(`/ships/${id}`, updatedData);
      
      // Refresh ships list for the shipping line
      if (updatedData.shippingLineId) {
        await get().fetchShips(updatedData.shippingLineId);
      }
      
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update ship";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Remove ship
  removeShip: async (id) => {
    const currentShips = get().ships;
    const shipToDelete = currentShips.find(ship => ship.id === id);
    
    set({ loading: true, error: null });
    try {
      await api.delete(`/ships/${id}`);
      
      // Refresh ships list for the shipping line
      if (shipToDelete?.shipping_line_id) {
        await get().fetchShips(shipToDelete.shipping_line_id);
      }
      
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to remove ship";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Clear current ship
  clearCurrentShip: () => set({ currentShip: null }),

  // Clear error
  clearError: () => set({ error: null }),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Clear all ships (for cleanup)
  clearShips: () => set({ ships: [], currentShip: null, error: null })
}));

export default useShippingLineStore;