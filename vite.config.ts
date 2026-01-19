import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: O base deve corresponder exatamente ao nome do repositório no GitHub
  base: '/meuhabito/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});