import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPages = process.env.GITHUB_PAGES === 'true' && repoName && !repoName.endsWith('.github.io');

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base: process.env.BASE_PATH || (isProjectPages ? `/${repoName}` : '/'),
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false })]
});
