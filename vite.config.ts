// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 👇 Add this "server" block
  server: {
    proxy: {
      // Requests to /api will be proxied
      '/api': {
        target: 'https://spotify-music.liara.run', // The real API server
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api from the request path
      },
    },
  },
});