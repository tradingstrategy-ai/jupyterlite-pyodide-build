(self.webpackChunk_agoose77_jupyterlab_markup=self.webpackChunk_agoose77_jupyterlab_markup||[]).push([[178],{178:(e,n,r)=>{"use strict";r.r(n),r.d(n,{default:()=>u});var t={false:"push",true:"unshift"},a=Object.prototype.hasOwnProperty,i=function(e,n,r,t){var i=e,l=t;if(r&&a.call(n,i))throw Error("User defined id attribute '"+e+"' is NOT unique. Please fix it in your markdown to continue.");for(;a.call(n,i);)i=e+"-"+l++;return n[i]=!0,i},l=function e(n,r){r=Object.assign({},e.defaults,r),n.core.ruler.push("anchor",(function(e){var n,t={},a=e.tokens,l=Array.isArray(r.level)?(n=r.level,function(e){return n.includes(e)}):function(e){return function(n){return n>=e}}(r.level);a.filter((function(e){return"heading_open"===e.type})).filter((function(e){return l(Number(e.tag.substr(1)))})).forEach((function(n){var l=a[a.indexOf(n)+1].children.filter((function(e){return"text"===e.type||"code_inline"===e.type})).reduce((function(e,n){return e+n.content}),""),u=n.attrGet("id");u=null==u?i(r.slugify(l),t,!1,r.uniqueSlugStartIndex):i(u,t,!0,r.uniqueSlugStartIndex),n.attrSet("id",u),r.permalink&&r.renderPermalink(u,r,e,a.indexOf(n)),r.callback&&r.callback(n,{slug:u,title:l})}))}))};l.defaults={level:1,slugify:function(e){return encodeURIComponent(String(e).trim().toLowerCase().replace(/\s+/g,"-"))},permalink:!1,renderPermalink:function(e,n,r,a){var i,l=[Object.assign(new r.Token("link_open","a",1),{attrs:[["class",n.permalinkClass],["href",n.permalinkHref(e,r)]].concat(Object.entries(n.permalinkAttrs(e,r)))}),Object.assign(new r.Token("html_block","",0),{content:n.permalinkSymbol}),new r.Token("link_close","a",-1)];n.permalinkSpace&&l[t[!n.permalinkBefore]](Object.assign(new r.Token("text","",0),{content:" "})),(i=r.tokens[a+1].children)[t[n.permalinkBefore]].apply(i,l)},permalinkClass:"header-anchor",permalinkSpace:!0,permalinkSymbol:"¶",permalinkBefore:!1,permalinkHref:function(e){return"#"+e},permalinkAttrs:function(e){return{}},uniqueSlugStartIndex:1};const u=l}}]);