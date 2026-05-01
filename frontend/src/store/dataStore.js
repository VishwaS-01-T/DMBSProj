import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiFetch = async (path, token, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
};

export const useDataStore = create((set) => ({
  matches: [],
  pendingAthletics: [],
  mcmLeaderboard: [],
  cgpaRanks: [],
  adminStats: {},
  adminScholarships: [],
  adminApplications: [],
  adminStudents: [],
  studentProfile: null,
  loading: false,
  loadStudentProfile: async (studentId, token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/students/${studentId}`, token);
    set({ studentProfile: data, loading: false });
  },
  loadMatches: async (studentId, token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/students/${studentId}/matches`, token);
    set({ matches: data, loading: false });
  },
  loadPendingAthletics: async (token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/athletics/pending`, token);
    set({ pendingAthletics: data, loading: false });
  },
  verifyAthletics: async (recordId, token) => {
    await apiFetch(`/api/admin/athletics/${recordId}/verify`, token, { method: "PUT" });
  },
  loadMcmLeaderboard: async (token, department) => {
    set({ loading: true });
    const query = department ? `?department=${encodeURIComponent(department)}` : "";
    const data = await apiFetch(`/api/admin/mcm/leaderboard${query}`, token);
    set({ mcmLeaderboard: data, loading: false });
  },
  loadCgpaRanks: async (token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/college/cgpa-ranks`, token);
    set({ cgpaRanks: data, loading: false });
  },
  loadAdminStats: async (token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/stats`, token);
    set({ adminStats: data, loading: false });
  },
  loadAdminScholarships: async (token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/scholarships`, token);
    set({ adminScholarships: data, loading: false });
  },
  loadAdminApplications: async (token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/applications`, token);
    set({ adminApplications: data, loading: false });
  },
  loadStudentApplications: async (studentId, token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/students/${studentId}/applications`, token);
    set({ adminApplications: data, loading: false });
  },
  loadAdminStudents: async (token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/students`, token);
    set({ adminStudents: data, loading: false });
  },
  createScholarship: async (scholarship, token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/scholarships`, token, {
      method: "POST",
      body: JSON.stringify(scholarship)
    });
    set({ loading: false });
    return data;
  },
  updateApplicationStatus: async (applicationId, status, remarks, token) => {
    set({ loading: true });
    const data = await apiFetch(`/api/admin/applications/${applicationId}`, token, {
      method: "PUT",
      body: JSON.stringify({ status, remarks })
    });
    set({ loading: false });
    return data;
  },
  deleteApplication: async (applicationId, token) => {
    set({ loading: true });
    await apiFetch(`/api/admin/applications/${applicationId}`, token, { method: "DELETE" });
    set({ loading: false });
  }
}));
