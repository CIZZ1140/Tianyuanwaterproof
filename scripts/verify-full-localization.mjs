import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { parse } from 'parse5';
import { localizedPaths, translationLocales, languages } from '../src/i18n/routes.mjs';
import { outputFile, extractStrings } from '../src/i18n/localize-html.mjs';
import { technicalUnits as units } from './localization-values.mjs';

const get=(node,name)=>node.attrs?.find(item=>item.name===name)?.value;
function nodes(root,predicate) {
  const found=[];
  function visit(node) {if(predicate(node)) found.push(node); for(const child of node.childNodes||[])visit(child);}
  visit(root); return found;
}
function content(node) { return node.nodeName==='#text'?node.value:(node.childNodes||[]).map(content).join(''); }
const numbers=value=>(value.match(/\d+(?:[.,]\d+)*/g)||[]).sort();
const layoutClasses=doc=>nodes(doc,n=>get(n,'class')&&!get(n,'aria-current')&&n.tagName!=='a'&&!['ml-auto shrink-0','lucide lucide-check ml-auto shrink-0'].includes(get(n,'class'))).map(n=>get(n,'class'));
const dictionaryReport=[];
const strings=await extractStrings('dist');
// Future English routes must be added to the locale manifest before publishing.
const englishPaths=[];
async function discover(directory,path='/') {
  for(const item of await readdir(directory,{withFileTypes:true})) {
    if(item.isDirectory()&&![...translationLocales,'_astro','docs'].includes(item.name)) await discover(`${directory}/${item.name}`,`${path}${item.name}/`);
    if(item.isFile()&&item.name==='index.html') englishPaths.push(path);
  }
}
await discover('dist');
assert.deepEqual([...localizedPaths].sort(),englishPaths.sort(),'Every published English page must have all supported language versions');
for(const locale of translationLocales) {
  const dictionary=JSON.parse(await readFile(`src/i18n/full-${locale}.json`,'utf8'));
  for(const source of strings) {
    assert(dictionary[source],`Missing ${locale}: ${source}`);
    assert.deepEqual(numbers(dictionary[source]),numbers(source),`Numeric mismatch ${locale}: ${source} -> ${dictionary[source]}`);
    for(const pattern of [/[≥≤±%]/g, /[−-]\d+(?:[.,]\d+)*/g]) assert.deepEqual((dictionary[source].match(pattern)||[]).sort(),(source.match(pattern)||[]).sort(),`Technical sign mismatch ${locale}: ${source}`);
    if(units(source).length) assert.deepEqual(units(dictionary[source]),units(source),`Unit mismatch ${locale}: ${source}`);
    assert(!/ZXQ\d|QXZ|TYSEG\d/.test(dictionary[source]),`Unresolved token ${source}`);
  }
  dictionaryReport.push({locale,strings:strings.length,numericParity:true});
}
const pages=[];
for(const path of localizedPaths) {
  const english=parse(await readFile(outputFile('dist',path),'utf8'));
  const images=nodes(english,n=>n.tagName==='img'&&!get(n,'src')?.startsWith('/flags/')).map(n=>[get(n,'src'),get(n,'srcset'),get(n,'sizes')]);
  const tables=nodes(english,n=>n.tagName==='table');
  const ids=nodes(english,n=>get(n,'id')).map(n=>get(n,'id'));
  const classes=layoutClasses(english);
  for(const locale of translationLocales) {
    const doc=parse(await readFile(outputFile('dist',`/${locale}${path}`),'utf8'));
    assert.equal(get(nodes(doc,n=>n.tagName==='html')[0],'lang'),locale);
    assert.equal(get(nodes(doc,n=>n.tagName==='link'&&get(n,'rel')==='canonical')[0],'href'),`https://www.tyuanwaterproof.com/${locale}${path}`);
    assert.equal(nodes(doc,n=>n.tagName==='h1').length,nodes(english,n=>n.tagName==='h1').length);
    assert.deepEqual(nodes(doc,n=>get(n,'id')).map(n=>get(n,'id')),ids,`Module IDs ${locale}${path}`);
    assert.deepEqual(layoutClasses(doc),classes,`Layout classes ${locale}${path}`);
    assert.deepEqual(nodes(doc,n=>n.tagName==='img'&&!get(n,'src')?.startsWith('/flags/')).map(n=>[get(n,'src'),get(n,'srcset'),get(n,'sizes')]),images,`Images ${locale}${path}`);
    const localizedTables=nodes(doc,n=>n.tagName==='table');
    assert.equal(localizedTables.length,tables.length,`Tables ${locale}${path}`);
    tables.forEach((table,index)=>{
      assert.equal(nodes(localizedTables[index],n=>n.tagName==='tr').length,nodes(table,n=>n.tagName==='tr').length,`Rows ${locale}${path}`);
      assert.deepEqual(numbers(content(localizedTables[index])),numbers(content(table)),`Table values ${locale}${path}`);
    });
    const enScripts=nodes(english,n=>n.tagName==='script'&&get(n,'type')!=='application/ld+json').map(n=>[get(n,'src'),content(n)]);
    assert.deepEqual(nodes(doc,n=>n.tagName==='script'&&get(n,'type')!=='application/ld+json').map(n=>[get(n,'src'),content(n)]),enScripts,`Interaction scripts ${locale}${path}`);
    const forms=nodes(doc,n=>n.tagName==='form');
    assert.equal(forms.length,nodes(english,n=>n.tagName==='form').length);
    forms.forEach(form=>assert(nodes(form,n=>n.tagName==='input'&&get(n,'name')==='Language'&&get(n,'value')===locale).length===1));
    const alternates=nodes(doc,n=>n.tagName==='link'&&get(n,'rel')==='alternate');
    assert.equal(alternates.length,languages.length+1);
    const links=nodes(doc,n=>n.tagName==='a'&&get(n,'href')?.startsWith(`/${locale}/`));
    for(const link of links) {
      const url=new URL(get(link,'href'),'https://www.tyuanwaterproof.com');
      assert(localizedPaths.includes(url.pathname.slice(locale.length+1)),`Unknown localized link ${url.pathname}`);
    }
    for(const link of nodes(doc,n=>n.tagName==='a'&&get(n,'href')?.startsWith('/docs/'))) {
      assert(get(link,'href').startsWith(`/docs/${locale}/`),`Unlocalized PDF ${get(link,'href')}`);
      await access('dist'+new URL(get(link,'href'),'https://www.tyuanwaterproof.com').pathname);
    }
    pages.push({path:`/${locale}${path}`,images:images.length,tables:tables.length,forms:forms.length,ids:ids.length,layoutParity:true,interactionParity:true,numericParity:true});
  }
}
await mkdir('reports/full-localization',{recursive:true});
await writeFile('reports/full-localization/validation.json',JSON.stringify({dictionaries:dictionaryReport,pages},null,2)+'\n');
console.log(`PASS: ${pages.length} full localized pages; identical module IDs, layout classes, images, tables, technical numbers and interaction scripts.`);
