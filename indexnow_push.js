import fs from 'fs';
import path from 'path';

/**
 * IndexNow automation for tyuanwaterproof.com (Astro), wired up as `postbuild`.
 *
 * The URL list comes from the build's own dist/sitemap-0.xml rather than a hand-maintained
 * array, so every page Astro emits is covered without edits here.
 *
 * SUBMISSION IS OPT-IN. Run builds as usual; IndexNow only fires when you ask for it:
 *
 *   INDEXNOW_ENABLED=1 npm run build      # submit
 *   npm run build                         # no-op, just reports the URL count
 *
 * Why opt-in: while the host is awaiting authorisation on Bing's side, every build would
 * otherwise re-POST the same URL set. IndexNow answers repeated submissions with HTTP 429
 * ("potential Spam"), so an automatic push is worse than no push until the host clears.
 *
 * Set INDEXNOW_VERBOSE=1 to print the full response body and diagnostics.
 */

const HOST = 'www.tyuanwaterproof.com';
const KEY = '6c4d7285a9b34e56920f18a2d3c5b9f7';
const BASE_URL = `https://${HOST}`;
const SITEMAP = path.resolve('dist/sitemap-0.xml');

const ENABLED = process.env.INDEXNOW_ENABLED === '1';
const VERBOSE = process.env.INDEXNOW_VERBOSE === '1';

// api.indexnow.org is the consortium endpoint; www.bing.com/indexnow is Bing-specific.
// Try both so a single endpoint hiccup does not lose the submission.
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'];

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP)) return null;
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

async function submit(endpoint, urlList) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${BASE_URL}/${KEY}.txt`,
      urlList
    })
  });
  let body = '';
  try {
    body = await res.text();
  } catch {
    /* no body */
  }
  return { ok: res.ok, status: res.status, statusText: res.statusText, body };
}
  
async function pushToIndexNow() {
  const urlList = readSitemapUrls();
  if (!urlList || urlList.length === 0) {
    console.log(`IndexNow: no URLs found at ${SITEMAP} — skipped.`);
    return;
  }
  
  if (!ENABLED) {
    console.log(
      `IndexNow: ${urlList.length} URLs ready, submission disabled ` +
        '(set INDEXNOW_ENABLED=1 to push).'
    );
    return;
  }

  for (const endpoint of ENDPOINTS) {
    try {
      const r = await submit(endpoint, urlList);

      if (r.ok) {
        console.log(`IndexNow: submitted ${urlList.length} URLs via ${endpoint} (HTTP ${r.status}).`);
        return;
      }

      if (r.status === 403 || /Forbidd/i.test(r.body)) {
        // The key file is public and served with the correct content (verified), so a 403
        // here means Bing has not finished authorising this host for the key yet. That is
        // asynchronous on their side — collapsing it to one line keeps build output clean.
        console.log(`IndexNow: host not authorised yet (HTTP 403) — skipped.`);
      } else if (r.status === 429) {
        console.log('IndexNow: rate limited (HTTP 429) — backing off, try again tomorrow.');
      } else {
        console.log(`IndexNow: ${endpoint} returned HTTP ${r.status} ${r.statusText}.`);
      }

      if (VERBOSE) {
        console.log(`   endpoint: ${endpoint}`);
        console.log(`   response: ${r.body}`);
      }
    } catch (err) {
      console.log(`IndexNow: network error via ${endpoint} — ${err.message}`);
    }
  }
}

// Never let a search-engine notification fail the build.
pushToIndexNow().catch((err) => {
  console.log(`IndexNow: unexpected error — ${err.message}`);
});
