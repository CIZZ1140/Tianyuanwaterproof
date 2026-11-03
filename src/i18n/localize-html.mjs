import { parse, serialize } from 'parse5';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { localizedPaths, languageAlternates, languages, translationLocales } from './routes.mjs';
import ui from './ui.json' with { type: 'json' };

const origin = 'https://www.tyuanwaterproof.com';
const localizedDownloads = new Set(['asphalt-felt-tds.pdf','sbs-membrane-installation-manual.pdf','sbs-waterproofing-membrane-tds.pdf','self-adhesive-bitumen-membrane-tds.pdf','tpo-walkway-pad-tds.pdf']);
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
function set(node, name, value) {
  node.attrs ||= [];
  const existing = node.attrs.find(a => a.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}
function remove(node, name) { node.attrs = node.attrs?.filter(a => a.name !== name); }
function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes || []) walk(child, visit);
}
const text = value => ({ nodeName: '#text', value });
function setText(node, value) {
  node.childNodes = [text(value)];
  node.childNodes[0].parentNode = node;
}
function hasClass(node, name) { return (attr(node, 'class') || '').split(/\s+/).includes(name); }
const stable = /^(?:Tianyuan Waterproof|Weifang Tianyuan Waterproof Material Co\.,? Ltd\.?|WhatsApp|WHATSAPP|OEM(?:\s*\/\s*ODM)?|CE(?:\s+RoHS)?|ISO[\d\s:.-]+|EN|TH|VI|English|ไทย|Tiếng Việt|Español|TDS|MSDS|PDF|SBS|APP|PVC|TPO|EPDM|HDPE|PU|JS|ASTM|GB\/T|MD|CD|PY|PYG|ALU|N|G|I|II|III|B2B|A\+B|TY-SHIELD™)$/;
export function needsTranslation(value) {
  return /[A-Za-z]{2}/.test(value) && !stable.test(value) && !/^https?:|^[\w.+-]+@|^\+?[\d\s()-]+$/.test(value) && !/^(?:mm|cm|kg|g|m²|m2|MPa|N\/mm|kPa|°C|ft|lb|pcs|kg\/m²)$/i.test(value);
}
const visibleAttributes = new Set(['alt', 'aria-label', 'title', 'placeholder', 'data-tooltip', 'data-category-label']);
const schemaTextKeys = new Set(['name', 'description', 'text', 'headline', 'alternativeHeadline']);

