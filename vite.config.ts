import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/requesty-api': {
        target: 'https://router.requesty.ai',
        changeOrigin: true,
        rewrite: (path) => {
          // Handle the base path for health checks
          if (path === '/requesty-api') {
            return '/';
          }
          // Normal path rewriting for API calls
          return path.replace(/^\/requesty-api/, '');
        },
        secure: true,
        headers: {
          'Origin': 'http://localhost:8080'
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}));
