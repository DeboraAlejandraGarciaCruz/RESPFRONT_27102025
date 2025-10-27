import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configura el alias @styles para que apunte a la carpeta src/Styles
      '@styles': path.resolve(__dirname, 'src/Styles'),
      // Opcional: También puedes configurar un alias para 'src'
      '@': path.resolve(__dirname, 'src'),
    },
  },
});