function schemaStrings(value, visit, key = '') {
  if (typeof value === 'string') return schemaTextKeys.has(key) ? visit(value) : value;
  if (Array.isArray(value)) return value.map(item => schemaStrings(item, visit, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,schemaStrings(v,visit,k)]));
  return value;
}
// Change only presentation strings. Script code, form field names/values, product
// filter IDs, URLs and technical numbers remain the English page's source data.
export function mapStrings(document, translate) {
  function visit(node, skipped = false) {
    const skip = skipped || ['script','style','code','pre','svg','noscript'].includes(node.tagName) || attr(node,'translate') === 'no';
    if (node.nodeName === '#text' && !skip) {
      const value = node.value.trim();
      if (value && needsTranslation(value)) node.value = node.value.replace(value, () => translate(value));
    }
    if (!skip) for (const item of node.attrs || []) {
      if (visibleAttributes.has(item.name) && item.value.trim() && needsTranslation(item.value.trim())) item.value = translate(item.value.trim());
    }
    if (node.tagName === 'meta' && ['description','og:title','og:description','twitter:title','twitter:description'].includes(attr(node,'name') || attr(node,'property'))) {
      const value = attr(node,'content');
      if (value && needsTranslation(value)) set(node,'content',translate(value));
    }
    if (node.tagName === 'script' && attr(node,'type') === 'application/ld+json') {
      const source = node.childNodes?.[0]?.value;
      if (source) setText(node, JSON.stringify(schemaStrings(JSON.parse(source), value => needsTranslation(value) ? translate(value) : value)));
    }
    for (const child of node.childNodes || []) visit(child, skip);
  }
  visit(document);
}
export const outputFile = (directory, path) => join(directory, path.replace(/^\//,''), 'index.html');
export async function extractStrings(directory) {
  const strings = new Set();
  for (const path of localizedPaths) {
    const document = parse(await readFile(outputFile(directory,path),'utf8'));
    mapStrings(document, value => { strings.add(value); return value; });
  }
  return [...strings].sort();
}
function localizedHref(value, locale) {
  if (value === 'https://img.tyuanwaterproof.com/docs/asphalt-felt-tds.pdf') return `/docs/${locale}/asphalt-felt-tds.pdf`;
  if (!value || (!value.startsWith('/') && !value.startsWith(origin))) return value;
  if (value.startsWith('//')) return value;
  const url = new URL(value, origin);
  if (url.origin !== origin) return value;
  const document=url.pathname.match(/^\/docs\/([^/]+\.pdf)$/)?.[1];
  if (document && localizedDownloads.has(document)) {
    url.pathname=`/docs/${locale}/${document}`;
    return value.startsWith(origin)?url.href:url.pathname+url.search+url.hash;
  }
  const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  if (localizedPaths.includes(path)) {
    url.pathname = `/${locale}${path}`;
    const source=url.searchParams.get('source');
    if (source && localizedPaths.includes(source)) url.searchParams.set('source',`/${locale}${source}`);
    return value.startsWith(origin) ? url.href : url.pathname + url.search + url.hash;
  }
  return value;
}
function localizeSchema(value, locale) {
  if (typeof value === 'string') return localizedHref(value,locale);
  if (Array.isArray(value)) return value.map(item => localizeSchema(item,locale));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,key==='inLanguage' ? locale : localizeSchema(item,locale)]));
  return value;
}
function configureLanguagePicker(document, path, locale) {
  walk(document, picker => {
    if (!hasClass(picker,'language-switcher')) return;
    const summary = picker.childNodes.find(n => n.tagName === 'summary');
    const current = languages.find(language => language.code === locale);
    if (summary) {
      set(summary,'aria-label',`${ui[locale].language}: ${current.label}`);
      for (const child of summary.childNodes) {
        if (child.tagName === 'img') set(child,'src',`/flags/${locale==='th'?'th':locale==='vi'?'vn':'es'}.svg`);
        if (child.tagName === 'span') { setText(child,current.label); set(child,'lang',locale); }
      }
    }
    walk(picker, link => {
      if (link.tagName !== 'a') return;
      const language = attr(link,'lang');
      if (!languages.some(item => item.code === language)) return;
      set(link,'href',language === 'en' ? path : `/${language}${path}`);
      const active = language === locale;
      if (active) set(link,'aria-current','page'); else remove(link,'aria-current');
      // Identical layout and spacing for all languages; only the selected state changes.
      set(link,'class','flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 '+(active?'bg-[#edf4fb] text-[#174d7a]':'hover:bg-slate-100'));
      link.childNodes = link.childNodes.filter(child => child.tagName !== 'svg');
      if (active) {
        const check = {nodeName:'span',tagName:'span',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[{name:'class',value:'ml-auto shrink-0'},{name:'aria-hidden',value:'true'}],childNodes:[text('✓')],parentNode:link};
        check.childNodes[0].parentNode=check;
        link.childNodes.push(check);
      }
    });
  });
}
export async function localizePages(directory) {
  const dictionaries = Object.fromEntries(await Promise.all(translationLocales.map(async locale => [locale,JSON.parse(await readFile(new URL(`./full-${locale}.json`,import.meta.url),'utf8'))])));
  let count=0;
  for (const path of localizedPaths) {
    const source = await readFile(outputFile(directory,path),'utf8');
    for (const locale of translationLocales) {
      const document = parse(source);
      const dictionary=dictionaries[locale];
      mapStrings(document, value => {
        if (!dictionary[value]) throw new Error(`Missing ${locale} translation: ${value}`);
        return dictionary[value];
      });
      walk(document,node => {
        if (node.tagName==='html') set(node,'lang',locale);
        if (node.tagName==='a' && !hasClass(node.parentNode,'language-switcher')) {
          const original=attr(node,'href');
          if (original) set(node,'href',localizedHref(original,locale));
          if (original?.startsWith('/') && !original.startsWith('//') && !original.startsWith('/flags/') && localizedHref(original,locale)===original && !original.startsWith(`/${locale}/`)) set(node,'hreflang','en');
          if (original?.startsWith('https://wa.me/') && original.includes('text=')) {
            const whatsapp=new URL(original);
            whatsapp.searchParams.set('text',locale==='es'?'Hola, me interesan los materiales impermeabilizantes de Tianyuan Waterproof. Solicito información del producto y una cotización.':locale==='th'?'สวัสดี สนใจวัสดุกันซึมของ Tianyuan Waterproof ขอข้อมูลผลิตภัณฑ์และใบเสนอราคา':'Xin chào, tôi quan tâm đến vật liệu chống thấm Tianyuan Waterproof. Vui lòng gửi thông tin và báo giá.');
            set(node,'href',whatsapp.href);
          }
        }
        if (node.tagName==='link' && attr(node,'rel')==='canonical') set(node,'href',origin+`/${locale}${path}`);
        if (node.tagName==='link' && ['prev','next'].includes(attr(node,'rel'))) set(node,'href',localizedHref(attr(node,'href'),locale));
        if (node.tagName==='meta' && attr(node,'property')==='og:url') set(node,'content',origin+`/${locale}${path}`);
        if (node.tagName==='meta' && attr(node,'property')==='og:locale') set(node,'content',locale==='th'?'th_TH':locale==='vi'?'vi_VN':'es_ES');
        if (node.tagName==='script' && attr(node,'type')==='application/ld+json') setText(node,JSON.stringify(localizeSchema(JSON.parse(node.childNodes[0].value),locale)));
        if (node.tagName==='form') {
          set(node,'data-success-title',ui[locale].success);
          set(node,'data-success-note',ui[locale].successNote);
          set(node,'data-error-message',ui[locale].error);
          const input={nodeName:'input',tagName:'input',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[{name:'type',value:'hidden'},{name:'name',value:'Language'},{name:'value',value:locale}],childNodes:[],parentNode:node};
          node.childNodes.push(input);
        }
        // Canonical source page in inquiry metadata must describe the localized page.
        if (node.tagName==='input' && /source page/i.test(attr(node,'name')||'')) set(node,'value',`/${locale}${path}`);
        if (hasClass(node,'country-item')) {
          const name=attr(node,'data-name');
          if (name && dictionary[name]) set(node,'data-name',`${name} ${dictionary[name]}`);
        }
      });
      configureLanguagePicker(document,path,locale);
      const destination=outputFile(directory,`/${locale}${path}`);
      await mkdir(dirname(destination),{recursive:true});
      await writeFile(destination,serialize(document),'utf8');
      count++;
    }
  }
  return count;
}
export default function fullPageLocalization() {
  return {name:'full-page-localization',hooks:{'astro:build:done':async ({dir,logger})=>{
    const count=await localizePages(fileURLToPath(dir));
    logger.info(`Localized ${count} full pages from their English source layouts.`);
  }}};
}
