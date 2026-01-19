import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base relativa para funcionar no GitHub Pages
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  define: {
    // Garante que a variável seja uma string segura
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});