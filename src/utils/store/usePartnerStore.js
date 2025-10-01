// utils/store/usePartnerStore
import { create } from "zustand";
import api from "../../config/axios";

const usePartnerStore = create((set, get) => ({
    partners: [],
    loading: false,
    error: null,
    currentPartner: null,

    // Fetch all partners (both shipping & trucking)
    fetchPartners: async () => {
        set({ loading: true, error: null });

        try {
            const [shippingRes, truckingRes] = await Promise.all([
                api.get("/shipping-lines"),
                api.get("/trucking-companies")
            ]);

            const shippingPartners = shippingRes.data.map(p => ({
                ...p,
                type: "shipping"
            }));
            const truckingPartners = truckingRes.data.map(p => ({
                ...p,
                type: "trucking"
            }));

            set({
                partners: [...shippingPartners, ...truckingPartners],
                loading: false
            });

            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to fetch partners";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Fetch partner by ID
    fetchPartnerById: async (id, type) => {
        set({ loading: true, error: null });

        try {
            const endpoint =
                type === "shipping"
                    ? `/shipping-lines/${id}`
                    : `/trucking-companies/${id}`;

            const res = await api.get(endpoint);
            set({ currentPartner: { ...res.data, type }, loading: false });
            return { success: true, partner: res.data };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to fetch partner";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Fetch success booking by partner
    fetchSuccessBookings: async (id, type) => {
        try {
            const endpoint =
                type === "shipping"
                    ? `/shipping-lines/${id}/success-bookings`
                    : `/trucking-companies/${id}/success-bookings`;

            const res = await api.get(endpoint);
            return res.data.totalSuccess;
        } catch (err) {
            console.error("Failed to fetch success bookings:", err);
            return 0;
        }
    },

    // Add new partner
    addPartner: async (partnerData, type) => {
        set({ loading: true, error: null });

        try {
            const endpoint =
                type === "shipping" ? "/shipping-lines" : "/trucking-companies";

            const config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            await api.post(endpoint, partnerData, config);

            // First refresh (instant feedback)
            await get().fetchPartners(type);

            // Schedule a second refresh (fetch updated logo)
            setTimeout(async () => {
                await get().fetchPartners(type);
            }, 3000); // ⏳ wait 3s for Cloudinary to finish

            set({ loading: false });
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to add partner";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update partner
    updatePartner: async (id, updatedData, type) => {
        set({ loading: true, error: null });

        try {
            const endpoint =
                type === "shipping"
                    ? `/shipping-lines/${id}`
                    : `/trucking-companies/${id}`;

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };

            await api.put(endpoint, updatedData, config);
            await get().fetchPartners(type);
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to update partner";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Remove partner
    removePartner: async (id, type) => {
        set({ loading: true, error: null });

        try {
            const endpoint =
                type === "shipping"
                    ? `/shipping-lines/${id}`
                    : `/trucking-companies/${id}`;

            await api.delete(endpoint);
            await get().fetchPartners(type);
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to remove partner";
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
    clearPartners: () =>
        set({ partners: [], currentPartner: null, error: null })
}));

export default usePartnerStore;
