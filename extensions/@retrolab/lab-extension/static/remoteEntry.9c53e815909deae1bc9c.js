var _JUPYTERLAB;(()=>{"use strict";var e,r,t,a,n,o,i,l,u,s,d,f,c,p,b,h,v,m,g,y,w,j,S={933:(e,r,t)=>{var a={"./index":()=>Promise.all([t.e(962),t.e(568)]).then((()=>()=>t(568))),"./extension":()=>Promise.all([t.e(962),t.e(568)]).then((()=>()=>t(568))),"./style":()=>t.e(776).then((()=>()=>t(776)))},n=(e,r)=>(t.R=r,r=t.o(a,e)?a[e]():Promise.resolve().then((()=>{throw new Error('Module "'+e+'" does not exist in container.')})),t.R=void 0,r),o=(e,r)=>{if(t.S){var a=t.S.default,n="default";if(a&&a!==e)throw new Error("Container initialization failed as it has already been initialized with a different share scope");return t.S[n]=e,t.I(n,r)}};t.d(r,{get:()=>n,init:()=>o})}},P={};function x(e){var r=P[e];if(void 0!==r)return r.exports;var t=P[e]={id:e,exports:{}};return S[e](t,t.exports,x),t.exports}x.m=S,x.c=P,x.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return x.d(r,{a:r}),r},x.d=(e,r)=>{for(var t in r)x.o(r,t)&&!x.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},x.f={},x.e=e=>Promise.all(Object.keys(x.f).reduce(((r,t)=>(x.f[t](e,r),r)),[])),x.u=e=>e+"."+{58:"d813a60814443b397fd0",568:"3d95f4afc8a1837a0239",676:"c943f4e5cc610c2a6b9b",697:"6e8b6c3eb88a4acb41c0",776:"d2dd2c76842bf87de493",962:"9b8a50ceae6f0a42ad83",974:"147f9dd64512e2ad57e3"}[e]+".js?v="+{58:"d813a60814443b397fd0",568:"3d95f4afc8a1837a0239",676:"c943f4e5cc610c2a6b9b",697:"6e8b6c3eb88a4acb41c0",776:"d2dd2c76842bf87de493",962:"9b8a50ceae6f0a42ad83",974:"147f9dd64512e2ad57e3"}[e],x.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),x.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),e={},r="@retrolab/lab-extension:",x.l=(t,a,n,o)=>{if(e[t])e[t].push(a);else{var i,l;if(void 0!==n)for(var u=document.getElementsByTagName("script"),s=0;s<u.length;s++){var d=u[s];if(d.getAttribute("src")==t||d.getAttribute("data-webpack")==r+n){i=d;break}}i||(l=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,x.nc&&i.setAttribute("nonce",x.nc),i.setAttribute("data-webpack",r+n),i.src=t),e[t]=[a];var f=(r,a)=>{i.onerror=i.onload=null,clearTimeout(c);var n=e[t];if(delete e[t],i.parentNode&&i.parentNode.removeChild(i),n&&n.forEach((e=>e(a))),r)return r(a)},c=setTimeout(f.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=f.bind(null,i.onerror),i.onload=f.bind(null,i.onload),l&&document.head.appendChild(i)}},x.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{x.S={};var e={},r={};x.I=(t,a)=>{a||(a=[]);var n=r[t];if(n||(n=r[t]={}),!(a.indexOf(n)>=0)){if(a.push(n),e[t])return e[t];x.o(x.S,t)||(x.S[t]={});var o=x.S[t],i="@retrolab/lab-extension",l=(e,r,t,a)=>{var n=o[e]=o[e]||{},l=n[r];(!l||!l.loaded&&(!a!=!l.eager?a:i>l.from))&&(n[r]={get:t,from:i,eager:!!a})},u=[];switch(t){case"default":l("@retrolab/application","0.3.20",(()=>Promise.all([x.e(974),x.e(58),x.e(962),x.e(676)]).then((()=>()=>x(676))))),l("@retrolab/lab-extension","0.3.20",(()=>Promise.all([x.e(962),x.e(568)]).then((()=>()=>x(568)))))}return e[t]=u.length?Promise.all(u).then((()=>e[t]=1)):1}}})(),(()=>{var e;x.g.importScripts&&(e=x.g.location+"");var r=x.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");t.length&&(e=t[t.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),x.p=e})(),t=e=>{var r=e=>e.split(".").map((e=>+e==e?+e:e)),t=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(e),a=t[1]?r(t[1]):[];return t[2]&&(a.length++,a.push.apply(a,r(t[2]))),t[3]&&(a.push([]),a.push.apply(a,r(t[3]))),a},a=(e,r)=>{e=t(e),r=t(r);for(var a=0;;){if(a>=e.length)return a<r.length&&"u"!=(typeof r[a])[0];var n=e[a],o=(typeof n)[0];if(a>=r.length)return"u"==o;var i=r[a],l=(typeof i)[0];if(o!=l)return"o"==o&&"n"==l||"s"==l||"u"==o;if("o"!=o&&"u"!=o&&n!=i)return n<i;a++}},n=e=>{var r=e[0],t="";if(1===e.length)return"*";if(r+.5){t+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var a=1,o=1;o<e.length;o++)a--,t+="u"==(typeof(l=e[o]))[0]?"-":(a>0?".":"")+(a=2,l);return t}var i=[];for(o=1;o<e.length;o++){var l=e[o];i.push(0===l?"not("+u()+")":1===l?"("+u()+" || "+u()+")":2===l?i.pop()+" "+i.pop():n(l))}return u();function u(){return i.pop().replace(/^\((.+)\)$/,"$1")}},o=(e,r)=>{if(0 in e){r=t(r);var a=e[0],n=a<0;n&&(a=-a-1);for(var i=0,l=1,u=!0;;l++,i++){var s,d,f=l<e.length?(typeof e[l])[0]:"";if(i>=r.length||"o"==(d=(typeof(s=r[i]))[0]))return!u||("u"==f?l>a&&!n:""==f!=n);if("u"==d){if(!u||"u"!=f)return!1}else if(u)if(f==d)if(l<=a){if(s!=e[l])return!1}else{if(n?s>e[l]:s<e[l])return!1;s!=e[l]&&(u=!1)}else if("s"!=f&&"n"!=f){if(n||l<=a)return!1;u=!1,l--}else{if(l<=a||d<f!=n)return!1;u=!1}else"s"!=f&&"n"!=f&&(u=!1,l--)}}var c=[],p=c.pop.bind(c);for(i=1;i<e.length;i++){var b=e[i];c.push(1==b?p()|p():2==b?p()&p():b?o(b,r):!p())}return!!p()},i=(e,r)=>{var t=x.S[e];if(!t||!x.o(t,r))throw new Error("Shared module "+r+" doesn't exist in shared scope "+e);return t},l=(e,r)=>{var t=e[r];return(r=Object.keys(t).reduce(((e,r)=>!e||a(e,r)?r:e),0))&&t[r]},u=(e,r)=>{var t=e[r];return Object.keys(t).reduce(((e,r)=>!e||!t[e].loaded&&a(e,r)?r:e),0)},s=(e,r,t)=>"Unsatisfied version "+r+" of shared singleton module "+e+" (required "+n(t)+")",d=(e,r,t,a)=>{var n=u(e,t);return o(a,n)||"undefined"!=typeof console&&console.warn&&console.warn(s(t,n,a)),b(e[t][n])},f=(e,r,t)=>{var n=e[r];return(r=Object.keys(n).reduce(((e,r)=>!o(t,r)||e&&!a(e,r)?e:r),0))&&n[r]},c=(e,r,t,a)=>{var o=e[t];return"No satisfying version ("+n(a)+") of shared module "+t+" found in shared scope "+r+".\nAvailable versions: "+Object.keys(o).map((e=>e+" from "+o[e].from)).join(", ")},p=(e,r,t,a)=>{"undefined"!=typeof console&&console.warn&&console.warn(c(e,r,t,a))},b=e=>(e.loaded=1,e.get()),v=(h=e=>function(r,t,a,n){var o=x.I(r);return o&&o.then?o.then(e.bind(e,r,x.S[r],t,a,n)):e(r,x.S[r],t,a,n)})(((e,r,t,a)=>(i(e,t),b(f(r,t,a)||p(r,e,t,a)||l(r,t))))),m=h(((e,r,t,a)=>(i(e,t),d(r,0,t,a)))),g=h(((e,r,t,a,n)=>{var o=r&&x.o(r,t)&&f(r,t,a);return o?b(o):n()})),y={},w={56:()=>m("default","@jupyterlab/apputils",[1,3,3,0]),337:()=>m("default","@jupyterlab/translation",[1,3,3,0]),380:()=>m("default","@jupyterlab/application",[1,3,3,0]),706:()=>m("default","@lumino/widgets",[1,1,19,0]),922:()=>m("default","@jupyterlab/coreutils",[1,5,3,0]),170:()=>m("default","@jupyterlab/notebook",[1,3,3,0]),383:()=>m("default","@jupyterlab/mainmenu",[1,3,3,0]),526:()=>g("default","@retrolab/application",[2,0,3,20],(()=>Promise.all([x.e(974),x.e(58),x.e(697)]).then((()=>()=>x(676))))),3:()=>m("default","@jupyterlab/ui-components",[1,3,3,0]),129:()=>m("default","@lumino/disposable",[1,1,4,3]),168:()=>m("default","@lumino/signaling",[1,1,4,3]),211:()=>m("default","@lumino/messaging",[1,1,4,3]),461:()=>v("default","@jupyterlab/docregistry",[1,3,3,0]),562:()=>m("default","@lumino/properties",[1,1,2,3]),778:()=>m("default","@jupyterlab/rendermime",[1,3,3,0]),797:()=>m("default","@lumino/coreutils",[1,1,5,3]),850:()=>m("default","@lumino/algorithm",[1,1,3,3])},j={58:[3,129,168,211,461,562,778,797,850],568:[170,383,526],962:[56,337,380,706,922]},x.f.consumes=(e,r)=>{x.o(j,e)&&j[e].forEach((e=>{if(x.o(y,e))return r.push(y[e]);var t=r=>{y[e]=0,x.m[e]=t=>{delete x.c[e],t.exports=r()}},a=r=>{delete y[e],x.m[e]=t=>{throw delete x.c[e],r}};try{var n=w[e]();n.then?r.push(y[e]=n.then(t).catch(a)):t(n)}catch(e){a(e)}}))},(()=>{var e={924:0};x.f.j=(r,t)=>{var a=x.o(e,r)?e[r]:void 0;if(0!==a)if(a)t.push(a[2]);else if(/^(58|962)$/.test(r))e[r]=0;else{var n=new Promise(((t,n)=>a=e[r]=[t,n]));t.push(a[2]=n);var o=x.p+x.u(r),i=new Error;x.l(o,(t=>{if(x.o(e,r)&&(0!==(a=e[r])&&(e[r]=void 0),a)){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;i.message="Loading chunk "+r+" failed.\n("+n+": "+o+")",i.name="ChunkLoadError",i.type=n,i.request=o,a[1](i)}}),"chunk-"+r,r)}};var r=(r,t)=>{var a,n,[o,i,l]=t,u=0;for(a in i)x.o(i,a)&&(x.m[a]=i[a]);for(l&&l(x),r&&r(t);u<o.length;u++)n=o[u],x.o(e,n)&&e[n]&&e[n][0](),e[o[u]]=0},t=self.webpackChunk_retrolab_lab_extension=self.webpackChunk_retrolab_lab_extension||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})();var k=x(933);(_JUPYTERLAB=void 0===_JUPYTERLAB?{}:_JUPYTERLAB)["@retrolab/lab-extension"]=k})();