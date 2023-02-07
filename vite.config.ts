import path from "path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {AntdResolve, createStyleImportPlugin} from "vite-plugin-style-import";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [AntdResolve()],
    }),
  ],
});
