// Keep the English layout modules while providing native Arabic reading order.
export function applyArabicDirection(document) {
  const visit=(node,fn)=>{fn(node);for(const child of [...node.childNodes||[]])visit(child,fn);};
  const attr=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
  const set=(node,name,value)=>{node.attrs||=[];const a=node.attrs.find(a=>a.name===name);if(a)a.value=value;else node.attrs.push({name,value});};
  const contents=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(contents).join('');
  visit(document,node=>{
    if(node.tagName==='html')set(node,'dir','rtl');
    if((attr(node,'class')||'').split(' ').includes('site-header-brand'))set(node,'dir','ltr');
    if(['td','th'].includes(node.tagName)&&!/[\u0600-\u06ff]/.test(contents(node)))set(node,'dir','ltr');
  });
  const technical=/(?:\bTY-SHIELD™?|\d+(?:[.,]\d+)*(?:\s*(?:mm|cm|m|ft)?\s*[×x/]\s*\d+(?:[.,]\d+)*\s*(?:mm|cm|m|ft)?)+|\b(?:GB(?:\/T)?|ASTM|ISO|EN|GRI-GM)\s*[A-Z]?\d[\dA-Z./:–-]*|\b(?:SBS|APP|PVC|TPO|EPDM|HDPE|PU|JS|PYG|PY|OEM|TDS|MSDS)\b|[+≥≤±−-]?\d+(?:[.,]\d+)*(?:\s*[×/–-]\s*\d+(?:[.,]\d+)*)?(?:\s*(?:°[CF]|kN\/m|N\/(?:50)?mm|MPa|kPa|kg\/m[²2]|g\/m[²2]|mm|cm|kg|min|mil|m[²³23]?|FT|HQ|%))?)/g;
  function isolate(node,skip=false){
    const excluded=skip||['head','script','style','code','pre','svg','bdi','textarea','option'].includes(node.tagName);
    if(!excluded&&node.childNodes)node.childNodes=node.childNodes.flatMap(child=>{
      if(child.nodeName!=='#text'){isolate(child,excluded);return [child];}
      const value=child.value.replace(/→|←/g,a=>a==='→'?'←':'→');
      const result=[];let cursor=0;
      for(const match of value.matchAll(technical)){
        if(match.index>cursor)result.push({nodeName:'#text',value:value.slice(cursor,match.index),parentNode:node});
        const bdi={nodeName:'bdi',tagName:'bdi',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[{name:'dir',value:'ltr'}],childNodes:[],parentNode:node};
        bdi.childNodes.push({nodeName:'#text',value:match[0],parentNode:bdi});result.push(bdi);cursor=match.index+match[0].length;
      }
      if(cursor<value.length)result.push({nodeName:'#text',value:value.slice(cursor),parentNode:node});
      return result.length?result:[child];
    });
  }
  isolate(document);
  const css=`html[dir=rtl] .text-left{text-align:right}
html[dir=rtl] .language-switcher>nav,html[dir=rtl] .site-header-mobile>nav{right:auto;left:0}
html[dir=rtl] .ml-auto{margin-left:0;margin-right:auto}
html[dir=rtl] .mr-auto{margin-right:0;margin-left:auto}
html[dir=rtl] input[type=email],html[dir=rtl] input[type=tel],html[dir=rtl] input[type=url],html[dir=rtl] a[href^="mailto:"],html[dir=rtl] a[href^="https://wa.me/"]{direction:ltr;unicode-bidi:isolate}
html[dir=rtl] input[type=email],html[dir=rtl] input[type=tel],html[dir=rtl] input[type=url]{text-align:left}
html[dir=rtl] .lucide-chevron-right,html[dir=rtl] .lucide-arrow-right{transform:scaleX(-1)}
html[dir=rtl] bdi{unicode-bidi:isolate}`;
  visit(document,node=>{if(node.tagName==='head'){const style={nodeName:'style',tagName:'style',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[],childNodes:[],parentNode:node};style.childNodes.push({nodeName:'#text',value:css,parentNode:style});node.childNodes.push(style);}});
}
