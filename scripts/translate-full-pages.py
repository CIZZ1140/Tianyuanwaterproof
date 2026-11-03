"""Offline translation preparation; never runs in the browser or during deployment.

Only public site copy is sent to Google's translation service. Checked-in JSON is
the build input. Keep a resumable cache and preserve numbers/technical identifiers.
"""
import concurrent.futures
import json
import re
import time
import sys
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/i18n/full-source.json'
UNITS = r'(?<![A-Za-z])(?:N/(?:50)?mm|kg/m[²2]|g/(?:cm[³3]|m[²2])|mm|cm|kg|MPa|kPa|m[²³23]|min|pcs|lbs?|ft|kN|h|s|g|m)(?![A-Za-z])'
TOKEN = re.compile(r'https?://\S+|[\w.+-]+@[\w.-]+|\b(?:Type\s+[IVX]+|Class\s+[A-Z]+|Tianyuan Waterproof|Weifang Tianyuan Waterproof Material Co\.,? Ltd\.?|GB(?:/T)?\s*\d+(?:[.\-]\d+)*|ASTM\s*[A-Z]?\d+(?:[.\-]\d+)*|EN\s*\d+(?:[.\-]\d+)*|ISO\s*\d+(?::\d+)?|SBS|APP|PVC|TPO|EPDM|HDPE|PU|JS|TDS|MSDS|OEM|ODM|UV|PET|PE|PP)\b|'+UNITS+r'|\d+(?:[.,]\d+)*', re.I)

def protect(value):
    tokens=[]
    def replace(match):
        if match.group().startswith(('Tianyuan Waterproof','Weifang Tianyuan')):
            return match.group()
        tokens.append(match.group())
        return f'ZXQ{len(tokens)-1}QXZ'
    return TOKEN.sub(replace,value),tokens

def restore(value,tokens):
    for i,token in enumerate(tokens):
        pattern=rf'ZXQ\s*{i}\s*QXZ'
        if not re.search(pattern,value,re.I):
            raise ValueError(f'Missing protected token {i}: {value}')
        value=re.sub(pattern,lambda _:token,value,flags=re.I)
    return value.strip()

def request(value,locale):
    for attempt in range(5):
        try:
            response=requests.get('https://translate.googleapis.com/translate_a/single',params={'client':'gtx','sl':'en','tl':locale,'dt':'t','q':value},timeout=50)
            response.raise_for_status()
            return ''.join(segment[0] for segment in response.json()[0] if segment[0])
        except Exception:
            if attempt==4: raise
            time.sleep(2**attempt)

def translate_batch(batch,locale):
    protected=[protect(value) for value in batch]
    payload='\n'.join(f'[TYSEG{i}]\n{value}' for i,(value,_) in enumerate(protected))
    output=request(payload,locale)
    parts=re.split(r'\[\s*TYSEG\s*(\d+)\s*\]',output,flags=re.I)
    translated={int(parts[i]):parts[i+1].strip() for i in range(1,len(parts)-1,2)}
    result={}
    for i,source in enumerate(batch):
        try:
            result[source]=restore(translated[i],protected[i][1])
        except (ValueError,KeyError):
            result[source]=restore(request(protected[i][0],locale),protected[i][1])
    return result

def main():
    pdf_mode='--pdf' in sys.argv
    strings=json.loads((ROOT/'src/i18n/pdf-source.json' if pdf_mode else SOURCE).read_text(encoding='utf-8'))
    for locale in ['th','vi']:
        target=ROOT/f'src/i18n/{"pdf" if pdf_mode else "full"}-{locale}.json'
        dictionary=json.loads(target.read_text(encoding='utf-8')) if target.exists() else {}
        overrides=json.loads((ROOT/'src/i18n/full-overrides.json').read_text(encoding='utf-8'))
        dictionary.update(overrides.get(locale,{}))
        missing=[value for value in strings if value not in dictionary]
        batches=[]; batch=[]; size=0
        for value in missing:
            if size+len(value)>2200 or len(batch)>=18:
                batches.append(batch); batch=[]; size=0
            batch.append(value); size+=len(value)
        if batch: batches.append(batch)
        print(f'{locale}: {len(missing)} strings in {len(batches)} batches',flush=True)
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
            futures={pool.submit(translate_batch,batch,locale):i for i,batch in enumerate(batches)}
            for completed,future in enumerate(concurrent.futures.as_completed(futures),1):
                try: dictionary.update(future.result())
                except Exception as error: print(f'{locale} batch {futures[future]} failed: {error}',flush=True)
                target.write_text(json.dumps(dictionary,ensure_ascii=False,indent=2,sort_keys=True)+'\n',encoding='utf-8')
                if completed%10==0 or completed==len(batches): print(f'{locale}: {completed}/{len(batches)} batches, {len(dictionary)}/{len(strings)} strings',flush=True)
        if any(value not in dictionary for value in strings): raise RuntimeError('Incomplete translations; rerun to resume')

if __name__=='__main__': main()
