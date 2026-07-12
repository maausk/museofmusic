import { defineConfig } from 'astro/config';

// Ajusta `site` a tu dominio real antes de desplegar (sitemap, canonical, og).
export default defineConfig({
  site: 'https://museofmusic.art',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
