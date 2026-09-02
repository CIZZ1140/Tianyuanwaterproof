import fs from 'fs';
import path from 'path';

/**
 * IndexNow Automation Script for tyuanwaterproof.com (Astro)
 * Sends all products and blog URLs to Bing IndexNow API.
 */

const HOST = 'www.tyuanwaterproof.com';
const KEY = '6c4d7285a9b34e56920f18a2d3c5b9f7';
const BASE_URL = `https://${HOST}`;

const CONTENT_DIR = 'src/content';
const STATIC_PAGES = [
  '/',
  '/products/',
  '/applications/',
  '/contact/',
  '/about/',
  '/technical/',
  '/projects/',
  '/technical/faq/',
  '/technical/installation-guide/'
];

function getSlugs(subDir) {
  const dirPath = path.join(CONTENT_DIR, subDir);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx?$/, ''));
}

async function pushToIndexNow() {
  console.log('--- IndexNow Auto-Push Started ---');
  
  const productSlugs = getSlugs('products').map(slug => `/products/${slug}/`);
  const blogSlugs = getSlugs('blog').map(slug => `/blog/${slug}/`);
  
  // Combine all URLs
  const urlList = [
    ...STATIC_PAGES,
    ...productSlugs,
    ...blogSlugs
  ].map(p => `${BASE_URL}${p}`);

  console.log(`Prepared ${urlList.length} URLs for submission.`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList: urlList
  };

  try {
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Successfully submitted to Bing IndexNow.');
    } else {
      console.error('❌ IndexNow Submission Failed:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response:', text);
    }
  } catch (error) {
    console.error('❌ Network Error during IndexNow Push:', error.message);
  }
  
  console.log('--- IndexNow Auto-Push Finished ---');
}

pushToIndexNow();
