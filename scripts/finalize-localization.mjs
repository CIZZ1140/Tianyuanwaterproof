import { readFile, writeFile } from 'node:fs/promises';
const overrides=JSON.parse(await readFile('src/i18n/full-overrides.json','utf8'));
for(const locale of ['th','vi']) {
  const file=`src/i18n/full-${locale}.json`;
  const dictionary={...JSON.parse(await readFile(file,'utf8')),...overrides[locale]};
  // Roofing shingles are not the medical condition sharing the English name.
  for(const [source,value] of Object.entries(dictionary)) {
    if(locale==='th') dictionary[source]=value
      .replace(/ยางมะตอยงูสวัด/g,'กระเบื้องหลังคาแอสฟัลต์').replace(/งูสวัดยางมะตอย/g,'กระเบื้องหลังคาแอสฟัลต์').replace(/งูสวัด/g,'กระเบื้องหลังคา')
      .replace(/(?:ประเภท(?:ที่)?|แบบ(?:ที่)?)\s*(?:3|สาม)(?!\d)/g,match=>/Type\s+I/.test(source)?'Type III':match)
      .replace(/(?:ประเภท(?:ที่)?|แบบ(?:ที่)?)\s*(?:2|สอง)(?!\d)/g,match=>/Type\s+I/.test(source)?'Type II':match)
      .replace(/(?:ประเภท(?:ที่)?|แบบ(?:ที่)?)\s*(?:1|หนึ่ง)(?!\d)/g,match=>/Type\s+I/.test(source)?'Type I':match)
      .replace(/(?:ประเภท(?:ที่)?|แบบ(?:ที่)?)\s*([IVX]+)\b/g,'Type $1')
      .replace(/คลาส\s*([A-Z]+)\b/g,'Class $1')
      .replace(/วัสดุพิมพ์/g,'พื้นผิวรองรับ').replace(/พลังทำลายล้าง|ความแรงทำลายล้าง/g,'แรงดึงขาด')
      .replace(/การกันซึมเกรดต่ำกว่า/g,'การกันซึมใต้ระดับดิน');
    if(locale==='vi') {
      dictionary[source]=value.replace(/bệnh zona/gi,'ngói bitum');
      if(/reinforcement/i.test(source)&&!/steel/i.test(source)) dictionary[source]=dictionary[source].replace(/cốt thép/gi,'vật liệu gia cường');
    }
  }
  await writeFile(file,JSON.stringify(Object.fromEntries(Object.entries(dictionary).sort(([a],[b])=>a.localeCompare(b))),null,2)+'\n');
}
