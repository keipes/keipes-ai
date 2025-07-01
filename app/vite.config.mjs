import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "./src/renderer",
  base: "",
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
    rollupOptions: {
      input: "./src/renderer/pages/index.html",
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src/renderer"),
    },
  },
});
