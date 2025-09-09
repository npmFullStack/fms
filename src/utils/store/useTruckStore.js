// utils/store/useTruckStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useTruckStore = create((set, get) => ({
    trucks: [],
    truckingCompanies: [],
    loading: false,
    error: null,
    currentTruck: null,

    // Fetch all trucking companies
    fetchTruckingCompanies: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/trucking-companies");
            set({ truckingCompanies: res.data, loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch trucking companies";
            set({ error, loading: false, truckingCompanies: [] });
            return { success: false, error };
        }
    },

    // Fetch all trucks for a trucking company
    fetchTrucks: async (truckingCompanyId) => {
        if (!truckingCompanyId) {
            return { success: false, error: "Trucking Company ID is required" };
        }

        set({ loading: true, error: null });
        try {
            const res = await api.get("/api/trucks");
            // Filter trucks by trucking company ID
            const companyTrucks = res.data.filter(
                (truck) => truck.trucking_company_id === truckingCompanyId
            );
            set({ trucks: companyTrucks, loading: false });
            return { success: true, data: companyTrucks };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch trucks";
            set({ error, loading: false, trucks: [] });
            return { success: false, error };
        }
    },

    // Fetch all trucks (without filtering)
    fetchAllTrucks: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/api/trucks");
            set({ trucks: res.data, loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch trucks";
            set({ error, loading: false, trucks: [] });
            return { success: false, error };
        }
    },

    // Fetch single truck by ID
    fetchTruckById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/api/trucks/${id}`);
            set({ currentTruck: res.data, loading: false });
            return { success: true, truck: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to fetch truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Add truck
    addTruck: async (truckData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/api/trucks", truckData);

            if (truckData.trucking_company_id) {
                await get().fetchTrucks(truckData.trucking_company_id);
            }

            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to add truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update truck
    updateTruck: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/api/trucks/${id}`, updatedData);

            if (updatedData.trucking_company_id) {
                await get().fetchTrucks(updatedData.trucking_company_id);
            }

            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to update truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Delete truck
    removeTruck: async (id) => {
        const currentTrucks = get().trucks;
        const truckToDelete = currentTrucks.find((t) => t.id === id);

        set({ loading: true, error: null });
        try {
            await api.delete(`/api/trucks/${id}`);

            if (truckToDelete?.trucking_company_id) {
                await get().fetchTrucks(truckToDelete.trucking_company_id);
            }

            set({ loading: false });
            return { success: true };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to remove truck";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Add trucking company
    addTruckingCompany: async (companyData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/trucking-companies", companyData);
            // Refresh trucking companies list
            await get().fetchTruckingCompanies();
            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to add trucking company";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update trucking company
    updateTruckingCompany: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/trucking-companies/${id}`, updatedData);
            // Refresh trucking companies list
            await get().fetchTruckingCompanies();
            set({ loading: false });
            return { success: true, data: res.data };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to update trucking company";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Delete trucking company
    removeTruckingCompany: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/trucking-companies/${id}`);
            // Refresh trucking companies list
            await get().fetchTruckingCompanies();
            set({ loading: false });
            return { success: true };
        } catch (err) {
            const error = err.response?.data?.error || "Failed to remove trucking company";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Helpers
    clearCurrentTruck: () => set({ currentTruck: null }),
    clearError: () => set({ error: null }),
    setLoading: (loading) => set({ loading }),
    clearTrucks: () => set({ trucks: [], currentTruck: null, error: null }),
    clearTruckingCompanies: () => set({ truckingCompanies: [], error: null }),
    clearAll: () => set({ 
        trucks: [], 
        truckingCompanies: [], 
        currentTruck: null, 
        error: null,
        loading: false 
    })
}));

export default useTruckStore;