"""Generate local responsive product images. Originals remain available for full-size viewing."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request, urlopen
from PIL import Image, ImageOps
import yaml, json, io, hashlib
ROOT=Path(__file__).resolve().parents[1]
urls=set()
for p in (ROOT/'src/content/products').glob('*.md'):
    data=yaml.safe_load(p.read_text(encoding='utf-8-sig').split('---',2)[1])
    for key in ['main_image','image']:
        if isinstance(data.get(key),str): urls.add(data[key])
    for item in data.get('gallery',[]):
        u=item if isinstance(item,str) else item.get('image',item.get('src',''))
        if isinstance(u,str): urls.add(u)
for p in (ROOT/'src/content/blog').glob('*.md'):
    data=yaml.safe_load(p.read_text(encoding='utf-8-sig').split('---',2)[1])
    if isinstance(data.get('coverImage'),str): urls.add(data['coverImage'])
cached_path=ROOT/'src/data/product-images.json'
cached=json.loads(cached_path.read_text(encoding='utf-8')) if cached_path.exists() else {}
urls={u for u in urls if u.startswith('https://img.tyuanwaterproof.com/')}
out=ROOT/'public/images/product-responsive';out.mkdir(parents=True,exist_ok=True)
def create(u):
    if u in cached and all((ROOT/'public'/v['src'].lstrip('/')).is_file() for v in cached[u]['variants'].values()): return u,cached[u]
    key=hashlib.sha256(u.encode()).hexdigest()[:16]
    with urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r: raw=r.read()
    im=ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB')
    variants={}
    for size in [160,480,800,1200]:
        img=im.copy(); img.thumbnail((size,size),Image.Resampling.LANCZOS)
        name=f'{key}-{size}.webp';img.save(out/name,'WEBP',quality=80,method=6)
        variants[str(size)]={'src':f'/images/product-responsive/{name}','width':img.width,'height':img.height,'bytes':(out/name).stat().st_size}
    return u,{'width':im.width,'height':im.height,'originalBytes':len(raw),'variants':variants}
manifest={};errors=[]
with ThreadPoolExecutor(max_workers=6) as pool:
    jobs={u:pool.submit(create,u) for u in sorted(urls)}
    for u,job in jobs.items():
        try:k,v=job.result();manifest[k]=v
        except Exception as e:errors.append({'url':u,'error':str(e)})
path=ROOT/'src/data/product-images.json';path.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
(ROOT/'reports/site-fixes-2026-11-05').mkdir(parents=True,exist_ok=True)
(ROOT/'reports/site-fixes-2026-11-05/image-generation.json').write_text(json.dumps({'count':len(manifest),'errors':errors,'images':manifest},indent=2),encoding='utf-8')
print(f'Generated {len(manifest)} images x 4 sizes; failed: {len(errors)}')
for e in errors:print(e)
