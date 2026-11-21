import axios from "axios";

// Backend base URL (set VITE_API_URL in Vercel / .env)
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
  || "https://internshield-backend-latest.onrender.com";
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
export const API_BASE_URL = /\/api$/i.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  // Free hosts sleep when idle; the first request can take 1-2 minutes (Spring Boot cold start).
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("internshield_token");
  const skipAuth = config._skipAuth;
  delete config._skipAuth;
  if (token && !skipAuth) config.headers.Authorization = `Bearer ${token}`;
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

let lastHealthyAt = 0;
let warmUpPromise = null;

// Start waking a sleeping backend before a user submits credentials or leaves for OAuth.
export function warmUpBackend() {
  if (Date.now() - lastHealthyAt < 5 * 60 * 1000) return Promise.resolve(true);
  if (warmUpPromise) return warmUpPromise;

  warmUpPromise = (async () => {
    const startedAt = Date.now();
    while (Date.now() - startedAt < 180000) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      try {
        const res = await fetch(`${API_BASE_URL}/health`, {
          method: "GET",
          mode: "cors",
          cache: "no-store",
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (res.ok) {
          lastHealthyAt = Date.now();
          return true;
        }
      } catch {
        // Render may still be starting the Spring Boot instance.
      } finally {
        clearTimeout(timer);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    return false;
  })().finally(() => {
    warmUpPromise = null;
  });

  return warmUpPromise;
}

// Render's free server sleeps and needs 1-2 minutes to start. While it starts, its proxy
// answers with an error that has no CORS header, so the browser reports "cannot reach server".
// This waits (quietly polling /api/health) until the server is really up before sending
// a one-time login code or a password to it.
export async function waitForBackend({ maxWaitMs = 180000, onWaiting } = {}) {
  if (Date.now() - lastHealthyAt < 5 * 60 * 1000) return true; // answered recently
  let waitingTimer;
  if (onWaiting) waitingTimer = setTimeout(onWaiting, 750);
  try {
    const warming = warmUpBackend();
    const timeout = new Promise((resolve) => setTimeout(() => resolve(false), maxWaitMs));
    return await Promise.race([warming, timeout]);
  } finally {
    clearTimeout(waitingTimer);
  }
}

export default api;