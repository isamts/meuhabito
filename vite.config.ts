import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Substitua '/meuhabito/' pelo nome exato do seu repositório no GitHub entre barras
  base: '/meuhabito/', 
  define: {
    // Isso previne que o app quebre se process.env não existir no navegador
    'process.env': {
      API_KEY: process.env.API_KEY || ''
    }
  }
});