import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const resolve = (path: string) => {
  return fileURLToPath(new URL(path, import.meta.url));
};

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
  base: "./",
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      process.env.VITE_ALLOWED_HOST || "",
    ].filter(Boolean),
  },
});
