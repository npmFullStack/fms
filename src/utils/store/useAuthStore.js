import { create } from "zustand";
import api from "../../config/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // Fetch current user profile
  fetchUser: async (navigate) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        set({ loading: false });
        navigate("/login");
        return;
      }
      const response = await api.get("/auth/profile");
      set({ user: response.data.user, loading: false, error: null });
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      set({ user: null, loading: false, error: error.response?.data?.message || "Authentication failed" });
      navigate("/login");
    }
  },

  // Update profile picture
  updateProfilePicture: async (imageUrl) => {
    try {
      const response = await api.post("/auth/profile-picture", { imageUrl });
      set({ user: response.data.user, error: null });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating profile picture";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Set user (for login)
  setUser: (userData) => set({ user: userData, loading: false, error: null }),

  // Logout
  logout: (navigate) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, loading: false, error: null });
    navigate("/login");
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set loading state
  setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;