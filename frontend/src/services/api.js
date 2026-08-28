import axios from "axios";

// Single axios instance for the whole app, per the project plan
// ("Frontend mistakes to avoid: putting API calls directly inside every
// component"). Point VITE_API_URL at your Spring Boot backend once it's
// running, e.g. http://localhost:8080/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://internshield-production.up.railway.app/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (if we have one) to every outgoing request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("internshield_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
