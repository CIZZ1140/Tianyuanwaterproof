import { readFile, writeFile } from 'node:fs/promises';
const overrides=JSON.parse(await readFile('src/i18n/full-overrides.json','utf8'));
for(const prefix of ['full','pdf']) for(const locale of ['th','vi','es','pt-br','fr','ar']) {
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
    if(locale==='ar')target=target.replace(/[٠-٩]/g,n=>String(n.charCodeAt(0)-0x660)).replace(/[۰-۹]/g,n=>String(n.charCodeAt(0)-0x6f0)).replace(/٪/g,'%').replace(/٫/g,'.').replace(/٬/g,',');
    if(['fr','ar'].includes(locale)) {
      // Restore only grouping formats whose digits exactly match a number in
      // the English source; never infer or change a numeric value.
      for(const n of source.match(/\d+(?:[.,]\d+)*/g)||[]) {
        if(/^\d{1,3}(?:,\d{3})+$/.test(n)||/^\d{4,}$/.test(n)) {
          const grouped=n.replace(/,/g,'').replace(/\B(?=(\d{3})+(?!\d))/g,'[ \\u00a0\\u202f,]');
          target=target.replace(new RegExp('(?<!\\d)'+grouped+'(?!\\d)','g'),n);
        }
      }
    }
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
    if(locale==='es') {
      target=target.replace(/betún/gi,'asfalto');
      if(source.includes('TIANYUAN WATERPROOF'))target=target.replace(/TIANYUAN IMPERMEABLE|IMPERMEABLE TIANYUAN/g,'TIANYUAN WATERPROOF');
      if(/\bTDS\b/.test(source)&&!source.includes('MSDS'))target=target.replace(/\bFDS\b/g,'TDS');
      if(/shingles?/i.test(source))target=target.replace(/herpes z[oó]ster/gi,'tejas asfálticas');
      if(/laps?/i.test(source))target=target.replace(/vueltas/gi,'solapes');
      if(/\bmin\b|\dmin\b/.test(source))target=target.replace(/minutos?/gi,'min');
      if(source.includes('2026-05-01'))target=target.replace(/01-05-2026|01\/05\/2026/g,'2026-05-01');
      if(source.startsWith('20FT figures are factory'))target=target.replace(/del doble de volumen/g,'de 2× el volumen');
      if(source==='min')target='min';
      if(source.includes('sq ft'))target=target.replace(/pies²/g,'sq ft');
      if(source==='Elongation at peak % ≥30 - ≥40 - -')target='Alargamiento en el pico % ≥30 - ≥40 - -';
    }
    if(locale==='pt-br') {
      target=target.replace(/betume/gi,'asfalto');
      if(/glass fiber mat|fiberglass/i.test(source))target=target.replace(/tapete de fibra de vidro/gi,'manta de fibra de vidro');
      if(/below-grade/i.test(source))target=target.replace(/abaixo do grau/gi,'abaixo do nível do solo');
      if(source.includes('TIANYUAN WATERPROOF'))target=target.replace(/TIANYUAN IMPERMEABILIZAÇÃO|TIANYUAN IMPERMEÁVEL|IMPERMEÁVEL TIANYUAN/g,'TIANYUAN WATERPROOF');
      if(/\bTDS\b/.test(source)&&!source.includes('MSDS'))target=target.replace(/\bFDS\b/g,'TDS');
      if(/shingles?/i.test(source))target=target.replace(/herpes[ -]z[oó]ster|cobreiro/gi,'telhas asfálticas');
      if(/laps?/i.test(source))target=target.replace(/voltas/gi,'sobreposições');
      if(/\bmin\b|\dmin\b/.test(source))target=target.replace(/minutos?/gi,'min');
      if(source.includes('2026-05-01'))target=target.replace(/01-05-2026|01\/05\/2026/g,'2026-05-01');
    }
    if(locale==='fr') {
      if(/shingles?/i.test(source))target=target.replace(/zona/gi,'bardeaux bitumés');
      if(/\bTDS\b/.test(source)&&!source.includes('MSDS'))target=target.replace(/\bFDS\b/g,'TDS');
      if(source.includes('2026-05-01'))target=target.replace(/01-05-2026|01\/05\/2026/g,'2026-05-01');
      if(/\bmin\b|\dmin\b/.test(source))target=target.replace(/minutes?/gi,'min');
      if(source.includes('1 business day'))target=target.replace(/d'un jour ouvrable/g,'de 1 jour ouvrable');
      if(source.startsWith('20FT figures are factory'))target=target.replace(/du double du volume/g,'de 2 fois le volume');
      if(source.includes('sq ft'))target=target.replace(/pieds? carrés?/gi,'sq ft');
    }
    if(locale==='ar') {
      if(/shingles?/i.test(source))target=target.replace(/القوباء المنطقية|الهربس النطاقي/g,'قرميد الأسفلت');
      if(/glass (?:fiber )?(?:felt|mat)/i.test(source))target=target.replace(/الصوف الزجاجي/g,'لباد الألياف الزجاجية');
      if(/quot(?:e|ation)/i.test(source))target=target.replace(/الاقتباسات/g,'عروض الأسعار').replace(/الاقتباس/g,'عرض السعر');
      if(source.includes('B2B')&&!target.includes('B2B'))target+=' (B2B)';
      if(/2\s*h\b/.test(source))target=target.replace(/ساعتان|ساعتين/g,'2 h');
      if(/\bmin\b|\dmin\b/.test(source))target=target.replace(/دقائق|دقيقة/g,'min');
      target=target.replace(/°\s*م/g,'°C')
        .replace(/الأمتار المربعة|المتر المربع|أمتار مربعة|مترًا مربعًا|متر مربع/g,' m² ')
        .replace(/متر مكعب/g,' m³ ')
        .replace(/(?<![\p{L}\p{M}])(?:متر|م)([²³23])(?![\p{L}\p{M}])/gu,(_,n)=>'m'+n)
        .replace(/(?<![\p{L}\p{M}])سم([³3])(?![\p{L}\p{M}])/gu,'cm$1')
        .replace(/(?<![\p{L}\p{M}])سم(?![\p{L}\p{M}])/gu,'cm')
        .replace(/(?<![\p{L}\p{M}])(?:مترًا|أمتار|متر|م)(?![\p{L}\p{M}²³23])/gu,' m ')
        .replace(/(?<![\p{L}\p{M}])(?:كيلوغرام|جرام|غرام)(?![\p{L}\p{M}])/gu,m=>m==='كيلوغرام'?'kg':'g')
        .replace(/(?<![\p{L}\p{M}])كغ(?![\p{L}\p{M}])/gu,' kg ')
        .replace(/(?<![\p{L}\p{M}])غ(?![\p{L}\p{M}])/gu,' g ')
        .replace(/نيوتن/g,'N')
        .replace(/(?<![\p{L}\p{M}])ن(?![\p{L}\p{M}])/gu,'N')
        .replace(/رطل/g,match=>/\blbs?\b/.test(source)?'lb':match)
        .replace(/(?<![\p{L}\p{M}])مم(?![\p{L}\p{M}])/gu,' mm ')
        .replace(/(?<![\p{L}\p{M}])ملم(?![\p{L}\p{M}])/gu,' mm ')
        .replace(/(?<![\p{L}\p{M}])كجم(?![\p{L}\p{M}])/gu,' kg ')
        .replace(/(?<![\p{L}\p{M}])جم(?![\p{L}\p{M}])/gu,' g ')
        .replace(/متر مربع|مترًا مربعًا|متر مكعب/g,m=>m.includes('مكعب')?' m³ ':' m² ')
        .replace(/ميجا ?باسكال|ميغا ?باسكال/g,' MPa ').replace(/كيلو ?باسكال/g,' kPa ');
      if(source.includes('2026-05-01'))target=target.replace(/01-05-2026|01\/05\/2026/g,'2026-05-01');
      if(source.includes('1 business day'))target=target.replace(/خلال يوم عمل واحد/g,'خلال 1 يوم عمل');
      if(source.startsWith('20FT figures are factory'))target=target.replace(/ضعفي? الحجم/g,'2× الحجم');
      if(source.includes('sq ft'))target=target.replace(/قدم(?:ًا)? مربع(?:ة)?|قدم²/g,'sq ft');
      target=target.replace(/(?<![\p{L}\p{M}])ج\s*\//gu,'g/');
      if(source.startsWith('TPO walkway pad pricing'))target=target.replace(/لكل\s+m\s+طولي/g,'لكل متر طولي');
      if(source.startsWith('Measure the total walkway length'))target=target.replace(/20\s+m\s+(خط\S+)/g,'20 مترًا $1');
    }
    if(['fr','ar'].includes(locale)) {
      for(const range of source.matchAll(/(\d+(?:[.,]\d+)*)([-–])(\d+(?:[.,]\d+)*)/g)) {
        const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        const separator=locale==='fr'?'à|–|-':'إلى|الى|حتى|–|-';
        target=target.replace(new RegExp(escape(range[1])+'\\s*(?:'+separator+')\\s*'+escape(range[3]),'g'),range[0]);
      }
      if(source.includes('−'))for(const m of source.matchAll(/−\d+(?:[.,]\d+)*/g))target=target.replace(m[0].replace('−','-'),m[0]);
    }
    target=target.replace(/\b(kg|g)\s*\/\s*m([²³23])/g,'$1/m$2').replace(/\bN\s*\/\s*(50)?\s*mm/g,'N/$1mm');
    dictionary[source]=target.replace(/ {2,}/g,' ').trim();
  }
  await writeFile(file,JSON.stringify(Object.fromEntries(Object.entries(dictionary).sort(([a],[b])=>a.localeCompare(b))),null,2)+'\n');
}
