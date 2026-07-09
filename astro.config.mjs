import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.tyuanwaterproof.com',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  redirects: {
    '/categories/asphalt-membranes': '/categories/bitumen-membranes',
  },
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [tailwind(), sitemap()]
});
