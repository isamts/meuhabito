import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usar './' faz com que o app funcione em qualquer subpasta (como no GitHub Pages)
  base: './', 
  define: {
    // Maneira correta de injetar variáveis de string no Vite para evitar erros de runtime
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});