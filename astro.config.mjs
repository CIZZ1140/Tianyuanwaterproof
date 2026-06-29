import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tyuanwaterproof.com',
  base: '/',
  output: 'static',
  redirects: {
    '/categories/asphalt-membranes': '/categories/bitumen-membranes',
  },
  integrations: [tailwind(), sitemap()]
});
