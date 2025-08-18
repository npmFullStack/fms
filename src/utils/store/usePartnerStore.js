import { create } from "zustand";
import api from "../../config/axios";

const usePartnerStore = create((set, get) => ({ 
  partners: [],
  loading: false,
  error: null,
  currentPartner: null,

  // Fetch all partners
  fetchPartners: async (type = null) => {
    set({ loading: true, error: null });

    try {
      const endpoint = type === 'shipping'
        ? '/shipping-lines'
        : type === 'trucking'
          ? '/trucking-companies'
          : null;

      if (!endpoint) {
        throw new Error('Invalid partner type');
      }

      const res = await api.get(endpoint);
      set({
        partners: res.data.map(p => ({ ...p, type })),
        loading: false
      });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to fetch partners";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Fetch partner by ID
  fetchPartnerById: async (id, type) => {
    set({ loading: true, error: null });

    try {
      const endpoint = type === 'shipping'
        ? `/shipping-lines/${id}`
        : `/trucking-companies/${id}`;

      const res = await api.get(endpoint);
      set({ currentPartner: { ...res.data, type }, loading: false });
      return { success: true, partner: res.data };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to fetch partner";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Add new partner
  addPartner: async (partnerData, type) => {
    set({ loading: true, error: null });

    try {
      const endpoint = type === 'shipping'
        ? '/shipping-lines'
        : '/trucking-companies';

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      await api.post(endpoint, partnerData, config);
      await get().fetchPartners(type);
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to add partner";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update partner
  updatePartner: async (id, updatedData, type) => {
    set({ loading: true, error: null });

    try {
      const endpoint = type === 'shipping'
        ? `/shipping-lines/${id}`
        : `/trucking-companies/${id}`;

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      await api.put(endpoint, updatedData, config);
      await get().fetchPartners(type);
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update partner";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Toggle partner status
  togglePartnerStatus: async (id, type) => {
    set({ loading: true, error: null });

    try {
      const endpoint = type === 'shipping'
        ? `/shipping-lines/${id}/toggle-status`
        : `/trucking-companies/${id}/toggle-status`;

      await api.patch(endpoint);
      await get().fetchPartners(type);
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to toggle partner status";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Clear current partner
  clearCurrentPartner: () => set({ currentPartner: null }),

  // Clear error
  clearError: () => set({ error: null }),

  // Set loading state
  setLoading: loading => set({ loading }),

  // Clear all partners (for cleanup)
  clearPartners: () => set({ partners: [], currentPartner: null, error: null })
}));

export default usePartnerStore;