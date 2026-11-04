// Scoped to this article: grammar across inline links, Arabic units and cards.
const slug='/blog/pvc-roofing-membrane-specifications-tds-checklist/';
const prefixes={fr:['La ',' de Tianyuan '],es:['La ',' de Tianyuan '],'pt-br':['A ',' da Tianyuan '],ar:['',' لشركة Tianyuan '],th:['',' ของ Tianyuan '],vi:['',' của Tianyuan ']};
export function refinePvcChecklist(document,path,locale){
  if(path!==slug)return;
  const visit=(node,fn)=>{fn(node);for(const child of [...node.childNodes||[]])visit(child,fn);};
  const attr=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
  visit(document,node=>{
    if(node.tagName!=='p')return;
    const children=node.childNodes||[];
    const index=children.findIndex(n=>n.tagName==='a'&&attr(n,'href')?.endsWith('/products/pvc-waterproofing-membrane-manufacturer/'));
    if(index<0)return;
    if(children[index-1]?.nodeName==='#text')children[index-1].value=prefixes[locale][0];
    if(children[index+1]?.nodeName==='#text')children[index+1].value=prefixes[locale][1]+children[index+1].value.trimStart();
  });
  if(locale!=='ar')return;
  // Isolate the complete compound unit, not only the number after its slash.
  function isolate(node,skip=false){
    const excluded=skip||['head','script','style','code','pre','svg','bdi'].includes(node.tagName);
    if(excluded)return;
    if(node.childNodes)node.childNodes=node.childNodes.flatMap(child=>{
      if(child.nodeName!=='#text'){isolate(child);return[child];}
      const out=[];let cursor=0;
      for(const match of child.value.matchAll(/N\/50 mm|MPa|\bmil\b/g)){
        if(match.index>cursor)out.push({nodeName:'#text',value:child.value.slice(cursor,match.index),parentNode:node});
        const bdi={nodeName:'bdi',tagName:'bdi',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[{name:'dir',value:'ltr'}],childNodes:[],parentNode:node};
        bdi.childNodes.push({nodeName:'#text',value:match[0],parentNode:bdi});out.push(bdi);cursor=match.index+match[0].length;
      }
      if(!out.length)return[child];
      if(cursor<child.value.length)out.push({nodeName:'#text',value:child.value.slice(cursor),parentNode:node});
      return out;
    });
  }
  isolate(document);
  visit(document,node=>{
    if(node.tagName!=='head')return;
    const style={nodeName:'style',tagName:'style',namespaceURI:'http://www.w3.org/1999/xhtml',attrs:[],childNodes:[],parentNode:node};
    style.childNodes.push({nodeName:'#text',parentNode:style,value:'html[dir=rtl] .pvc-check-result{border-left:0;border-right:4px solid #2563eb}html[dir=rtl] .pvc-check-result-hot{border-right-color:#f97316}html[dir=rtl] .pvc-check-result-wet{border-right-color:#10b981}@media(max-width:639px){html[dir=rtl] .pvc-check-cards label{text-align:right}}'});
    node.childNodes.push(style);
  });
}
