// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://paurodber-web.github.io',
  // En GitHub Actions (GitHub Pages) el sitio vive en /steff/; en local, en la raíz.
  base: process.env.GITHUB_ACTIONS ? '/steff/' : '/',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
