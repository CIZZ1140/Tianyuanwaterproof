import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tyuanwaterproof.com',
  base: '/',
  output: 'static',
  integrations: [tailwind()]
});
