import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ["@node-rs/argon2", "@node-rs/bcrypt", "@node-rs", "oslo", "@node-rs/argon2-wasm32-wasi"]
  },
  plugins: [sveltekit()],

  server: {
    fs: {
      allow: ['public']
    },

    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL de votre serveur backend
        changeOrigin: true,
        secure: false
      }
    }
  }
});
