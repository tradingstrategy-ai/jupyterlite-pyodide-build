(self.webpackChunk_agoose77_jupyterlab_markup=self.webpackChunk_agoose77_jupyterlab_markup||[]).push([[384],{2384:e=>{"use strict";function o(e,o,t,n){var r=Number(e[o].meta.id+1).toString(),s="";return"string"==typeof n.docId&&(s="-"+n.docId+"-"),s+r}function t(e,o){var t=Number(e[o].meta.id+1).toString();return e[o].meta.subId>0&&(t+=":"+e[o].meta.subId),"["+t+"]"}function n(e,o,t,n,r){var s=r.rules.footnote_anchor_name(e,o,t,n,r),f=r.rules.footnote_caption(e,o,t,n,r),a=s;return e[o].meta.subId>0&&(a+=":"+e[o].meta.subId),'<sup class="footnote-ref"><a href="#fn'+s+'" id="fnref'+a+'">'+f+"</a></sup>"}function r(e,o,t){return(t.xhtmlOut?'<hr class="footnotes-sep" />\n':'<hr class="footnotes-sep">\n')+'<section class="footnotes">\n<ol class="footnotes-list">\n'}function s(){return"</ol>\n</section>\n"}function f(e,o,t,n,r){var s=r.rules.footnote_anchor_name(e,o,t,n,r);return e[o].meta.subId>0&&(s+=":"+e[o].meta.subId),'<li id="fn'+s+'" class="footnote-item">'}function a(){return"</li>\n"}function l(e,o,t,n,r){var s=r.rules.footnote_anchor_name(e,o,t,n,r);return e[o].meta.subId>0&&(s+=":"+e[o].meta.subId),' <a href="#fnref'+s+'" class="footnote-backref">↩︎</a>'}e.exports=function(e){var c=e.helpers.parseLinkLabel,u=e.utils.isSpace;e.renderer.rules.footnote_ref=n,e.renderer.rules.footnote_block_open=r,e.renderer.rules.footnote_block_close=s,e.renderer.rules.footnote_open=f,e.renderer.rules.footnote_close=a,e.renderer.rules.footnote_anchor=l,e.renderer.rules.footnote_caption=t,e.renderer.rules.footnote_anchor_name=o,e.block.ruler.before("reference","footnote_def",(function(e,o,t,n){var r,s,f,a,l,c,i,p,k,h,d,_=e.bMarks[o]+e.tShift[o],b=e.eMarks[o];if(_+4>b)return!1;if(91!==e.src.charCodeAt(_))return!1;if(94!==e.src.charCodeAt(_+1))return!1;for(l=_+2;l<b;l++){if(32===e.src.charCodeAt(l))return!1;if(93===e.src.charCodeAt(l))break}if(l===_+2)return!1;if(l+1>=b||58!==e.src.charCodeAt(++l))return!1;if(n)return!0;for(l++,e.env.footnotes||(e.env.footnotes={}),e.env.footnotes.refs||(e.env.footnotes.refs={}),c=e.src.slice(_+2,l-2),e.env.footnotes.refs[":"+c]=-1,(i=new e.Token("footnote_reference_open","",1)).meta={label:c},i.level=e.level++,e.tokens.push(i),r=e.bMarks[o],s=e.tShift[o],f=e.sCount[o],a=e.parentType,d=l,p=k=e.sCount[o]+l-(e.bMarks[o]+e.tShift[o]);l<b&&(h=e.src.charCodeAt(l),u(h));)9===h?k+=4-k%4:k++,l++;return e.tShift[o]=l-d,e.sCount[o]=k-p,e.bMarks[o]=d,e.blkIndent+=4,e.parentType="footnote",e.sCount[o]<e.blkIndent&&(e.sCount[o]+=e.blkIndent),e.md.block.tokenize(e,o,t,!0),e.parentType=a,e.blkIndent-=4,e.tShift[o]=s,e.sCount[o]=f,e.bMarks[o]=r,(i=new e.Token("footnote_reference_close","",-1)).level=--e.level,e.tokens.push(i),!0}),{alt:["paragraph","reference"]}),e.inline.ruler.after("image","footnote_inline",(function(e,o){var t,n,r,s,f=e.posMax,a=e.pos;return!(a+2>=f||94!==e.src.charCodeAt(a)||91!==e.src.charCodeAt(a+1)||(t=a+2,(n=c(e,a+1))<0||(o||(e.env.footnotes||(e.env.footnotes={}),e.env.footnotes.list||(e.env.footnotes.list=[]),r=e.env.footnotes.list.length,e.md.inline.parse(e.src.slice(t,n),e.md,e.env,s=[]),e.push("footnote_ref","",0).meta={id:r},e.env.footnotes.list[r]={content:e.src.slice(t,n),tokens:s}),e.pos=n+1,e.posMax=f,0)))})),e.inline.ruler.after("footnote_inline","footnote_ref",(function(e,o){var t,n,r,s,f=e.posMax,a=e.pos;if(a+3>f)return!1;if(!e.env.footnotes||!e.env.footnotes.refs)return!1;if(91!==e.src.charCodeAt(a))return!1;if(94!==e.src.charCodeAt(a+1))return!1;for(n=a+2;n<f;n++){if(32===e.src.charCodeAt(n))return!1;if(10===e.src.charCodeAt(n))return!1;if(93===e.src.charCodeAt(n))break}return!(n===a+2||n>=f||(n++,t=e.src.slice(a+2,n-1),void 0===e.env.footnotes.refs[":"+t]||(o||(e.env.footnotes.list||(e.env.footnotes.list=[]),e.env.footnotes.refs[":"+t]<0?(r=e.env.footnotes.list.length,e.env.footnotes.list[r]={label:t,count:0},e.env.footnotes.refs[":"+t]=r):r=e.env.footnotes.refs[":"+t],s=e.env.footnotes.list[r].count,e.env.footnotes.list[r].count++,e.push("footnote_ref","",0).meta={id:r,subId:s,label:t}),e.pos=n,e.posMax=f,0)))})),e.core.ruler.after("inline","footnote_tail",(function(e){var o,t,n,r,s,f,a,l,c,u,i=!1,p={};if(e.env.footnotes&&(e.tokens=e.tokens.filter((function(e){return"footnote_reference_open"===e.type?(i=!0,c=[],u=e.meta.label,!1):"footnote_reference_close"===e.type?(i=!1,p[":"+u]=c,!1):(i&&c.push(e),!i)})),e.env.footnotes.list)){for(f=e.env.footnotes.list,a=new e.Token("footnote_block_open","",1),e.tokens.push(a),o=0,t=f.length;o<t;o++){for((a=new e.Token("footnote_open","",1)).meta={id:o,label:f[o].label},e.tokens.push(a),f[o].tokens?(l=[],(a=new e.Token("paragraph_open","p",1)).block=!0,l.push(a),(a=new e.Token("inline","",0)).children=f[o].tokens,a.content=f[o].content,l.push(a),(a=new e.Token("paragraph_close","p",-1)).block=!0,l.push(a)):f[o].label&&(l=p[":"+f[o].label]),e.tokens=e.tokens.concat(l),s="paragraph_close"===e.tokens[e.tokens.length-1].type?e.tokens.pop():null,r=f[o].count>0?f[o].count:1,n=0;n<r;n++)(a=new e.Token("footnote_anchor","",0)).meta={id:o,subId:n,label:f[o].label},e.tokens.push(a);s&&e.tokens.push(s),a=new e.Token("footnote_close","",-1),e.tokens.push(a)}a=new e.Token("footnote_block_close","",-1),e.tokens.push(a)}}))}}}]);