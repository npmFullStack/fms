import { create } from "zustand";
import api from "../../config/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Fetch user profile
  fetchUser: async (navigate) => {
  console.log("[AuthStore] fetchUser called");

  if (typeof window === "undefined" || !window.localStorage) {
    console.warn("[AuthStore] Browser environment not ready");
    set({ loading: false });
    return;
  }

  const token = window.localStorage.getItem("token");
  console.log("[AuthStore] Token:", token);

  if (!token) {
    console.warn("[AuthStore] No token found, redirecting to login");
    set({ loading: false });
    navigate("/login");
    return;
  }

  try {
    console.log("[AuthStore] Requesting /auth/profile...");
    const response = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("[AuthStore] User fetched:", response.data.user);
    set({ user: response.data.user, loading: false });
  } catch (error) {
    console.error("[AuthStore] Error fetching profile:", error);
    window.localStorage.removeItem("token");
    set({ user: null, loading: false });
    navigate("/login");
  }
},


  // Set user directly after login
  setUser: (userData) => {
    console.log("[AuthStore] Setting user after login:", userData);
    set({ user: userData, loading: false });
  },

  logout: (navigate) => {
    console.log("[AuthStore] Logging out");
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("token");
    }
    set({ user: null });
    navigate("/login");
  }
}));

export default useAuthStore;

