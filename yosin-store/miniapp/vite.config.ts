import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mini App is served from the domain root by Caddy; keep base './' so the
// build also works when opened from a subpath or file preview.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5173 },
});
