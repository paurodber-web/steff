// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://paurodber-web.github.io',
  base: '/steff/',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
