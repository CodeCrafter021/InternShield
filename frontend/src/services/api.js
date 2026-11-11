import axios from "axios";

// Backend base URL (set VITE_API_URL in Vercel / .env)
export const API_BASE_URL = "https://internshield-backend-latest.onrender.com/" || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  // Free hosts sleep when idle; the first request can take 1-2 minutes (Spring Boot cold start).
  timeout: 120000,
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

// Render's free server sleeps and needs 1-2 minutes to start. While it starts, its proxy
// answers with an error that has no CORS header, so the browser reports "cannot reach server".
// This waits (quietly polling /health) until the server is really up, BEFORE we send a
// one-time login code or a password to it.
let lastHealthyAt = 0;

export async function waitForBackend({ maxWaitMs = 180000, onWaiting } = {}) {
  if (Date.now() - lastHealthyAt < 5 * 60 * 1000) return true; // answered recently
  const start = Date.now();
  let notified = false;
  while (Date.now() - start < maxWaitMs) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        lastHealthyAt = Date.now();
        return true;
      }
    } catch {
      /* still starting up */
    }
    if (!notified && onWaiting) {
      notified = true;
      onWaiting();
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
  return false;
}

export default api;