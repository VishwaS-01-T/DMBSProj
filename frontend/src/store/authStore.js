import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("scholarlink_token"),
  role: localStorage.getItem("scholarlink_role"),
  userId: Number(localStorage.getItem("scholarlink_user_id")) || null,
  loading: false,
  login: async (username, password) => {
    set({ loading: true });
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      set({ loading: false });
      throw new Error("Invalid credentials");
    }
    const data = await res.json();
    localStorage.setItem("scholarlink_token", data.token);
    localStorage.setItem("scholarlink_role", data.role);
    localStorage.setItem("scholarlink_user_id", String(data.user_id));
    set({ token: data.token, role: data.role, userId: data.user_id, loading: false });
  },
  logout: () => {
    localStorage.removeItem("scholarlink_token");
    localStorage.removeItem("scholarlink_role");
    localStorage.removeItem("scholarlink_user_id");
    set({ token: null, role: null, userId: null });
  }
}));
