import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      "/api/tasks": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  "react/prop-types": "off",
});
