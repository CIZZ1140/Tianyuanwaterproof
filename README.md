# Waterproofing B2B Website - Astro + Tailwind CSS

A static B2B export website for waterproofing membrane, waterproofing tape and waterproofing coating suppliers.

## Tech stack

- Astro
- Tailwind CSS
- Static output
- GitHub Pages deployment workflow included

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this project to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Push to the `main` branch.
6. The included workflow `.github/workflows/deploy.yml` will build and deploy the site.

### Important for project repositories

The Astro config automatically sets `base` to `/<repo-name>` when deployed through GitHub Pages Actions. If you use a custom domain, set these repository variables or edit `astro.config.mjs`:

```bash
SITE_URL=https://your-domain.com
BASE_PATH=/
```

## Main files to edit

- `src/data/site.ts` - brand, email, phone, WhatsApp, address
- `src/data/products.ts` - product categories and product details
- `src/data/applications.ts` - application pages
- `public/assets/hero.svg` - replace with real images later
- `src/pages/contact.astro` - replace Formspree endpoint with your real form endpoint

## Suggested next edits before launch

1. Replace `YOUR BRAND` with the real brand name.
2. Replace contact info.
3. Replace placeholder product graphics with real product photos.
4. Upload PDF catalog/TDS/MSDS into `public/downloads/` and link them on the Download Center page.
5. Change `site` in `astro.config.mjs` to your real domain.
