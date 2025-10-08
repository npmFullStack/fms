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
      const response = await api.get("/ap");
      set({ apRecords: response.data.apSummaries || [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch AP records",
        loading: false
      });
    }
  },

  // Get AP by ID
  getAPById: async (apId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/ap/${apId}`);
      return response.data.apSummary;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch AP record",
        loading: false
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update AP record
updateAPRecord: async (apId, data) => {
  set({ loading: true, error: null });
  try {
    const response = await api.put(`/ap/${apId}`, data);
    
    // Update local state
    const updatedRecords = get().apRecords.map(record => 
      record.ap_id === apId ? { ...record, ...response.data.apRecord } : record
    );
    
    set({ apRecords: updatedRecords, loading: false });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to update AP record";
    set({ error: errorMsg, loading: false });
    return { success: false, error: errorMsg };
  }
},

  // Add freight charge
  addFreight: async (apId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ap/${apId}/freight`, data);
      
      // Update local state
      const updatedRecords = get().apRecords.map(record =>
        record.id === apId ? { ...record, ...response.data.freight } : record
      );
      
      set({ apRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add freight charge",
        loading: false
      });
      throw error;
    }
  },

  // Update freight charge
  updateFreight: async (freightId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/ap/freight/${freightId}`, data);
      
      // Update local state
      const updatedRecords = get().apRecords.map(record => {
        if (record.freight_id === freightId) {
          return { ...record, ...response.data.freight };
        }
        return record;
      });
      
      set({ apRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update freight charge",
        loading: false
      });
      throw error;
    }
  },

  // Add trucking charge
  addTrucking: async (apId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ap/${apId}/trucking`, data);
      
      // Update local state
      const updatedRecords = get().apRecords.map(record =>
        record.id === apId ? { ...record, ...response.data.trucking } : record
      );
      
      set({ apRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add trucking charge",
        loading: false
      });
      throw error;
    }
  },

  // Add port charge
  addPortCharge: async (apId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ap/${apId}/port-charges`, data);
      
      // Update local state
      const updatedRecords = get().apRecords.map(record =>
        record.id === apId ? { ...record, ...response.data.portCharge } : record
      );
      
      set({ apRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add port charge",
        loading: false
      });
      throw error;
    }
  },

  // Add misc charge
  addMiscCharge: async (apId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ap/${apId}/misc-charges`, data);
      
      // Update local state
      const updatedRecords = get().apRecords.map(record =>
        record.id === apId ? { ...record, ...response.data.miscCharge } : record
      );
      
      set({ apRecords: updatedRecords, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add misc charge",
        loading: false
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useFinanceStore;