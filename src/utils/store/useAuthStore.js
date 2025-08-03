import { create } from "zustand";
import api from "../../config/axios";

// This store handles login, logout, and user info
const useAuthStore = create(set => ({
    user: null,
    loading: true,

    fetchUser: async navigate => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
            if (!token) {
                navigate("/login");
                return;
            }
            
            const response = await api.get("/auth/profile");
            set({ user: response.data.user, loading: false });
        } catch (error) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem("token");
            }
            set({ user: null, loading: false });
            navigate("/login");
        }
    },

    logout: navigate => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
        }
        set({ user: null });
        navigate("/login");
    }
}));

export default useAuthStore;
