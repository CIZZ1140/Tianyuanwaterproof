import { readFile, writeFile } from 'node:fs/promises';
const overrides=JSON.parse(await readFile('src/i18n/full-overrides.json','utf8'));
for(const prefix of ['full','pdf']) for(const locale of ['th','vi']) {
  const file=`src/i18n/${prefix}-${locale}.json`;
  let existing;
  try { existing=JSON.parse(await readFile(file,'utf8')); }
  catch(error) { if(prefix==='pdf'&&error.code==='ENOENT')continue; throw error; }
  const dictionary={...existing,...overrides[locale]};
  const normalize=value=>value.replace(/[’‘]/g,"'").replace(/[“”]/g,'"');
  const normalized=new Map(Object.entries(dictionary).map(([source,value])=>[normalize(source),value]));
  for(const source of JSON.parse(await readFile(`src/i18n/${prefix}-source.json`,'utf8'))) {
    if(!dictionary[source]&&normalized.has(normalize(source))) dictionary[source]=normalized.get(normalize(source));
  }
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
      .replace(/การกันซึมเกรดต่ำกว่า/g,'การกันซึมใต้ระดับดิน').replace(/กันน้ํา/g,'กันซึม');
    if(locale==='th') {
      if(/felt/i.test(source))dictionary[source]=dictionary[source].replace(/ความรู้สึก/g,'แผ่นสักหลาด');
      if(/membrane/i.test(source)&&!/polyvinyl|PVC/.test(source))dictionary[source]=dictionary[source].replace(/ไวนิล/g,'แผ่นกันซึม');
      if(/torch/i.test(source))dictionary[source]=dictionary[source].replace(/เชื่อมด้วยไฟฟ้า/g,'เชื่อมด้วยเปลวไฟ');
      if(/weld/i.test(source))dictionary[source]=dictionary[source].replace(/เชื่อมโลหะ/g,'เชื่อมด้วยความร้อน');
      if(source==='kN/m')dictionary[source]='kN/m';
    }
    if(locale==='vi') {
      dictionary[source]=value.replace(/bệnh zona/gi,'ngói bitum');
      if(/waterproof/i.test(source)) dictionary[source]=dictionary[source].replace(/chống nước/g,'chống thấm');
      if(/reinforcement/i.test(source)&&!/steel/i.test(source)) dictionary[source]=dictionary[source].replace(/cốt thép/gi,'vật liệu gia cường');
      if(/below-grade/i.test(source))dictionary[source]=dictionary[source].replace(/dưới lớp/g,'dưới mặt đất');
      if(/laps?/i.test(source))dictionary[source]=dictionary[source].replace(/vòng đua/g,'mối nối chồng');
    }
    // Keep the source document's numeric notation. Translation services use
    // decimal commas, thousands dots, and sometimes Thai Buddhist years.
    let target=dictionary[source];
    const sourceNumbers=source.match(/\d+(?:[.,]\d+)*/g)||[];
    const targetNumbers=target.match(/\d+(?:[.,]\d+)*/g)||[];
    if(sourceNumbers.length===targetNumbers.length) {
      let index=0;
      target=target.replace(/\d+(?:[.,]\d+)*/g,number=>{
        const original=sourceNumbers[index++];
        return original.replace(/[.,]/g,'')===number.replace(/[.,]/g,'')?original:number;
      });
    }
    if(locale==='th') {
      target=target.replace(/ตารางเมตร|ตร\.\s*ม\.?|ม²/g,' m² ').replace(/ลูกบาศก์เมตร|ลบ\.\s*ม\.?/g,' m³ ')
        .replace(/(?<=\d|\s)มม\.?(?![\p{L}\p{M}])/gu,' mm ').replace(/ซม\./g,' cm ').replace(/กก\./g,' kg ')
        .replace(/เมกะปาสกาล/g,' MPa ').replace(/กิโลปาสคาล|กิโลปาสกาล/g,' kPa ')
        .replace(/ก\.\s*\//g,'g/').replace(/ตารางฟุต/g,'sq ft')
        .replace(/กิโลกรัม/g,' kg ').replace(/กรัม/g,' g ')
        .replace(/นาที/g,match=>/\bmin\b|\dmin\b/.test(source)?' min ':match)
        .replace(/(?<=\d)\s*ม\.?(?![\p{L}\p{M}²³])/gu,' m ')
        .replace(/\(ม\.\)/g,'(m)');
      if(source.includes('2026'))target=target.replace(/2569/g,'2026');
      if(source==='How to Read a TDS in Five Steps')target='วิธีอ่าน TDS ในห้าขั้นตอน';
      if(source.startsWith('TY-SHIELD™ HDPE pre-applied membrane comprises four'))target=target.replace(/4 ชั้น/g,'สี่ชั้น');
    }
    if(locale==='vi') {
      target=target.replace(/phút/g,match=>/\bmin\b|\dmin\b/.test(source)?'min':match);
      if(/\b(?:May|Jul(?:y)?|Aug|Sep|Oct|Nov)\b/.test(source)) {
        const months={5:'Năm',7:'Bảy',8:'Tám',9:'Chín',10:'Mười',11:'Mười Một'};
        target=target.replace(/tháng\s+(5|7|8|9|10|11)\b/gi,(_,n)=>'tháng '+months[n]);
      }
      if(source.includes('2026-05-01'))target=target.replace(/01-05-2026/g,'2026-05-01');
      if(source==='Sep 9, 2026')target='9 tháng Chín, 2026';
      if(source.startsWith('20FT figures are factory'))target=target.replace(/gấp đôi/g,'gấp 2');
      if(source.startsWith('Torch-applied is generally'))target=target.replace(/Với công việc dưới 0°C/g,'Với công việc ở nhiệt độ âm');
    }
    target=target.replace(/\b(kg|g)\s*\/\s*m([²³23])/g,'$1/m$2').replace(/\bN\s*\/\s*(50)?\s*mm/g,'N/$1mm');
    dictionary[source]=target.replace(/ {2,}/g,' ').trim();
  }
  await writeFile(file,JSON.stringify(Object.fromEntries(Object.entries(dictionary).sort(([a],[b])=>a.localeCompare(b))),null,2)+'\n');
}
