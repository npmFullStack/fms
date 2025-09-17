import { create } from "zustand";
import api from "../../config/axios";

const useContainerStore = create((set, get) => ({
  containers: [],
  loading: false,
  error: null,
  currentContainer: null,

  // Fetch all containers by shipping line
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

  // Add new container
  addContainer: async (containerData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/containers", containerData);
      await get().fetchContainersByLine(containerData.shippingLineId);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to add container";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update container
  updateContainer: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/containers/${id}`, updatedData);
      await get().fetchContainersByLine(updatedData.shippingLineId);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update container";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Remove container
  removeContainer: async (id, shippingLineId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/containers/${id}`);
      await get().fetchContainersByLine(shippingLineId);
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
  clearAll: () => set({ containers: [], currentContainer: null, error: null, loading: false }),
}));

export default useContainerStore;
