"""Apply browser-reviewed public Microsoft Translator results, then audit.

The browser review cache is preparation-only; production uses checked-in JSON.
Explicit editorial overrides are applied afterward by finalize-localization.mjs.
"""
from pathlib import Path
import json,re

ROOT=Path(__file__).resolve().parents[1]
def main():
    for locale in ['th','vi','es','pt-br']:
        reviewed=json.loads((ROOT/f'tmp/bing-{locale}.json').read_text(encoding='utf-8'))
        for kind in ['full','pdf']:
            source=json.loads((ROOT/f'src/i18n/{kind}-source.json').read_text(encoding='utf-8'))
            path=ROOT/f'src/i18n/{kind}-{locale}.json'
            dictionary=json.loads(path.read_text(encoding='utf-8'))
            count=0
            for value in source:
                if value not in reviewed:continue
                target=reviewed[value]
                # Restore English-source thousands separators without changing
                # values or guessing the meaning of decimal separators.
                formats={number.replace(',',''):number for number in re.findall(r'\d+(?:[.,]\d+)*',value)}
                target=re.sub(r'\d+(?:[.,]\d+)*',lambda m:formats.get(m.group().replace(',',''),m.group()),target)
                dictionary[value]=target;count+=1
            path.write_text(json.dumps(dictionary,ensure_ascii=False,indent=2,sort_keys=True)+'\n',encoding='utf-8')
            print(kind,locale,count,'reviewed strings')

if __name__=='__main__':main()
