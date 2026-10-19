import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// In development the screens run on Vite's server and send API requests to the API on port 8080,
// which runs on its own (it lives in D-E-A-G/qbank-server). `vite preview` sends them there too.
const api = "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": api,
      "/health": api,
      "/openapi.json": api,
    },
  },
});
