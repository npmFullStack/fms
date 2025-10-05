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
    set({
      allContainers: Array.isArray(res.data) ? res.data : [],
      loading: false
    });
    return {
      success: true,
      data: Array.isArray(res.data) ? res.data : []
    };
  } catch (err) {
    const error =
      err.response?.data?.message || "Failed to fetch all containers";
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
      const payload = {
     size: updatedData.size ?? null,
     van_number: updatedData.vanNumber ?? null,
     is_returned: updatedData.isReturned ?? null,
    returned_date: updatedData.returnedDate ?? null,
    shipping_line_id: updatedData.shippingLineId ?? null
  };
   const res = await api.put(`/containers/${id}`, payload);
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


markContainerAsReturned: async (id, shippingLineId, returnedDate = null) => {
  set({ loading: true, error: null });
  try {
    const payload = {
      isReturned: true
    };
    
    // If a date is provided, include it
    if (returnedDate) {
      payload.returnedDate = returnedDate;
    }
    
    const res = await api.put(`/containers/${id}`, payload);
    
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