import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { parse } from 'parse5';
import { languages } from '../src/i18n/routes.mjs';

const attr = (node, key) => node.attrs?.find(item => item.name === key)?.value;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
function find(root, predicate) {
  const result = [];
  const visit = node => { if (predicate(node)) result.push(node); for (const child of node.childNodes || []) visit(child); };
  visit(root);
  return result;
}
const slugs = [];
for (const file of await readdir('src/content/products')) {
  if (!file.endsWith('.md')) continue;
  const source = await readFile(`src/content/products/${file}`, 'utf8');
  if (/^detail_layout:\s*["']?coating-v1/m.test(source)) slugs.push(file.replace(/\.md$/, ''));
}
assert.equal(slugs.length, 9, 'All nine coating products must use the approved layout');
const pages = [];
for (const slug of slugs) for (const { code } of languages) {
  const path = `${code === 'en' ? '' : '/' + code}/products/${slug}/`;
  const doc = parse(await readFile(`dist${path}index.html`, 'utf8'));
  const ids = find(doc, node => attr(node, 'id')).map(node => attr(node, 'id'));
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs: ${path}`);
  assert(ids.includes('coating-applications'), `Missing coating module: ${path}`);
  assert.equal(find(doc, node => node.tagName === 'h1').length, 1);
  const title = text(find(doc, node => node.tagName === 'h1')[0]).trim();
  const links = find(doc, node => node.tagName === 'a');
  const productChats = links.filter(node => {
    const href = attr(node, 'href') || '';
    if (!href.startsWith('https://wa.me/')) return false;
    const message = new URL(href).searchParams.get('text') || '';
    return message.includes(title) && (code === 'en' || message.includes(path));
  });
  assert(productChats.length >= 3, `Missing product-aware WhatsApp entry: ${path}`);
  const quote = links.find(node => {
    const href = attr(node, 'href') || '';
    if (!href.startsWith('/')) return false;
    const url = new URL(href, 'https://www.tyuanwaterproof.com');
    return url.pathname === `${code === 'en' ? '' : '/' + code}/contact/` && url.searchParams.get('intent') === 'quote' && url.searchParams.get('source') === path;
  });
  assert(quote, `Missing localized quotation route: ${path}`);
  const recommendations = links.filter(node => (attr(node, 'class') || '').includes('max-w-[280px]'));
  assert.equal(recommendations.length, 4, `Related product count: ${path}`);
  assert.equal(new Set(recommendations.map(node => attr(node, 'href'))).size, 4);
  const tables = find(doc, node => node.tagName === 'table').length;
  assert.equal(tables, slug.startsWith('two-component-') ? 0 : slug.startsWith('spray-polyurea-') ? 2 : 1, `Technical tables: ${path}`);
  for (const image of find(doc, node => node.tagName === 'img')) {
    const src = attr(image, 'src');
    if (src?.startsWith('/') && !src.startsWith('//')) await readFile(`public${src}`);
  }
  pages.push({ path, productChats: productChats.length, recommendations: 4, technicalTables: tables });
}
await mkdir('reports/coating-details-20261120', { recursive: true });
await writeFile('reports/coating-details-20261120/validation.json', JSON.stringify({ products: slugs.length, pages }, null, 2) + '\n');
console.log(`PASS: ${pages.length} coating pages; product-aware WhatsApp, localized quote links, four recommendations, unique IDs, local assets and technical tables.`);
