import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for InternShield frontend.
// Dev server runs on port 5173 by default (npm run dev).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enables local network access so you can view it on your phone
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
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["framer-motion"],
          "icons-vendor": ["lucide-react"],
        },
      },
    },
  },
});
