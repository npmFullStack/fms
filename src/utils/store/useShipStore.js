//  utils/store/useShipStore.js 
import { create } from "zustand";
import api from "../../config/axios";

const useShipStore = create((set, get) => ({
  ships: [],
  loading: false,
  error: null,
  currentShip: null,

  // Fetch all ships
  fetchAllShips: async () => {
    console.log("🔄 Fetching all ships...");
    set({ loading: true, error: null });
    try {
      const res = await api.get("/ships");
      console.log("📦 Ships fetched:", res.data);
      set({ ships: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Failed to fetch ships:", err);
      const error = err.response?.data?.message || "Failed to fetch ships";
      set({ error, loading: false, ships: [] });
      return { success: false, error };
    }
  },

  // Fetch ship by ID
  fetchShipById: async id => {
    console.log("🔍 Fetching ship by ID:", id);
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/ships/${id}`);
      console.log("🚢 Ship fetched:", res.data);
      set({ currentShip: res.data, loading: false });
      return { success: true, ship: res.data };
    } catch (err) {
      console.error("❌ Failed to fetch ship:", err);
      const error = err.response?.data?.message || "Failed to fetch ship";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

// Fetch ship by shipping line
fetchShipsByLine: async (lineId) => {
  set({ loading: true, error: null });
  try {
    const res = await api.get(`/ships/by-line/${lineId}`);
    set({ ships: Array.isArray(res.data) ? res.data : [], loading: false });
  return { success: true, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    const error = err.response?.data?.message || "Failed to fetch ships";
    set({ error, loading: false, ships: [] });
    return { success: false, error };
  }
},

  // Add new ship
  addShip: async shipData => {
    console.log("➕ Adding ship...");
    console.log("Ship data:", shipData);
    
    set({ loading: true, error: null });
    try {
      console.log("📤 Making POST request to /ships");
      const res = await api.post("/ships", shipData);
      console.log("✅ Ship added successfully:", res.data);
      
      // Instead of fetching all ships, let's just add the new ship to the list
      const currentShips = get().ships;
      const newShip = res.data;
      
      // If the response contains the full ship object, use it
      // Otherwise, we might need to refetch
      if (newShip.ship_name) {
        console.log("📝 Adding ship to current list");
        set({ 
          ships: [...currentShips, newShip],
          loading: false 
        });
      } else {
        console.log("🔄 Ship data incomplete, refetching all ships");
        await get().fetchAllShips();
      }
      
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Failed to add ship:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      const error = err.response?.data?.message || "Failed to add ship";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update ship
  updateShip: async (id, updatedData) => {
    console.log("🔧 Updating ship:", id);
    console.log("Update data:", updatedData);
    
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/ships/${id}`, updatedData);
      console.log("✅ Ship updated:", res.data);
      
      // Refresh ships list
      await get().fetchAllShips();
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Failed to update ship:", err);
      const error = err.response?.data?.message || "Failed to update ship";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Remove ship
  removeShip: async id => {
    console.log("🗑️ Removing ship:", id);
    
    set({ loading: true, error: null });
    try {
      await api.delete(`/ships/${id}`);
      console.log("✅ Ship removed successfully");
      
      // Refresh ships list
      await get().fetchAllShips();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      console.error("❌ Failed to remove ship:", err);
      const error = err.response?.data?.message || "Failed to remove ship";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Clear current ship
  clearCurrentShip: () => {
    console.log("🧹 Clearing current ship");
    set({ currentShip: null });
  },

  // Clear error
  clearError: () => {
    console.log("🧹 Clearing error");
    set({ error: null });
  },

  // Set loading state
  setLoading: loading => {
    console.log("⏳ Setting loading:", loading);
    set({ loading });
  },

  // Clear all ships (for cleanup)
  clearShips: () => {
    console.log("🧹 Clearing all ships");
    set({ ships: [], currentShip: null, error: null });
  },

  // Clear all data
  clearAll: () => {
    console.log("🧹 Clearing all store data");
    set({
      ships: [],
      currentShip: null,
      error: null,
      loading: false
    });
  }
}));

export default useShipStore;