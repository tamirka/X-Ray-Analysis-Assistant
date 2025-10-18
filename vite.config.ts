import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy is useful for local development to avoid CORS issues
    // by forwarding API requests to the Vercel dev server.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
