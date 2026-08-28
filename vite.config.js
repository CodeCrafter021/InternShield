import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for InternShield frontend.
// Dev server runs on port 5173 by default (npm run dev).
export default defineConfig({
  base: "/InternShield/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
