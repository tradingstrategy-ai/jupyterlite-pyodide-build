(self.webpackChunk_agoose77_jupyterlab_markup=self.webpackChunk_agoose77_jupyterlab_markup||[]).push([[174,209],{5209:(e,t,n)=>{"use strict";n.r(t),n.d(t,{IMarkdownIt:()=>i.tN,PACKAGE_NS:()=>i.pm,simpleMarkdownItPlugin:()=>s});var i=n(8036);function s(e,t){return{id:`${e}:${t.id}`,autoStart:!0,requires:[i.tN],activate:(e,n)=>{n.addPluginProvider(t)}}}},8174:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>_});var i=n(7363),s=n(5185),r=n(968),a=n(5358),o=n(8036),l=n(6168),d=n(6143),c=n(564),u=n(5028),h=n.n(u);class g extends d.RenderedHTMLCommon{constructor(e){super(e),this.addClass("jp-RenderedMarkdown")}async render(e){return null==this.md&&(this.md=await g.markdownItManager.getMarkdownIt(this)),await async function(e){const{host:t,source:n,md:i}=e,s=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(i=Object.getOwnPropertySymbols(e);s<i.length;s++)t.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(e,i[s])&&(n[i[s]]=e[i[s]])}return n}(e,["host","source","md"]);if(!n)return void(t.textContent="");const r=(0,d.removeMath)(n);let a=i.render(r.text);a=(0,d.replaceMath)(a,r.math),await(0,d.renderHTML)(Object.assign({host:t,source:a},s))}({host:this.node,source:String(e.data[this.mimeType]),trusted:e.trusted,resolver:this.resolver,sanitizer:this.sanitizer,linkHandler:this.linkHandler,shouldTypeset:this.isAttached,md:this.md,latexTypesetter:this.latexTypesetter})}onAfterAttach(e){this.latexTypesetter&&this.latexTypesetter.typeset(this.node)}}const m=d.markdownRendererFactory.createRenderer;class p{constructor(){this.settingsChanged=new l.Signal(this),this.userDisabledPlugins=[],this.useMarkdownIt=!0,this.userMarkdownItOptions={},this.userPluginOptions={},this._pluginProviders=new Map,this.createRenderer=e=>this.useMarkdownIt?new g(e):m(e),this.highlightCode=(e,t)=>{if(!t)return"";try{const n=c.Mode.findBest(t);if(!n)return void console.warn(`No CodeMirror mode: ${t}`);const i=document.createElement("div");try{return c.Mode.run(e,n.mime,i),i.innerHTML}catch(e){console.warn(`Failed to highlight ${t} code`,e)}}catch(e){console.warn(`No CodeMirror mode: ${t}`),console.warn(`Require CodeMirror mode error: ${e}`)}return""},d.markdownRendererFactory.createRenderer=this.createRenderer}set settings(e){this._settings&&this._settings.changed.disconnect(this.onSettingsChanged,this),this._settings=e,null!=e&&(this._settings.changed.connect(this.onSettingsChanged,this),this.onSettingsChanged())}get settings(){return this._settings}onSettingsChanged(){var e,t,n,i;const s=null===(e=this.settings)||void 0===e?void 0:e.composite.enabled;this.useMarkdownIt=null==s||s,this.userMarkdownItOptions=(null===(t=this.settings)||void 0===t?void 0:t.composite["markdown-it-options"])||{},this.userDisabledPlugins=(null===(n=this.settings)||void 0===n?void 0:n.composite["disabled-plugins"])||[],this.userPluginOptions=(null===(i=this.settings)||void 0===i?void 0:i.composite["plugin-options"])||{},this.settingsChanged.emit(void 0)}get enabled(){var e;const t=null===(e=this.settings)||void 0===e?void 0:e.composite;return!(null!=t&&!t)}set enabled(e){null!=this.settings?this.settings.set("enabled",e):console.warn("Can't set enabled status of markdown extensions without settings")}addPluginProvider(e){this._pluginProviders.set(e.id,e)}getPluginProvider(e){return this._pluginProviders.get(e)}get pluginProviderIds(){return[...this._pluginProviders.keys()]}removePluginProvider(e){this._pluginProviders.delete(e)}async getMarkdownIt(e,t={}){const n=Object.assign(Object.assign(Object.assign({},await this.getOptions(e)),t),this.userMarkdownItOptions);let i=new(h())("default",n);for(const[e,t]of this._pluginProviders.entries())if(-1===this.userDisabledPlugins.indexOf(e))try{const n=this.userPluginOptions[e]||[],[s,...r]=await t.plugin();let a=0;const o=Math.max(r.length,n.length),l=new Array(o);for(;a<o;)l[a]=a<n.length?n[a]:r[a],a++;i=i.use(s,...l)}catch(t){console.warn(`Failed to load/use markdown-it plugin ${e}`,t)}return i}async getOptions(e){let t=this.baseMarkdownItOptions;for(const[n,i]of this._pluginProviders.entries())if(-1===this.userDisabledPlugins.indexOf(n)&&null!=i.options)try{t=Object.assign(Object.assign({},t),await i.options(e))}catch(e){console.warn(`Failed to get options from markdown-it plugin ${n}`,e)}return t}get baseMarkdownItOptions(){return{html:!0,linkify:!0,typographer:!0,langPrefix:`cm-s-${c.CodeMirrorEditor.defaultConfig.theme} language-`,highlight:this.highlightCode}}}var f=n(6271);const b="jp-mu-mod-disabled",v="id-jp-mu-global",w="id-jp-mu-plugin";class k extends s.VDomRenderer{constructor(e){super(e),this.onPluginEnabledChanged=e=>{const{value:t,checked:n}=e.currentTarget;this.model.setPluginEnabled(t,n)},this.onEnabledChanged=e=>{this.model.enabled=e.currentTarget.checked},this.onAdvancedClicked=()=>{this.model.advancedRequested.emit(void 0)},this.addClass("jp-MarkdownItSettings"),this.addClass("jp-RenderedHTMLCommon")}dispose(){var e;null===(e=this.model)||void 0===e||e.dispose(),super.dispose()}render(){const e=this.model,t=null==e?void 0:e.manager,n=f.createElement("a",{href:"#",onClick:this.onAdvancedClicked},"Open in Advanced Settings...");if(null==t)return f.createElement("div",null);const{providers:i}=e;return f.createElement("div",null,f.createElement("header",null,f.createElement("ul",null,f.createElement("li",null,f.createElement("a",{href:`#${v}`},"Global")),f.createElement("li",null,f.createElement("a",{href:`#${w}`},"Markdown-it Plugins"),f.createElement("ul",null,i.map(this.renderPluginNav,this))),f.createElement("li",null,n))),f.createElement("article",null,f.createElement("section",{id:v},f.createElement("h3",null,"Global"),f.createElement("label",null,f.createElement("input",{type:"checkbox",defaultChecked:e.enabled,onChange:this.onEnabledChanged}),"Use ",f.createElement("code",null,"markdown-it")),f.createElement("blockquote",null,"Enable to use the ",f.createElement("code",null,"markdown-it")," Markdown renderer and extensions for any new renderers.")),f.createElement("h3",{id:w},"Markdown-it Plugins"),f.createElement("blockquote",null,"Extensions can be individually enabled or disabled with the checkboxes below. See ",n," for more fine-grained control."),i.map(this.renderPluginProvider,this)))}renderPluginNav(e){const t=this.model,n=-1===t.disabledPlugins.indexOf(e.id)&&t.enabled?"":b;return f.createElement("li",{key:e.id,className:n},f.createElement("a",{href:`#${w}-${e.id}`},e.title))}renderPluginProvider(e){const t=this.model,n=-1===t.disabledPlugins.indexOf(e.id),i=n&&t.enabled?"":b,s=[],r=[];for(const t in e.documentationUrls)s.push(this.renderDoc(t,e.documentationUrls[t]));for(const t in e.examples||{})r.push(this.renderExample(t,e.examples[t]));return f.createElement("section",{key:e.id,id:`${w}-${e.id}`,className:i},f.createElement("div",null,f.createElement("h4",{title:`plugin id: ${e.id}`},f.createElement("label",null,f.createElement("input",{type:"checkbox",value:e.id,defaultChecked:n,onChange:this.onPluginEnabledChanged}),e.title)),f.createElement("ul",{className:"jp-MarkdownItSettings-Docs"},s)),f.createElement("blockquote",null,e.description),f.createElement("ul",{className:"jp-MarkdownItSettings-Examples"},r))}renderDoc(e,t){return f.createElement("li",{key:t},f.createElement("a",{href:t,target:"_blank",rel:"noopener"},e))}renderExample(e,t){return f.createElement("div",{key:e},f.createElement("p",null,f.createElement("label",null,f.createElement("em",null,e))),f.createElement("pre",null,f.createElement("code",null,t)))}}!function(e){class t extends s.VDomModel{constructor(){super(...arguments),this.advancedRequested=new l.Signal(this),this._disabledPlugins=[],this._enabled=!0,this._providers=[]}dispose(){super.dispose(),this._manager&&(this._manager.settingsChanged.disconnect(this.onSettingsChanged,this),this._manager=null)}get manager(){return this._manager}set manager(e){this._manager=e,e&&(e.settingsChanged.connect(this.onSettingsChanged,this),this.onSettingsChanged())}get disabledPlugins(){return this._disabledPlugins}get enabled(){return this._enabled}set enabled(e){this._manager.settings.set("enabled",e)}get providers(){return this._providers}setPluginEnabled(e,t){const n=this._disabledPlugins.slice(),i=n.indexOf(e);t?n.splice(i):n.push(e),n.length?this.manager.settings.set("disabled-plugins",n):this.manager.settings.remove("disabled-plugins")}onSettingsChanged(){const{composite:e}=this.manager.settings;null!=e&&(this._disabledPlugins=e["disabled-plugins"]||[],this._enabled=e.enabled,this._providers=this.manager.pluginProviderIds.map(this.manager.getPluginProvider,this.manager),this._providers.sort(this.sortByTitle)),this.stateChanged.emit(void 0)}sortByTitle(e,t){return e.title.localeCompare(t.title)}}e.Model=t}(k||(k={}));var y=n(5209);const E=[(0,y.simpleMarkdownItPlugin)(y.PACKAGE_NS,{id:"markdown-it-anchor",title:"Heading Anchors",description:"Create clickable links for header elements",documentationUrls:{Plugin:"https://github.com/valeriangalliat/markdown-it-anchor"},plugin:async()=>[(await n.e(875).then(n.t.bind(n,6826,23))).default,{permalink:!0,permalinkClass:"jp-InternalAnchorLink",slugify:e=>e.replace(/ /g,"-")}]}),(0,y.simpleMarkdownItPlugin)(y.PACKAGE_NS,{id:"markdown-it-deflist",title:"Definition Lists",description:"Create definition lists",documentationUrls:{Plugin:"https://github.com/markdown-it/markdown-it-deflist"},examples:{Example:"\nTerm 1\n~ Definition 1\n\nTerm 2\n~ Definition 2a\n~ Definition 2b\n      "},plugin:async()=>[(await n.e(780).then(n.t.bind(n,1336,23))).default]}),(0,y.simpleMarkdownItPlugin)(y.PACKAGE_NS,{id:"markdown-it-diagrams",title:"Diagrams",description:"Diagrams in code blocks from mermaid and svgbob",documentationUrls:{Plugin:"https://github.com/agoose77/markdown-it-diagrams",MermaidJS:"https://mermaid-js.github.io/mermaid",svgbob:"https://github.com/ivanceras/svgbob"},examples:{"Mermaid Flowchart":"\n  ```mermaid\n  graph TD;\n      A--\x3eB;\n      A--\x3eC;\n      B--\x3eD;\n      C--\x3eD;\n  ```",svgbob:"\n  ```bob\n      .---.\n      /-o-/--\n  .-/ / /->\n  ( *  /\n  '-.         /\n      '\n  ```\n          "},plugin:async()=>{const{loadPluginFactory:e}=await n.e(932).then(n.t.bind(n,1221,23));return[await e()]}}),(0,y.simpleMarkdownItPlugin)(y.PACKAGE_NS,{id:"markdown-it-footnote",title:"Footnotes",description:"Create links notes that appear after the current paragraph",documentationUrls:{Plugin:"https://github.com/markdown-it/markdown-it-footnote"},examples:{Simple:"\nHere is a footnote reference,[^1] and another.[^longnote]\n\n[^1]: Here is the footnote.\n\n[^longnote]: Here's one with multiple blocks.\n\n  Subsequent paragraphs are indented to show that they\nbelong to the previous footnote.\n      "},plugin:async()=>[(await n.e(985).then(n.t.bind(n,7473,23))).default]}),(0,y.simpleMarkdownItPlugin)(y.PACKAGE_NS,{id:"markdown-it-task-lists",title:"Task Lists",description:"Create checklists from lists",documentationUrls:{Plugin:"https://github.com/revin/markdown-it-task-lists"},examples:{Example:"\n- [x] done\n- [ ] to do\n- [ ] ~~not going to do~~\n      "},plugin:async()=>[(await n.e(497).then(n.t.bind(n,7497,23))).default]})];var C=n(3379),P=n.n(C),M=n(2760);P()(M.Z,{insert:"head",singleton:!1}),M.Z.locals;const x=new r.LabIcon({name:"jupyterlab-markup:core",svgstr:r.markdownIcon.svgstr.replace("jp-icon-contrast0","jp-icon-contrast1")}),S={id:`${o.pm}:core`,autoStart:!0,provides:o.tN,requires:[i.ISettingRegistry,s.ICommandPalette],optional:[a.IMainMenu],activate:(e,t,n,i)=>{const{commands:r,shell:a}=e,l=new p;let d;g.markdownItManager=l,t.load(S.id).then((e=>l.settings=e)).catch(console.warn),r.addCommand(o.TQ.showSettings,{label:"Markdown Extension Settings...",execute:e=>{if(null==d){const e=new k.Model;e.advancedRequested.connect((()=>r.execute("settingeditor:open"))),e.manager=l;const t=new k(e);d=new s.MainAreaWidget({content:t}),d.title.label="Markdown Extensions",d.title.icon=x,d.disposed.connect((()=>d=null))}a.add(d,"main"),a.activateById(d.id)}});let c=!0;return l.settingsChanged.connect((()=>{const{composite:e}=l.settings;null!=e&&(c=!!e.enabled)})),r.addCommand(o.TQ.toggleRenderer,{label:e=>"Use Markdown Extensions",caption:"Reopen documents to see changes",isToggled:()=>c,isEnabled:()=>null!=l.settings,execute:e=>{l.enabled=!!(null==(null==e?void 0:e.enabled)?!c:e.enabled)}}),n.addItem({command:o.TQ.showSettings,category:o.bv}),n.addItem({command:o.TQ.toggleRenderer,category:o.bv}),i&&i.settingsMenu.addGroup([{command:o.TQ.toggleRenderer},{command:o.TQ.showSettings}],100),l}},_=[S,...E]},8036:(e,t,n)=>{"use strict";n.d(t,{pm:()=>s,bv:()=>r,tN:()=>a,TQ:()=>o});var i=n(1797);const s="@agoose77/jupyterlab-markup",r="Markdown Extensions",a=new i.Token(s);var o;!function(e){e.showSettings="markdown-it:show-settings",e.toggleRenderer="markdown-it:toggle-renderer"}(o||(o={}))},1150:(e,t,n)=>{"use strict";n.d(t,{Z:()=>r});var i=n(3645),s=n.n(i)()((function(e){return e[1]}));s.push([e.id,"/* Handle overflow in settings editor */\n.jp-MarkdownItSettings {\n  overflow: auto;\n}\n",""]);const r=s},2760:(e,t,n)=>{"use strict";n.d(t,{Z:()=>o});var i=n(3645),s=n.n(i),r=n(1150),a=s()((function(e){return e[1]}));a.i(r.Z),a.push([e.id,"\n",""]);const o=a},3645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,i){"string"==typeof e&&(e=[[null,e,""]]);var s={};if(i)for(var r=0;r<this.length;r++){var a=this[r][0];null!=a&&(s[a]=!0)}for(var o=0;o<e.length;o++){var l=[].concat(e[o]);i&&s[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),t.push(l))}},t}},3379:(e,t,n)=>{"use strict";var i,s=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),r=[];function a(e){for(var t=-1,n=0;n<r.length;n++)if(r[n].identifier===e){t=n;break}return t}function o(e,t){for(var n={},i=[],s=0;s<e.length;s++){var o=e[s],l=t.base?o[0]+t.base:o[0],d=n[l]||0,c="".concat(l," ").concat(d);n[l]=d+1;var u=a(c),h={css:o[1],media:o[2],sourceMap:o[3]};-1!==u?(r[u].references++,r[u].updater(h)):r.push({identifier:c,updater:p(h,t),references:1}),i.push(c)}return i}function l(e){var t=document.createElement("style"),i=e.attributes||{};if(void 0===i.nonce){var r=n.nc;r&&(i.nonce=r)}if(Object.keys(i).forEach((function(e){t.setAttribute(e,i[e])})),"function"==typeof e.insert)e.insert(t);else{var a=s(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var d,c=(d=[],function(e,t){return d[e]=t,d.filter(Boolean).join("\n")});function u(e,t,n,i){var s=n?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(e.styleSheet)e.styleSheet.cssText=c(t,s);else{var r=document.createTextNode(s),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(r,a[t]):e.appendChild(r)}}function h(e,t,n){var i=n.css,s=n.media,r=n.sourceMap;if(s?e.setAttribute("media",s):e.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}var g=null,m=0;function p(e,t){var n,i,s;if(t.singleton){var r=m++;n=g||(g=l(t)),i=u.bind(null,n,r,!1),s=u.bind(null,n,r,!0)}else n=l(t),i=h.bind(null,n,t),s=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return i(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;i(e=t)}else s()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i));var n=o(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var i=0;i<n.length;i++){var s=a(n[i]);r[s].references--}for(var l=o(e,t),d=0;d<n.length;d++){var c=a(n[d]);0===r[c].references&&(r[c].updater(),r.splice(c,1))}n=l}}}}}]);