import { create } from "zustand";
import api from "../../config/axios";

const useIncidentStore = create((set, get) => ({
  incidents: [],
  currentIncident: null,
  loading: false,
  error: null,

  // Fetch all incidents
  fetchIncidents: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/incidents");
      set({ incidents: res.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch incidents",
        loading: false
      });
    }
  },

  // Fetch incidents by booking ID
  fetchIncidentsByBooking: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/incidents/booking/${bookingId}`);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch incidents",
        loading: false
      });
      return [];
    }
  },

  // Fetch single incident
  fetchIncidentById: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/incidents/${id}`);
      set({
        currentIncident: res.data,
        loading: false
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch incident",
        loading: false
      });
    }
  },

  // Create incident
  createIncident: async (data) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();
      
      // Append form fields
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("totalCost", data.totalCost);
      formData.append("bookingId", data.bookingId);
      
      // Append image if exists
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await api.post("/incidents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      await get().fetchIncidents();
      set({ loading: false });
      return { success: true, incident: res.data.incident };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to create incident";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Update incident
  updateIncident: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();
      
      // Append form fields
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("totalCost", data.totalCost);
      formData.append("bookingId", data.bookingId);
      
      // Append image if exists
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await api.put(`/incidents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      await get().fetchIncidents();
      set({ loading: false });
      return { success: true, incident: res.data.incident };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update incident";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Delete incident
  deleteIncident: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/incidents/${id}`);
      await get().fetchIncidents();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || "Failed to delete incident";
      set({ error, loading: false });
      return { success: false, error };
    }
  },

  // Reset helpers
  clearCurrentIncident: () => set({ currentIncident: null }),
  clearError: () => set({ error: null }),
  clearIncidents: () => set({ incidents: [], currentIncident: null, error: null })
}));

export default useIncidentStore;