(self.webpackChunkjupyterlab_kernelspy=self.webpackChunkjupyterlab_kernelspy||[]).push([[126],{126:(e,t,n)=>{"use strict";n.r(t),n.d(t,{IKernelSpyExtension:()=>w,KernelSpyExtension:()=>O,default:()=>T});var o=n(633),r=n(321),s=n(170),a=n(628),l=n(850),i=n(797),d=n(129),c=n(562),h=n(271),p=n(93),u=n(706),m=n(418);class g{constructor(e,t){this._threads=e,this._collapsed=t,this._index=-1,this._child=null}iter(){return this}next(){if(this._child){const e=this._child.next();if(void 0!==e)return e;this._child=null}if(++this._index,this._index>=this._threads.length)return;const e=this._threads[this._index];return e.children.length>0&&!this._collapsed[e.args.msg.header.msg_id]&&(this._child=new g(e.children,this._collapsed)),{args:e.args,hasChildren:e.children.length>0}}clone(){const e=new g(this._threads,this._collapsed);return e._index=this._index,this._child&&(e._child=this._child.clone()),e}}class _ extends r.VDomModel{constructor(e){super(),this._log=[],this._kernel=null,this._messages={},this._childLUT={},this._roots=[],this.kernel=null!=e?e:null}clear(){this._log.splice(0,this._log.length),this._messages={},this._childLUT={},this._roots=[],this.stateChanged.emit(void 0)}get kernel(){return this._kernel}set kernel(e){this._kernel&&this._kernel.anyMessage.disconnect(this.onMessage,this),this._kernel=e,this._kernel&&this._kernel.anyMessage.connect(this.onMessage,this)}get log(){return this._log}get tree(){return this._roots.map((e=>this.getThread(e,!1)))}depth(e){if(null===e)return-1;let t=0;for(;e=this._findParent(e);)++t;return t}getThread(e,t=!0){const n=this._messages[e];if(t){let e,t=n;for(;e=this._findParent(t);)t=e;return this.getThread(t.msg.header.msg_id,!1)}const o=(this._childLUT[e]||[]).map((e=>this.getThread(e,!1)));return{args:this._messages[e],children:o}}onMessage(e,t){const{msg:n}=t;this._log.push(t),this._messages[n.header.msg_id]=t;const o=this._findParent(t);if(null===o)this._roots.push(n.header.msg_id);else{const e=o.msg.header;this._childLUT[e.msg_id]=this._childLUT[e.msg_id]||[],this._childLUT[e.msg_id].push(n.header.msg_id)}this.stateChanged.emit(void 0)}_findParent(e){return void 0!==e.msg.parent_header.msg_id&&this._messages[e.msg.parent_header.msg_id]||null}}var f=n(379),v=n.n(f),y=n(760);v()(y.Z,{insert:"head",singleton:!1}),y.Z.locals;const b={BASE_FONT_FAMILY:"var(--jp-code-font-family)",BASE_FONT_SIZE:"var(--jp-code-font-size)",BASE_LINE_HEIGHT:"var(--jp-code-line-height)",BASE_BACKGROUND_COLOR:"var(--jp-layout-color0)",BASE_COLOR:"var(--jp-content-font-color1)",OBJECT_NAME_COLOR:"var(--jp-mirror-editor-attribute-color)",OBJECT_VALUE_NULL_COLOR:"var(--jp-mirror-editor-builtin-color)",OBJECT_VALUE_UNDEFINED_COLOR:"var(--jp-mirror-editor-builtin-color)",OBJECT_VALUE_REGEXP_COLOR:"var(--jp-mirror-editor-string-color)",OBJECT_VALUE_STRING_COLOR:"var(--jp-mirror-editor-string-color)",OBJECT_VALUE_SYMBOL_COLOR:"var(--jp-mirror-editor-operator-color)",OBJECT_VALUE_NUMBER_COLOR:"var(--jp-mirror-editor-number-color)",OBJECT_VALUE_BOOLEAN_COLOR:"var(--jp-mirror-editor-builtin-color))",OBJECT_VALUE_FUNCTION_KEYWORD_COLOR:"var(--jp-mirror-editor-def-color))",ARROW_COLOR:"var(--jp-content-font-color2)",ARROW_MARGIN_RIGHT:3,ARROW_FONT_SIZE:12,TREENODE_FONT_FAMILY:"var(--jp-code-font-family)",TREENODE_FONT_SIZE:"var(--jp-code-font-size)",TREENODE_LINE_HEIGHT:"var(--jp-code-line-height)",TREENODE_PADDING_LEFT:12};function k(e){const{name:t,depth:n,isNonenumerable:o,data:r}=e;if(0!==n)return h.createElement(m.ObjectLabel,{key:"node-label",name:t,data:r,isNonenumerable:o});const s=r;return h.createElement("span",{key:"node-label"},s.header.msg_id)}class j extends r.VDomRenderer{constructor(e){super(e),this.collapsed={},this.id=`kernelspy-messagelog-${i.UUID.uuid4()}`,this.addClass("jp-kernelspy-messagelog")}render(){const e=this.model,t=[];t.push(h.createElement("span",{key:"header-thread",className:"jp-kernelspy-logheader"},"Threads"),h.createElement("span",{key:"header-contents",className:"jp-kernelspy-logheader"},"Contents"),h.createElement("span",{key:"header-divider",className:"jp-kernelspy-logheader jp-kernelspy-divider"}));const n=new g(e.tree,this.collapsed);let o=!0;return(0,l.each)(n,(({args:n,hasChildren:r})=>{const s=e.depth(n);0===s&&(o?o=!1:t.push(h.createElement("span",{key:`'divider-${n.msg.header.msg_id}`,className:"jp-kernelspy-divider"})));const a=this.collapsed[n.msg.header.msg_id];t.push(...function(e){const t=e.message,n=t.header.msg_id,o=e.collapsed?"jp-mod-collapsed":"",r=e.hasChildren?e.collapsed?p.caretRightIcon:p.caretDownIcon:null,s=e.hasChildren?"jp-mod-children":"",a=e.hasChildren?0:-1;return[h.createElement("div",{key:`threadnode-${n}`,className:"jp-kernelspy-threadnode",onClick:()=>{e.onCollapse(e.message)}},h.createElement("div",{style:{paddingLeft:16*e.depth}},h.createElement("button",{className:`jp-kernelspy-threadcollapser ${o} ${s}`,tabIndex:a},r&&h.createElement(r.react,{className:"kspy-collapser-icon"})),h.createElement("span",{className:"jp-kernelspy-threadlabel"},t.channel,".",t.header.msg_type))),h.createElement("div",{key:`message-${n}`,className:"jp-kernelspy-message"},h.createElement(m.ObjectInspector,{data:t,theme:b,nodeRenderer:k}))]}({message:n.msg,depth:s,collapsed:a,hasChildren:r,onCollapse:e=>{this.onCollapse(e)}}))})),t}collapseAll(){for(const e of this.model.log)this.collapsed[e.msg.header.msg_id]=!0;this.update()}expandAll(){this.collapsed={},this.update()}onCollapse(e){const t=e.header.msg_id;this.collapsed[t]=!this.collapsed[t],this.update()}}class C extends u.Widget{constructor(e){super(),this._model=new _(e),this.addClass("jp-kernelspy-view"),this.id=`kernelspy-${i.UUID.uuid4()}`,this.title.label="Kernel spy",this.title.closable=!0,this.title.iconRenderer=p.jsonIcon;const t=this.layout=new u.BoxLayout;this._toolbar=new r.Toolbar,this._toolbar.addClass("jp-kernelspy-toolbar"),this._messagelog=new j(this._model),t.addWidget(this._toolbar),t.addWidget(this._messagelog),u.BoxLayout.setStretch(this._toolbar,0),u.BoxLayout.setStretch(this._messagelog,1),this.collapseAllButton=new r.ToolbarButton({onClick:()=>{this._messagelog.collapseAll()},className:"jp-kernelspy-collapseAll",icon:p.caretRightIcon,tooltip:"Collapse all threads"}),this._toolbar.addItem("collapse-all",this.collapseAllButton),this.expandAllButton=new r.ToolbarButton({onClick:()=>{this._messagelog.expandAll()},className:"jp-kernelspy-expandAll",icon:p.caretDownIcon,tooltip:"Expand all threads"}),this._toolbar.addItem("expand-all",this.expandAllButton),this.clearAllButton=new r.ToolbarButton({onClick:()=>{this._model.clear()},className:"jp-kernelspy-clearAll",icon:p.closeIcon,tooltip:"Clear all threads"}),this._toolbar.addItem("clear-all",this.clearAllButton)}onActivateRequest(e){this.node.contains(document.activeElement)||this.collapseAllButton.node.focus()}get model(){return this._model}}var E;!function(e){e.newSpy="kernelspy:new"}(E||(E={}));const w=new i.Token("jupyter.extensions.kernelspy"),x=new c.AttachedProperty({create:()=>"",name:"SpyTarget"});class O{constructor(e){this.commands=e}createNew(e,t){const n=[];let o=-1;(0,l.find)(e.toolbar.children(),((e,t)=>!!e.hasClass("jp-Notebook-toolbarCellType")&&(o=t,!0)));let s=1;for(const t of[E.newSpy]){const a=new r.CommandToolbarButton({id:t,commands:this.commands});a.addClass("jp-kernelspy-nbtoolbarbutton"),o>=0?e.toolbar.insertItem(o+s++,this.commands.label(t),a):e.toolbar.addItem(this.commands.label(t),a),n.push(a)}return new d.DisposableDelegate((()=>{for(const e of n)e.dispose()}))}}const T={id:"jupyterlab-kernelspy",autoStart:!0,requires:[a.INotebookTracker],optional:[r.ICommandPalette,s.IMainMenu,o.ILayoutRestorer],provides:w,activate:async(e,t,n,o,s)=>{const{commands:a,docRegistry:l}=e,i=new O(a);l.addWidgetExtension("Notebook",i);const d=new r.WidgetTracker({namespace:"kernelspy"});function c(){a.notifyCommandChanged(E.newSpy)}s&&s.restore(d,{command:E.newSpy,args:e=>({path:x.get(e.content),activate:!1}),name:e=>x.get(e.content),when:t.restored}),function(e,t,n,o,s){const{commands:a,shell:l}=e;a.addCommand(E.newSpy,{label:"New kernel spy",caption:"Open a window to inspect messages sent to/from a kernel",iconClass:"jp-Icon jp-Icon-16 jp-kernelspyIcon",isEnabled:function(){var e,n,o;return null!==t.currentWidget&&null!==(null!==(o=null===(n=null===(e=t.currentWidget.context.sessionContext)||void 0===e?void 0:e.session)||void 0===n?void 0:n.kernel)&&void 0!==o?o:null)},execute:e=>{var o,s,a;let i;if(i=e.path?null!==(o=t.find((t=>t.context.path===e.path)))&&void 0!==o?o:null:t.currentWidget,!i)return;const d=new C(null===(a=null===(s=i.context.sessionContext)||void 0===s?void 0:s.session)||void 0===a?void 0:a.kernel);d.title.label=`Kernel spy: ${i.title.label}`,i.title.changed.connect((()=>{d.title.label=`Kernel spy: ${i.title.label}`}));const c=new r.MainAreaWidget({content:d});x.set(d,i.context.path),i.context.pathChanged.connect(((e,t)=>{x.set(d,t),n.save(c)})),n.add(c),i.context.sessionContext.kernelChanged.connect(((e,t)=>{d.model.kernel=t.newValue})),l.add(c,"main",{mode:"split-right"}),!1!==e.activate&&l.activateById(c.id),i.disposed.connect((()=>{c.close()}))}}),null==o||o.addItem({command:E.newSpy,category:"Kernel"}),null==s||s.kernelMenu.addGroup([{command:E.newSpy}])}(e,t,d,n,o),t.currentChanged.connect(c);let h=t.currentWidget;return h&&h.context.sessionContext.kernelChanged.connect(c),t.currentChanged.connect((e=>{h&&h.context.sessionContext.kernelChanged.disconnect(c),h=e.currentWidget,h&&h.context.sessionContext.kernelChanged.connect(c)})),i}}},150:(e,t,n)=>{"use strict";n.d(t,{Z:()=>s});var o=n(645),r=n.n(o)()((function(e){return e[1]}));r.push([e.id,".jp-kernelspy-view .jp-kernelspy-toolbar {\n  border-bottom: var(--jp-border-width) solid var(--jp-toolbar-border-color);\n  padding: 2px;\n  min-height: var(--jp-private-notebook-panel-toolbar-height);\n  box-shadow: var(--jp-toolbar-box-shadow);\n  background: var(--jp-toolbar-background);\n  z-index: 1;\n}\n\n.jp-kernelspy-view .jp-kernelspy-messagelog {\n  padding: 8px;\n  overflow: auto;\n  white-space: nowrap;\n  font-family: var(--jp-code-font-family);\n  font-size: var(--jp-code-font-size);\n  line-height: var(--jp-code-line-height);\n  color: var(--jp-content-font-color1);\n  background-color: var(--jp-layout-color0);\n  display: grid;\n  grid-template-columns: max-content auto;\n  grid-column-gap: 12px;\n  grid-row-gap: 2px;\n  align-content: start;\n}\n\n.jp-kernelspy-view .jp-kernelspy-logheader {\n  font-family: var(--jp-ui-font-family);\n  font-size: var(--jp-ui-font-size1);\n  line-height: 1;\n}\n\n.jp-kernelspy-view .jp-kernelspy-divider {\n  grid-column-end: span 2;\n  border-bottom: var(--jp-border-width) solid var(--jp-border-color2);\n  padding-top: 2px;\n  margin-bottom: 3px;\n}\n\n.jp-kernelspy-view .jp-kernelspy-divider.jp-kernelspy-logheader {\n  border-bottom: var(--jp-border-width) solid var(--jp-border-color0);\n}\n\nbutton.jp-kernelspy-threadcollapser {\n  background-color: transparent;\n  border: none;\n}\n\n.jp-kernelspyIcon {\n  background-image: var(--jp-icon-json);\n}\n\n.jp-kernelspy-nbtoolbarbutton .jp-ToolbarButtonComponent-label {\n  display: none;\n}\n\n.kspy-collapser-icon {\n  padding: 0;\n}\n\n.kspy-collapser-icon svg {\n  vertical-align: middle;\n}\n",""]);const s=r},760:(e,t,n)=>{"use strict";n.d(t,{Z:()=>l});var o=n(645),r=n.n(o),s=n(150),a=r()((function(e){return e[1]}));a.i(s.Z),a.push([e.id,"\n",""]);const l=a},645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,o){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(o)for(var s=0;s<this.length;s++){var a=this[s][0];null!=a&&(r[a]=!0)}for(var l=0;l<e.length;l++){var i=[].concat(e[l]);o&&r[i[0]]||(n&&(i[2]?i[2]="".concat(n," and ").concat(i[2]):i[2]=n),t.push(i))}},t}},379:(e,t,n)=>{"use strict";var o,r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),s=[];function a(e){for(var t=-1,n=0;n<s.length;n++)if(s[n].identifier===e){t=n;break}return t}function l(e,t){for(var n={},o=[],r=0;r<e.length;r++){var l=e[r],i=t.base?l[0]+t.base:l[0],d=n[i]||0,c="".concat(i," ").concat(d);n[i]=d+1;var h=a(c),p={css:l[1],media:l[2],sourceMap:l[3]};-1!==h?(s[h].references++,s[h].updater(p)):s.push({identifier:c,updater:g(p,t),references:1}),o.push(c)}return o}function i(e){var t=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var s=n.nc;s&&(o.nonce=s)}if(Object.keys(o).forEach((function(e){t.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(t);else{var a=r(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var d,c=(d=[],function(e,t){return d[e]=t,d.filter(Boolean).join("\n")});function h(e,t,n,o){var r=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=c(t,r);else{var s=document.createTextNode(r),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(s,a[t]):e.appendChild(s)}}function p(e,t,n){var o=n.css,r=n.media,s=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),s&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var u=null,m=0;function g(e,t){var n,o,r;if(t.singleton){var s=m++;n=u||(u=i(t)),o=h.bind(null,n,s,!1),r=h.bind(null,n,s,!0)}else n=i(t),o=p.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var n=l(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<n.length;o++){var r=a(n[o]);s[r].references--}for(var i=l(e,t),d=0;d<n.length;d++){var c=a(n[d]);0===s[c].references&&(s[c].updater(),s.splice(c,1))}n=i}}}}}]);