// utils/store/useUserStore.js
import { create } from "zustand";
import api from "../../config/axios";

const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,
    currentUser: null,

    // Fetch all users (admin function)
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/users");
            set({ users: res.data.rows || [], loading: false });
            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to fetch users";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Add new user (admin function) - Updated to handle FormData
    addUser: async userData => {
        set({ loading: true, error: null });
        try {

            const config = {
                headers: {
                    Accept: "application/json"
                }
            };

            await api.post("/users", userData, config);

            // Refresh user list after adding
            await get().fetchUsers();
            return { success: true };
        } catch (err) {
            const error = err.response?.data?.message || "Failed to add user";
            set({ error, loading: false });
            return { success: false, error };
        }
    },
    // Fetch user by ID
    fetchUserById: async id => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/users/${id}`);
            set({ currentUser: res.data, loading: false });
            return { success: true, user: res.data };
        } catch (err) {
            const error = err.response?.data?.message || "Failed to fetch user";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Update user - Updated to handle FormData
    updateUser: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const config = {};
            if (updatedData instanceof FormData) {
                config.headers = {
                    // Don't set Content-Type for FormData
                };
            }

            await api.put(`/users/${id}`, updatedData, config);

            // Refresh user list after updating
            await get().fetchUsers();

            // Update currentUser if it's the same user being edited
            if (get().currentUser?.id === id) {
                const updatedUser = { ...get().currentUser, ...updatedData };
                set({ currentUser: updatedUser });
            }

            return { success: true };
        } catch (err) {
            const error =
                err.response?.data?.message || "Failed to update user";
            set({ error, loading: false });
            return { success: false, error };
        }
    },

    // Clear current user
    clearCurrentUser: () => set({ currentUser: null }),

    // Clear error
    clearError: () => set({ error: null }),

    // Set loading state
    setLoading: loading => set({ loading }),

    // Clear all users (for cleanup)
    clearUsers: () => set({ users: [], currentUser: null, error: null })
}));

export default useUserStore;
