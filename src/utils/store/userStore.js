import { create } from "zustand";
import api from "../../config/axios";

const useUserStore = create(set => ({
    users: [],
    fetchUsers: async () => {
        try {
            // Get token directly from localStorage
            const token = localStorage.getItem("token");
            
            // Make request with explicit headers
            const res = await api.get("/auth/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Handle the Postgres response format
            set({ users: res.data.rows || [] });
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Failed to fetch users");
        }
    }
}));

export default useUserStore;