import axios from "axios";

// Backend base URL (set VITE_API_URL in Vercel / .env)
let RAW = (import.meta.env.VITE_API_URL || "https://internshield-backend-latest.onrender.com/api").replace(/\/+$/, "");
if (!RAW.endsWith("/api")) RAW += "/api";
export const API_BASE_URL = RAW;

const api = axios.create({
  baseURL: API_BASE_URL,
  // Free hosts sleep when idle; the first request can take ~30-50s.
  timeout: 45000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("internshield_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expired / invalid -> clear session, send user to login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.includes("/auth/")) {
      localStorage.removeItem("internshield_token");
      localStorage.removeItem("internshield_session");
      if (!window.location.pathname.startsWith("/login")) window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

// Fire-and-forget ping so a sleeping backend starts waking while the page loads
export function warmUpBackend() {
  fetch(`${API_BASE_URL}/health`, { method: "GET", mode: "cors" }).catch(() => {});
}

export default api;
