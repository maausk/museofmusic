import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ajusta `site` a tu dominio real antes de desplegar (sitemap, canonical, og).
export default defineConfig({
  site: 'https://museofmusic.art',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
