import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.tyuanwaterproof.com',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  // Legacy URL redirects live in vercel.json, not here: a static build can only
  // emit meta-refresh HTML for a redirect, which returns 200 and passes no link
  // equity. vercel.json serves a real 308. See /categories/asphalt-membranes.
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [tailwind(), sitemap({
    // Dates represent substantive page edits, not the date of every deployment.
    serialize(item) {
      const updatedPages = new Set([
        '/blog/tunnel-waterproofing-membrane-selection/',
        '/blog/sbs-membrane-basement-foundation-waterproofing/',
        '/categories/waterproof-coatings/'
      ]);
      if (updatedPages.has(new URL(item.url).pathname)) {
        item.lastmod = '2026-11-02';
      }
      return item;
    }
  })]
});
