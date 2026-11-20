import importlib.util,json,concurrent.futures,re
from pathlib import Path
root=Path.cwd()
spec=importlib.util.spec_from_file_location('translator',root/'scripts/translate-full-pages.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
m.TOKEN=re.compile(m.TOKEN.pattern.replace('(?<![A-Za-z])',"(?<![A-Za-z’'])"),re.I)
strings=json.loads((root/'src/i18n/full-source.json').read_text(encoding='utf-8'))
def process(locale):
 p=root/f'src/i18n/full-{locale}.json';d=json.loads(p.read_text(encoding='utf-8'));missing=[s for s in strings if not d.get(s)];batches=[];batch=[];size=0
 for s in missing:
  if size+len(s)>1800 or len(batch)>=12:
   batches.append(batch);batch=[];size=0
  batch.append(s);size+=len(s)
 if batch:batches.append(batch)
 print(locale,len(missing),'new strings',flush=True)
 for batch in batches:
  d.update(m.translate_batch(batch,locale));p.write_text(json.dumps(d,ensure_ascii=False,indent=2,sort_keys=True)+'\n',encoding='utf-8')
 print(locale,'complete',flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for result in pool.map(process,['th','vi','es','pt-br','fr','ar']):pass
