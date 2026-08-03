import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
                return "vendor-react";
              }
              if (id.includes("framer-motion") || id.includes("motion")) {
                return "vendor-framer";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("recharts")) {
                return "vendor-charts";
              }
              if (id.includes("@tanstack")) {
                return "vendor-query";
              }
              return "vendor-common";
            }
          },
        },
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  };
});
