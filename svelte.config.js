import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import autoprefixer from 'autoprefixer';
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: sequence([
    vitePreprocess({
      postcss: {
        plugins: [autoprefixer]
      }
    }),
  ]),


  kit: {
    csrf: {
      checkOrigin: false // ⚠️ Désactive la vérification de l'origine
  },

    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter()
  }
};

export default config;
