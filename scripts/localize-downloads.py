"""Build readable Thai/Vietnamese technical-reference editions.

Localized full text comes first; the complete unchanged English PDF follows as
the reference appendix, preserving original figures, tables and product images.
No claim that the translations are certified or independently approved.
"""
from pathlib import Path
import json
import re
import html
import fitz
import sys

ROOT=Path(__file__).resolve().parents[1]
LABELS={
 'es':{'title':'Documentación técnica en español','source':'Página de referencia original','note':'Traducción de referencia preparada con herramientas de traducción asistida. Verifique los datos técnicos con el original en inglés y la ficha técnica del producto ofrecido. El documento original completo se incluye en el apéndice.'},
 'th':{'title':'เอกสารทางเทคนิคฉบับภาษาไทย','source':'หน้าอ้างอิงต้นฉบับ','note':'คำแปลเพื่อใช้อ้างอิงประกอบการจัดซื้อ จัดทำโดยใช้เครื่องมือช่วยแปล โปรดตรวจสอบข้อมูลทางเทคนิคกับเอกสารภาษาอังกฤษต้นฉบับและ TDS ที่ใช้กับสินค้าที่เสนอ เอกสารภาษาอังกฤษฉบับสมบูรณ์อยู่ในภาคผนวก'},
 'vi':{'title':'Tài liệu kỹ thuật bằng tiếng Việt','source':'Trang nguồn tham chiếu','note':'Bản dịch tham khảo phục vụ mua hàng, được chuẩn bị với công cụ hỗ trợ dịch. Vui lòng đối chiếu thông tin kỹ thuật với bản gốc tiếng Anh và TDS áp dụng cho sản phẩm được cung cấp. Bản tiếng Anh đầy đủ nằm trong phần phụ lục.'}
}
def main():
    output=ROOT/'output/pdf'; output.mkdir(parents=True,exist_ok=True)
    locales=sys.argv[1:] or ['th','vi','es']
    report_path=ROOT/'reports/full-localization/pdf-validation.json'
    report=[item for item in json.loads(report_path.read_text(encoding='utf-8')) if item['language'] not in locales] if report_path.exists() else []
    for locale in locales:
        dictionary=json.loads((ROOT/f'src/i18n/pdf-{locale}.json').read_text(encoding='utf-8'))
        labels=LABELS[locale]
        for source in (ROOT/'public/docs').glob('*.pdf'):
            original=fitz.open(source)
            sections=[]
            strings=[]
            for page in original:
                blocks=[b for b in page.get_text('blocks') if b[6]==0]
                parts=[]
                for block in blocks:
                    value=' '.join(block[4].split())
                    if not value: continue
                    translated=dictionary.get(value)
                    if not translated: raise ValueError(f'Missing {locale} PDF translation: {value}')
                    numbers=lambda s: sorted(re.findall(r'\d+(?:[.,]\d+)*',s))
                    if numbers(value)!=numbers(translated): raise ValueError(f'PDF numeric mismatch: {value} -> {translated}')
                    strings.append(value)
                    parts.append('<p>'+html.escape(translated)+'</p>')
                sections.append('<h2>'+labels['source']+' '+str(page.number+1)+'</h2>'+''.join(parts))
            document='<h1>Tianyuan Waterproof</h1><h2>'+labels['title']+'</h2><p class="note">'+labels['note']+'</p>'+''.join(sections)
            css='''@font-face{font-family:NotoThai;src:url(NotoSansThai.ttf)}
            @font-face{font-family:Noto;src:url(NotoSans.ttf)}
            body{font-family:NotoThai,Noto,sans-serif;font-size:11pt;line-height:1.55;color:#102033}
            h1{font-size:22pt;color:#0e2a47;margin:0 0 12pt}h2{font-size:14pt;color:#174d7a;margin:18pt 0 8pt}
            p{margin:0 0 8pt;orphans:2;widows:2}.note{padding:12pt;background:#edf4fb;font-size:10pt}
            '''
            temporary=ROOT/'tmp/pdfs'/f'{source.stem}-{locale}-text.pdf'
            temporary.parent.mkdir(parents=True,exist_ok=True)
            writer=fitz.DocumentWriter(str(temporary))
            story=fitz.Story(document,user_css=css,archive=fitz.Archive(str(ROOT/'tmp/pdf-fonts')))
            more=True
            while more:
                device=writer.begin_page(fitz.paper_rect('a4'))
                more,filled=story.place(fitz.Rect(42,40,553,795))
                story.draw(device); writer.end_page()
            writer.close()
            translated=fitz.open(temporary)
            translated_pages=translated.page_count
            translated.insert_pdf(original)
            translated.set_metadata({'title':labels['title']+' - '+source.stem,'author':'Tianyuan Waterproof','subject':'Localized reading edition with complete English source appendix','keywords':locale+', technical reference, bilingual'})
            destination=output/f'{source.stem}-{locale}.pdf'
            translated.save(destination,garbage=4,deflate=True)
            public=ROOT/f'public/docs/{locale}/{source.name}'; public.parent.mkdir(parents=True,exist_ok=True)
            public.write_bytes(destination.read_bytes())
            verification=fitz.open(destination)
            if not re.search('[\u0e00-\u0e7f]' if locale=='th' else ('[áéíóúñü]' if locale=='es' else '[àáảãạăâđêôơư]'), ''.join(p.get_text() for p in verification[:translated_pages]),re.I): raise ValueError('Missing localized glyphs')
            if verification.page_count != translated_pages+original.page_count: raise ValueError('Incomplete source appendix')
            qa=ROOT/'reports/full-localization/pdf-preview'; qa.mkdir(exist_ok=True,parents=True)
            for page in verification:
                page.get_pixmap(matrix=fitz.Matrix(0.7,0.7)).save(str(qa/f'{source.stem}-{locale}-{page.number+1:02}.png'))
            report.append({'file':str(public.relative_to(ROOT)),'language':locale,'translatedPages':translated_pages,'sourceAppendixPages':original.page_count,'translatedBlocks':len(strings),'bytes':public.stat().st_size})
            translated.close(); verification.close(); original.close()
            # Windows may retain a writer handle until process teardown.
            print(report[-1],flush=True)
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__': main()
