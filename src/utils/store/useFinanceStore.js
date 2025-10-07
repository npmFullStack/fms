// src/utils/store/useFinanceStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useFinanceStore = create((set, get) => ({
  // State
  arRecords: [],
  apRecords: [],
  loading: false,
  error: null,

  // Fetch Accounts Receivable
  fetchAR: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/finance/accounts-receivable");
      set({ arRecords: response.data.data || [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch AR records",
        loading: false
      });
    }
  },

  // Fetch Accounts Payable
  fetchAP: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/finance/accounts-payable");
      set({ apRecords: response.data.data || [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch AP records",
        loading: false
      });
    }
  },

  // Update AR record
  updateARRecord: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `/finance/accounts-receivable/${id}`,
        data
      );
      
      // Update local state
      const updatedRecords = get().arRecords.map(record =>
        record.id === id ? { ...record, ...response.data.data } : record
      );
      
      set({ arRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update AR record",
        loading: false
      });
      throw error;
    }
  },

  // Update AP record
  updateAPRecord: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `/finance/accounts-payable/${id}`,
        data
      );
      
      // Update local state
      const updatedRecords = get().apRecords.map(record =>
        record.id === id ? { ...record, ...response.data.data } : record
      );
      
      set({ apRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update AP record",
        loading: false
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useFinanceStore;