import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { languageAlternates, localeOf } from './src/i18n/routes.mjs';
import fullPageLocalization from './src/i18n/localize-html.mjs';

export default defineConfig({
  site: 'https://www.tyuanwaterproof.com',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  i18n: { defaultLocale: 'en', locales: ['en', 'th', 'vi', 'es'], routing: { prefixDefaultLocale: false } },
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
      const path = new URL(item.url).pathname;
      const alternates = languageAlternates(path);
      if (alternates.length) item.links = alternates.map(link => ({ lang: link.hreflang, url: new URL(link.href, 'https://www.tyuanwaterproof.com').href }));
      if (localeOf(path) !== 'en') item.lastmod = localeOf(path) === 'es' ? '2026-11-03' : '2026-11-02';
      return item;
    }
  }), fullPageLocalization()]
});
