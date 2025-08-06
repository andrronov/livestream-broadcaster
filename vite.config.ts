import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      process.env.VITE_ALLOWED_HOST || "",
    ].filter(Boolean),
  },
});
