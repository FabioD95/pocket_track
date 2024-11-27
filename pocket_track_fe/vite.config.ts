import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pocket_track/', // Specifica il prefisso per le risorse
  server: {
    port: 5173, // Opzionale, porta del server di sviluppo
  },
});
