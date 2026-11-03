import {translationLocales} from '../src/i18n/routes.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {technicalUnits as units} from './localization-values.mjs';
const numbers=s=>(s.match(/\d+(?:[.,]\d+)*/g)||[]).sort();
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const findings=[];
for(const kind of ['full','pdf'])for(const language of translationLocales){
 const source=JSON.parse(await readFile(`src/i18n/${kind}-source.json`,'utf8'));
 const dict=JSON.parse(await readFile(`src/i18n/${kind}-${language}.json`,'utf8'));
 for(const s of source){const t=dict[s]||'';const errors=[];
 if(!t)errors.push('missing');
 if(!eq(numbers(s),numbers(t)))errors.push('numbers');
 for(const p of [/[≥≤±%]/g,/[−-]\d+(?:[.,]\d+)*/g])if(!eq((s.match(p)||[]).sort(),(t.match(p)||[]).sort()))errors.push('signs');
 if(units(s).length&&!eq(units(s),units(t)))errors.push('units');
 if(/[\u3040-\u30ff\u3400-\u9fff\u0400-\u052f\u0600-\u06ff\uac00-\ud7af]/.test(t))errors.push('CJK');
 if(errors.length)findings.push({kind,language,source:s,translation:t,errors});
 }
}
await writeFile('reports/full-localization/review-audit.json',JSON.stringify(findings,null,2)+'\n');
console.log(findings.length,'findings',Object.fromEntries(['missing','numbers','signs','units','CJK'].map(k=>[k,findings.filter(f=>f.errors.includes(k)).length])));
