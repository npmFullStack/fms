import { create } from "zustand";
import api from "../../config/axios";

const useAuthStore = create((set) => ({
  user: null,
  users: [],
  loading: true,

  fetchUser: async (navigate) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!token) {
        set({ loading: false });
        navigate("/login");
        return;
      }

      const response = await api.get("/auth/profile");
      set({ user: response.data.user, loading: false });
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      set({ user: null, loading: false });
      navigate("/login");
    }
  },

  updateProfilePicture: async (imageUrl) => {
    try {
      const response = await api.post("/auth/profile-picture", { imageUrl });
      set({ user: response.data.user });
      return true;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      return false;
    }
  },

  setUser: (userData) => set({ user: userData, loading: false }),

  logout: (navigate) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null });
    navigate("/login");
  },

  fetchUsers: async () => {
    const res = await api.get("/auth/users");
    set({ users: res.data.rows || [] });
  }
}));

export default useAuthStore;