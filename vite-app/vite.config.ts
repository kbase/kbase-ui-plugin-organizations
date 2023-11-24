import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const proxy = {
  '/services': {
      target: 'https://ci.kbase.us',
      changeOrigin: true,
      secure: false
  },
  '/dynserv': {
      target: 'https://ci.kbase.us',
      changeOrigin: true,
      secure: false
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy
  }
})
