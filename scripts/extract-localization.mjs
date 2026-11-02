import { extractStrings } from '../src/i18n/localize-html.mjs';
import { writeFile } from 'node:fs/promises';
const strings=await extractStrings('dist');
await writeFile('src/i18n/full-source.json',JSON.stringify(strings,null,2)+'\n');
console.log(`${strings.length} unique strings, ${strings.reduce((sum,s)=>sum+s.length,0)} characters`);
