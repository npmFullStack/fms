// utils/store/useContainerStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useContainerStore = create((set, get) => ({
  containers: [],
  allContainers: [],
  loading: false,
  error: null,
  currentContainer: null,

  // Fetch containers by shipping line (only returned ones - for booking selection)
  fetchContainersByLine: async (shippingLineId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/containers/line/${shippingLineId}`);
      set({ containers: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to fetch containers";
      set({ error, loading: false, containers: [] });
      return { success: false, error };
    }
  },

  // Fetch ALL containers by shipping line (both returned and in-use - for management table)
  fetchAllContainersByLine: async (shippingLineId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/containers/line/${shippingLineId}/all`);
      set({ allContainers: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to fetch all containers";
      set({ error, loading: false, allContainers: [] });
      return { success: false, error };
    }
  },

  // Add new container
  addContainer: async (containerData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/containers", containerData);
      // Refresh both container lists
      await get().fetchContainersByLine(containerData.shippingLineId);
      await get().fetchAllContainersByLine(containerData.shippingLineId);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to add container";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update container with return date tracking
  updateContainer: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/containers/${id}`, updatedData);
      // Refresh both container lists if shippingLineId is provided
      if (updatedData.shippingLineId) {
        await get().fetchContainersByLine(updatedData.shippingLineId);
        await get().fetchAllContainersByLine(updatedData.shippingLineId);
      }
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update container";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Mark container as returned with date
  markContainerAsReturned: async (id, shippingLineId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/containers/${id}`, {
        isReturned: true
      });
      // Refresh both container lists
      await get().fetchContainersByLine(shippingLineId);
      await get().fetchAllContainersByLine(shippingLineId);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to mark container as returned";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Remove container
  removeContainer: async (id, shippingLineId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/containers/${id}`);
      // Refresh both container lists
      await get().fetchContainersByLine(shippingLineId);
      await get().fetchAllContainersByLine(shippingLineId);
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to remove container";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  clearCurrentContainer: () => set({ currentContainer: null }),
  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ loading }),
  clearAll: () => set({ 
    containers: [], 
    allContainers: [], 
    currentContainer: null, 
    error: null, 
    loading: false 
  })
}));

export default useContainerStore;