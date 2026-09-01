import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for InternShield frontend.
// Dev server runs on port 5173 by default (npm run dev).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
