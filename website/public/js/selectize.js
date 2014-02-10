(function(e,t){if(typeof define==="function"&&define.amd){define("sifter",t)}else if(typeof exports==="object"){module.exports=t()}else{e.Sifter=t()}})(this,function(){var e=function(e,t){this.items=e;this.settings=t||{diacritics:true}};e.prototype.tokenize=function(e){e=r(String(e||"").toLowerCase());if(!e||!e.length)return[];var t,n,s,u;var a=[];var f=e.split(/ +/);for(t=0,n=f.length;t<n;t++){s=i(f[t]);if(this.settings.diacritics){for(u in o){if(o.hasOwnProperty(u)){s=s.replace(new RegExp(u,"g"),o[u])}}}a.push({string:f[t],regex:new RegExp(s,"i")})}return a};e.prototype.iterator=function(e,t){var n;if(s(e)){n=Array.prototype.forEach||function(e){for(var t=0,n=this.length;t<n;t++){e(this[t],t,this)}}}else{n=function(e){for(var t in this){if(this.hasOwnProperty(t)){e(this[t],t,this)}}}}n.apply(e,[t])};e.prototype.getScoreFunction=function(e,t){var n,r,i,s;n=this;e=n.prepareSearch(e,t);i=e.tokens;r=e.options.fields;s=i.length;var o=function(e,t){var n,r;if(!e)return 0;e=String(e||"");r=e.search(t.regex);if(r===-1)return 0;n=t.string.length/e.length;if(r===0)n+=.5;return n};var u=function(){var e=r.length;if(!e){return function(){return 0}}if(e===1){return function(e,t){return o(t[r[0]],e)}}return function(t,n){for(var i=0,s=0;i<e;i++){s+=o(n[r[i]],t)}return s/e}}();if(!s){return function(){return 0}}if(s===1){return function(e){return u(i[0],e)}}if(e.options.conjunction==="and"){return function(e){var t;for(var n=0,r=0;n<s;n++){t=u(i[n],e);if(t<=0)return 0;r+=t}return r/s}}else{return function(e){for(var t=0,n=0;t<s;t++){n+=u(i[t],e)}return n/s}}};e.prototype.getSortFunction=function(e,n){var r,i,s,o,u,a,f,l,c,h,p;s=this;e=s.prepareSearch(e,n);p=!e.query&&n.sort_empty||n.sort;c=function(e,t){if(e==="$score")return t.score;return s.items[t.id][e]};u=[];if(p){for(r=0,i=p.length;r<i;r++){if(e.query||p[r].field!=="$score"){u.push(p[r])}}}if(e.query){h=true;for(r=0,i=u.length;r<i;r++){if(u[r].field==="$score"){h=false;break}}if(h){u.unshift({field:"$score",direction:"desc"})}}else{for(r=0,i=u.length;r<i;r++){if(u[r].field==="$score"){u.splice(r,1);break}}}l=[];for(r=0,i=u.length;r<i;r++){l.push(u[r].direction==="desc"?-1:1)}a=u.length;if(!a){return null}else if(a===1){o=u[0].field;f=l[0];return function(e,n){return f*t(c(o,e),c(o,n))}}else{return function(e,n){var r,i,s,o,f;for(r=0;r<a;r++){f=u[r].field;i=l[r]*t(c(f,e),c(f,n));if(i)return i}return 0}}};e.prototype.prepareSearch=function(e,t){if(typeof e==="object")return e;t=n({},t);var r=t.fields;var i=t.sort;var o=t.sort_empty;if(r&&!s(r))t.fields=[r];if(i&&!s(i))t.sort=[i];if(o&&!s(o))t.sort_empty=[o];return{options:t,query:String(e||"").toLowerCase(),tokens:this.tokenize(e),total:0,items:[]}};e.prototype.search=function(e,t){var n=this,r,i,s,o;var u;var a;s=this.prepareSearch(e,t);t=s.options;e=s.query;a=t.score||n.getScoreFunction(s);if(e.length){n.iterator(n.items,function(e,n){i=a(e);if(t.filter===false||i>0){s.items.push({score:i,id:n})}})}else{n.iterator(n.items,function(e,t){s.items.push({score:1,id:t})})}u=n.getSortFunction(s,t);if(u)s.items.sort(u);s.total=s.items.length;if(typeof t.limit==="number"){s.items=s.items.slice(0,t.limit)}return s};var t=function(e,t){if(typeof e==="number"&&typeof t==="number"){return e>t?1:e<t?-1:0}e=String(e||"").toLowerCase();t=String(t||"").toLowerCase();if(e>t)return 1;if(t>e)return-1;return 0};var n=function(e,t){var n,r,i,s;for(n=1,r=arguments.length;n<r;n++){s=arguments[n];if(!s)continue;for(i in s){if(s.hasOwnProperty(i)){e[i]=s[i]}}}return e};var r=function(e){return(e+"").replace(/^\s+|\s+$|/g,"")};var i=function(e){return(e+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")};var s=Array.isArray||$&&$.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"};var o={a:"[aÀÁÂÃÄÅàáâãäå]",c:"[cÇçćĆčČ]",d:"[dđĐ]",e:"[eÈÉÊËèéêë]",i:"[iÌÍÎÏìíîï]",n:"[nÑñ]",o:"[oÒÓÔÕÕÖØòóôõöø]",s:"[sŠš]",u:"[uÙÚÛÜùúûü]",y:"[yŸÿý]",z:"[zŽž]"};return e});(function(e,t){if(typeof define==="function"&&define.amd){define("microplugin",t)}else if(typeof exports==="object"){module.exports=t()}else{e.MicroPlugin=t()}})(this,function(){var e={};e.mixin=function(e){e.plugins={};e.prototype.initializePlugins=function(e){var n,r,i;var s=this;var o=[];s.plugins={names:[],settings:{},requested:{},loaded:{}};if(t.isArray(e)){for(n=0,r=e.length;n<r;n++){if(typeof e[n]==="string"){o.push(e[n])}else{s.plugins.settings[e[n].name]=e[n].options;o.push(e[n].name)}}}else if(e){for(i in e){if(e.hasOwnProperty(i)){s.plugins.settings[i]=e[i];o.push(i)}}}while(o.length){s.require(o.shift())}};e.prototype.loadPlugin=function(t){var n=this;var r=n.plugins;var i=e.plugins[t];if(!e.plugins.hasOwnProperty(t)){throw new Error('Unable to find "'+t+'" plugin')}r.requested[t]=true;r.loaded[t]=i.fn.apply(n,[n.plugins.settings[t]||{}]);r.names.push(t)};e.prototype.require=function(e){var t=this;var n=t.plugins;if(!t.plugins.loaded.hasOwnProperty(e)){if(n.requested[e]){throw new Error('Plugin has circular dependency ("'+e+'")')}t.loadPlugin(e)}return n.loaded[e]};e.define=function(t,n){e.plugins[t]={name:t,fn:n}}};var t={isArray:Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"}};return e});(function(e,t){if(typeof define==="function"&&define.amd){define("selectize",["jquery","sifter","microplugin"],t)}else{e.Selectize=t(e.jQuery,e.Sifter,e.MicroPlugin)}})(this,function(e,t,n){"use strict";var r=function(e,t){if(typeof t==="string"&&!t.length)return;var n=typeof t==="string"?new RegExp(t,"i"):t;var r=function(e){var t=0;if(e.nodeType===3){var i=e.data.search(n);if(i>=0&&e.data.length>0){var s=e.data.match(n);var o=document.createElement("span");o.className="highlight";var u=e.splitText(i);var a=u.splitText(s[0].length);var f=u.cloneNode(true);o.appendChild(f);u.parentNode.replaceChild(o,u);t=1}}else if(e.nodeType===1&&e.childNodes&&!/(script|style)/i.test(e.tagName)){for(var l=0;l<e.childNodes.length;++l){l+=r(e.childNodes[l])}}return t};return e.each(function(){r(this)})};var i=function(){};i.prototype={on:function(e,t){this._events=this._events||{};this._events[e]=this._events[e]||[];this._events[e].push(t)},off:function(e,t){var n=arguments.length;if(n===0)return delete this._events;if(n===1)return delete this._events[e];this._events=this._events||{};if(e in this._events===false)return;this._events[e].splice(this._events[e].indexOf(t),1)},trigger:function(e){this._events=this._events||{};if(e in this._events===false)return;for(var t=0;t<this._events[e].length;t++){this._events[e][t].apply(this,Array.prototype.slice.call(arguments,1))}}};i.mixin=function(e){var t=["on","off","trigger"];for(var n=0;n<t.length;n++){e.prototype[t[n]]=i.prototype[t[n]]}};var s=/Mac/.test(navigator.userAgent);var o=65;var u=188;var a=13;var f=27;var l=37;var c=38;var h=39;var p=40;var d=8;var v=46;var m=16;var g=s?91:17;var y=s?18:17;var b=9;var w=1;var E=2;var S=function(e){return typeof e!=="undefined"};var x=function(e){if(typeof e==="undefined"||e===null)return"";if(typeof e==="boolean")return e?"1":"0";return e+""};var T=function(e){return(e+"").replace(/&/g,"&").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};var N=function(e){return(e+"").replace(/\$/g,"$$$$")};var C={};C.before=function(e,t,n){var r=e[t];e[t]=function(){n.apply(e,arguments);return r.apply(e,arguments)}};C.after=function(e,t,n){var r=e[t];e[t]=function(){var t=r.apply(e,arguments);n.apply(e,arguments);return t}};var k=function(t,n){if(!e.isArray(n))return n;var r,i,s={};for(r=0,i=n.length;r<i;r++){if(n[r].hasOwnProperty(t)){s[n[r][t]]=n[r]}}return s};var L=function(e){var t=false;return function(){if(t)return;t=true;e.apply(this,arguments)}};var A=function(e,t){var n;return function(){var r=this;var i=arguments;window.clearTimeout(n);n=window.setTimeout(function(){e.apply(r,i)},t)}};var O=function(e,t,n){var r;var i=e.trigger;var s={};e.trigger=function(){var n=arguments[0];if(t.indexOf(n)!==-1){s[n]=arguments}else{return i.apply(e,arguments)}};n.apply(e,[]);e.trigger=i;for(r in s){if(s.hasOwnProperty(r)){i.apply(e,s[r])}}};var M=function(e,t,n,r){e.on(t,n,function(t){var n=t.target;while(n&&n.parentNode!==e[0]){n=n.parentNode}t.currentTarget=n;return r.apply(this,[t])})};var _=function(e){var t={};if("selectionStart"in e){t.start=e.selectionStart;t.length=e.selectionEnd-t.start}else if(document.selection){e.focus();var n=document.selection.createRange();var r=document.selection.createRange().text.length;n.moveStart("character",-e.value.length);t.start=n.text.length-r;t.length=r}return t};var D=function(e,t,n){var r,i,s={};if(n){for(r=0,i=n.length;r<i;r++){s[n[r]]=e.css(n[r])}}else{s=e.css()}t.css(s)};var P=function(t,n){var r=e("<test>").css({position:"absolute",top:-99999,left:-99999,width:"auto",padding:0,whiteSpace:"pre"}).text(t).appendTo("body");D(n,r,["letterSpacing","fontSize","fontFamily","fontWeight","textTransform"]);var i=r.width();r.remove();return i};var H=function(e){var t=function(t){var n,r,i,s,o;var u,a,f;t=t||window.event||{};if(t.metaKey||t.altKey)return;if(e.data("grow")===false)return;n=e.val();if(t.type&&t.type.toLowerCase()==="keydown"){r=t.keyCode;i=r>=97&&r<=122||r>=65&&r<=90||r>=48&&r<=57||r===32;if(r===v||r===d){f=_(e[0]);if(f.length){n=n.substring(0,f.start)+n.substring(f.start+f.length)}else if(r===d&&f.start){n=n.substring(0,f.start-1)+n.substring(f.start+1)}else if(r===v&&typeof f.start!=="undefined"){n=n.substring(0,f.start)+n.substring(f.start+1)}}else if(i){u=t.shiftKey;a=String.fromCharCode(t.keyCode);if(u)a=a.toUpperCase();else a=a.toLowerCase();n+=a}}s=e.attr("placeholder")||"";if(!n.length&&s.length){n=s}o=P(n,e)+4;if(o!==e.width()){e.width(o);e.triggerHandler("resize")}};e.on("keydown keyup update blur",t);t()};var B=function(n,r){var i,s,o,u,a,f=this;a=n[0];a.selectize=f;u=window.getComputedStyle?window.getComputedStyle(a,null).getPropertyValue("direction"):a.currentStyle&&a.currentStyle.direction;u=u||n.parents("[dir]:first").attr("dir")||"";e.extend(f,{settings:r,$input:n,tagType:a.tagName.toLowerCase()==="select"?w:E,rtl:/rtl/i.test(u),eventNS:".selectize"+ ++B.count,highlightedValue:null,isOpen:false,isDisabled:false,isRequired:n.is("[required]"),isInvalid:false,isLocked:false,isFocused:false,isInputHidden:false,isSetup:false,isShiftDown:false,isCmdDown:false,isCtrlDown:false,ignoreFocus:false,ignoreHover:false,hasOptions:false,currentResults:null,lastValue:"",caretPos:0,loading:0,loadedSearches:{},$activeOption:null,$activeItems:[],optgroups:{},options:{},userOptions:{},items:[],renderCache:{},onSearchChange:A(f.onSearchChange,r.loadThrottle)});f.sifter=new t(this.options,{diacritics:r.diacritics});e.extend(f.options,k(r.valueField,r.options));delete f.settings.options;e.extend(f.optgroups,k(r.optgroupValueField,r.optgroups));delete f.settings.optgroups;f.settings.mode=f.settings.mode||(f.settings.maxItems===1?"single":"multi");if(typeof f.settings.hideSelected!=="boolean"){f.settings.hideSelected=f.settings.mode==="multi"}f.initializePlugins(f.settings.plugins);f.setupCallbacks();f.setupTemplates();f.setup()};i.mixin(B);n.mixin(B);e.extend(B.prototype,{setup:function(){var t=this;var n=t.settings;var r=t.eventNS;var i=e(window);var o=e(document);var u;var a;var f;var l;var c;var h;var p;var d;var v;var b;var E;var S;p=t.settings.mode;b=t.$input.attr("tabindex")||"";E=t.$input.attr("class")||"";u=e("<div>").addClass(n.wrapperClass).addClass(E).addClass(p);a=e("<div>").addClass(n.inputClass).addClass("items").appendTo(u);f=e('<input type="text" autocomplete="off">').appendTo(a).attr("tabindex",b);h=e(n.dropdownParent||u);l=e("<div>").addClass(n.dropdownClass).addClass(E).addClass(p).hide().appendTo(h);c=e("<div>").addClass(n.dropdownContentClass).appendTo(l);u.css({width:t.$input[0].style.width});if(t.plugins.names.length){S="plugin-"+t.plugins.names.join(" plugin-");u.addClass(S);l.addClass(S)}if((n.maxItems===null||n.maxItems>1)&&t.tagType===w){t.$input.attr("multiple","multiple")}if(t.settings.placeholder){f.attr("placeholder",n.placeholder)}t.$wrapper=u;t.$control=a;t.$control_input=f;t.$dropdown=l;t.$dropdown_content=c;l.on("mouseenter","[data-selectable]",function(){return t.onOptionHover.apply(t,arguments)});l.on("mousedown","[data-selectable]",function(){return t.onOptionSelect.apply(t,arguments)});M(a,"mousedown","*:not(input)",function(){return t.onItemSelect.apply(t,arguments)});H(f);a.on({mousedown:function(){return t.onMouseDown.apply(t,arguments)},click:function(){return t.onClick.apply(t,arguments)}});f.on({mousedown:function(e){e.stopPropagation()},keydown:function(){return t.onKeyDown.apply(t,arguments)},keyup:function(){return t.onKeyUp.apply(t,arguments)},keypress:function(){return t.onKeyPress.apply(t,arguments)},resize:function(){t.positionDropdown.apply(t,[])},blur:function(){return t.onBlur.apply(t,arguments)},focus:function(){return t.onFocus.apply(t,arguments)}});o.on("keydown"+r,function(e){t.isCmdDown=e[s?"metaKey":"ctrlKey"];t.isCtrlDown=e[s?"altKey":"ctrlKey"];t.isShiftDown=e.shiftKey});o.on("keyup"+r,function(e){if(e.keyCode===y)t.isCtrlDown=false;if(e.keyCode===m)t.isShiftDown=false;if(e.keyCode===g)t.isCmdDown=false});o.on("mousedown"+r,function(e){if(t.isFocused){if(e.target===t.$dropdown[0]||e.target.parentNode===t.$dropdown[0]){return false}if(!t.$control.has(e.target).length&&e.target!==t.$control[0]){t.blur()}}});i.on(["scroll"+r,"resize"+r].join(" "),function(){if(t.isOpen){t.positionDropdown.apply(t,arguments)}});i.on("mousemove"+r,function(){t.ignoreHover=false});this.revertSettings={$children:t.$input.children().detach(),tabindex:t.$input.attr("tabindex")};t.$input.attr("tabindex",-1).hide().after(t.$wrapper);if(e.isArray(n.items)){t.setValue(n.items);delete n.items}if(t.$input[0].validity){t.$input.on("invalid"+r,function(e){e.preventDefault();t.isInvalid=true;t.refreshState()})}t.updateOriginalInput();t.refreshItems();t.refreshState();t.updatePlaceholder();t.isSetup=true;if(t.$input.is(":disabled")){t.disable()}t.on("change",this.onChange);t.trigger("initialize");if(n.preload){t.onSearchChange("")}},setupTemplates:function(){var t=this;var n=t.settings.labelField;var r=t.settings.optgroupLabelField;var i={optgroup:function(e){return'<div class="optgroup">'+e.html+"</div>"},optgroup_header:function(e,t){return'<div class="optgroup-header">'+t(e[r])+"</div>"},option:function(e,t){return'<div class="option">'+t(e[n])+"</div>"},item:function(e,t){return'<div class="item">'+t(e[n])+"</div>"},option_create:function(e,t){return'<div class="create">Ajouter <strong>'+t(e.input)+"</strong>&hellip;</div>"}};t.settings.render=e.extend({},i,t.settings.render)},setupCallbacks:function(){var e,t,n={initialize:"onInitialize",change:"onChange",item_add:"onItemAdd",item_remove:"onItemRemove",clear:"onClear",option_add:"onOptionAdd",option_remove:"onOptionRemove",option_clear:"onOptionClear",dropdown_open:"onDropdownOpen",dropdown_close:"onDropdownClose",type:"onType"};for(e in n){if(n.hasOwnProperty(e)){t=this.settings[n[e]];if(t)this.on(e,t)}}},onClick:function(e){var t=this;if(!t.isFocused){t.focus();e.preventDefault()}},onMouseDown:function(t){var n=this;var r=t.isDefaultPrevented();var i=e(t.target);if(n.isFocused){if(t.target!==n.$control_input[0]){if(n.settings.mode==="single"){n.isOpen?n.close():n.open()}else if(!r){n.setActiveItem(null)}return false}}else{if(!r){window.setTimeout(function(){n.focus()},0)}}},onChange:function(){this.$input.trigger("change")},onKeyPress:function(e){if(this.isLocked)return e&&e.preventDefault();var t=String.fromCharCode(e.keyCode||e.which);if(this.settings.create&&t===this.settings.delimiter){this.createItem();e.preventDefault();return false}},onKeyDown:function(e){var t=e.target===this.$control_input[0];var n=this;if(n.isLocked){if(e.keyCode!==b){e.preventDefault()}return}switch(e.keyCode){case o:if(n.isCmdDown){n.selectAll();return}break;case f:n.close();return;case p:if(!n.isOpen&&n.hasOptions){n.open()}else if(n.$activeOption){n.ignoreHover=true;var r=n.getAdjacentOption(n.$activeOption,1);if(r.length)n.setActiveOption(r,true,true)}e.preventDefault();return;case c:if(n.$activeOption){n.ignoreHover=true;var i=n.getAdjacentOption(n.$activeOption,-1);if(i.length)n.setActiveOption(i,true,true)}e.preventDefault();return;case a:if(n.isOpen&&n.$activeOption){n.onOptionSelect({currentTarget:n.$activeOption})}e.preventDefault();return;case l:n.advanceSelection(-1,e);return;case h:n.advanceSelection(1,e);return;case b:if(n.settings.create&&n.createItem()){e.preventDefault()}return;case d:case v:n.deleteSelection(e);return}if(n.isFull()||n.isInputHidden){e.preventDefault();return}},onKeyUp:function(e){var t=this;if(t.isLocked)return e&&e.preventDefault();var n=t.$control_input.val()||"";if(t.lastValue!==n){t.lastValue=n;t.onSearchChange(n);t.refreshOptions();t.trigger("type",n)}},onSearchChange:function(e){var t=this;var n=t.settings.load;if(!n)return;if(t.loadedSearches.hasOwnProperty(e))return;t.loadedSearches[e]=true;t.load(function(r){n.apply(t,[e,r])})},onFocus:function(e){var t=this;t.isFocused=true;if(t.isDisabled){t.blur();e&&e.preventDefault();return false}if(t.ignoreFocus)return;if(t.settings.preload==="focus")t.onSearchChange("");if(!t.$activeItems.length){t.showInput();t.setActiveItem(null);t.refreshOptions(!!t.settings.openOnFocus)}t.refreshState()},onBlur:function(e){var t=this;t.isFocused=false;if(t.ignoreFocus)return;if(t.settings.create&&t.settings.createOnBlur){t.createItem()}t.close();t.setTextboxValue("");t.setActiveItem(null);t.setActiveOption(null);t.setCaret(t.items.length);t.refreshState()},onOptionHover:function(e){if(this.ignoreHover)return;this.setActiveOption(e.currentTarget,false)},onOptionSelect:function(t){var n,r,i,s=this;if(t.preventDefault){t.preventDefault();t.stopPropagation()}r=e(t.currentTarget);if(r.hasClass("create")){s.createItem()}else{n=r.attr("data-value");if(n){s.lastQuery=null;s.setTextboxValue("");s.addItem(n);if(!s.settings.hideSelected&&t.type&&/mouse/.test(t.type)){s.setActiveOption(s.getOption(n))}}}},onItemSelect:function(e){var t=this;if(t.isLocked)return;if(t.settings.mode==="multi"){e.preventDefault();t.setActiveItem(e.currentTarget,e)}},load:function(e){var t=this;var n=t.$wrapper.addClass("loading");t.loading++;e.apply(t,[function(e){t.loading=Math.max(t.loading-1,0);if(e&&e.length){t.addOption(e);t.refreshOptions(t.isFocused&&!t.isInputHidden)}if(!t.loading){n.removeClass("loading")}t.trigger("load",e)}])},setTextboxValue:function(e){this.$control_input.val(e).triggerHandler("update");this.lastValue=e},getValue:function(){if(this.tagType===w&&this.$input.attr("multiple")){return this.items}else{return this.items.join(this.settings.delimiter)}},setValue:function(t){O(this,["change"],function(){this.clear();var n=e.isArray(t)?t:[t];for(var r=0,i=n.length;r<i;r++){this.addItem(n[r])}})},setActiveItem:function(t,n){var r=this;var i;var s,o,u,a,f,l;var c;if(r.settings.mode==="single")return;t=e(t);if(!t.length){e(r.$activeItems).removeClass("active");r.$activeItems=[];if(r.isFocused){r.showInput()}return}i=n&&n.type.toLowerCase();if(i==="mousedown"&&r.isShiftDown&&r.$activeItems.length){c=r.$control.children(".active:last");u=Array.prototype.indexOf.apply(r.$control[0].childNodes,[c[0]]);a=Array.prototype.indexOf.apply(r.$control[0].childNodes,[t[0]]);if(u>a){l=u;u=a;a=l}for(s=u;s<=a;s++){f=r.$control[0].childNodes[s];if(r.$activeItems.indexOf(f)===-1){e(f).addClass("active");r.$activeItems.push(f)}}n.preventDefault()}else if(i==="mousedown"&&r.isCtrlDown||i==="keydown"&&this.isShiftDown){if(t.hasClass("active")){o=r.$activeItems.indexOf(t[0]);r.$activeItems.splice(o,1);t.removeClass("active")}else{r.$activeItems.push(t.addClass("active")[0])}}else{e(r.$activeItems).removeClass("active");r.$activeItems=[t.addClass("active")[0]]}r.hideInput();if(!this.isFocused){r.focus()}},setActiveOption:function(t,n,r){var i,s,o;var u,a;var f=this;if(f.$activeOption)f.$activeOption.removeClass("active");f.$activeOption=null;t=e(t);if(!t.length)return;f.$activeOption=t.addClass("active");if(n||!S(n)){i=f.$dropdown_content.height();s=f.$activeOption.outerHeight(true);n=f.$dropdown_content.scrollTop()||0;o=f.$activeOption.offset().top-f.$dropdown_content.offset().top+n;u=o;a=o-i+s;if(o+s>i+n){f.$dropdown_content.stop().animate({scrollTop:a},r?f.settings.scrollDuration:0)}else if(o<n){f.$dropdown_content.stop().animate({scrollTop:u},r?f.settings.scrollDuration:0)}}},selectAll:function(){var e=this;if(e.settings.mode==="single")return;e.$activeItems=Array.prototype.slice.apply(e.$control.children(":not(input)").addClass("active"));if(e.$activeItems.length){e.hideInput();e.close()}e.focus()},hideInput:function(){var e=this;e.setTextboxValue("");e.$control_input.css({opacity:0,position:"absolute",left:e.rtl?1e4:-1e4});e.isInputHidden=true},showInput:function(){this.$control_input.css({opacity:1,position:"relative",left:0});this.isInputHidden=false},focus:function(){var e=this;if(e.isDisabled)return;e.ignoreFocus=true;e.$control_input[0].focus();window.setTimeout(function(){e.ignoreFocus=false;e.onFocus()},0)},blur:function(){this.$control_input.trigger("blur")},getScoreFunction:function(e){return this.sifter.getScoreFunction(e,this.getSearchOptions())},getSearchOptions:function(){var e=this.settings;var t=e.sortField;if(typeof t==="string"){t={field:t}}return{fields:e.searchField,conjunction:e.searchConjunction,sort:t}},search:function(t){var n,r,i,s,o;var u=this;var a=u.settings;var f=this.getSearchOptions();if(a.score){o=u.settings.score.apply(this,[t]);if(typeof o!=="function"){throw new Error('Selectize "score" setting must be a function that returns a function')}}if(t!==u.lastQuery){u.lastQuery=t;s=u.sifter.search(t,e.extend(f,{score:o}));u.currentResults=s}else{s=e.extend(true,{},u.currentResults)}if(a.hideSelected){for(n=s.items.length-1;n>=0;n--){if(u.items.indexOf(x(s.items[n].id))!==-1){s.items.splice(n,1)}}}return s},refreshOptions:function(t){var n,i,s,o,u,a,f,l,c,h,p,d,v;var m,g,y;if(typeof t==="undefined"){t=true}var b=this;var w=b.$control_input.val();var E=b.search(w);var S=b.$dropdown_content;var T=b.$activeOption&&x(b.$activeOption.attr("data-value"));o=E.items.length;if(typeof b.settings.maxOptions==="number"){o=Math.min(o,b.settings.maxOptions)}u={};if(b.settings.optgroupOrder){a=b.settings.optgroupOrder;for(n=0;n<a.length;n++){u[a[n]]=[]}}else{a=[]}for(n=0;n<o;n++){f=b.options[E.items[n].id];l=b.render("option",f);c=f[b.settings.optgroupField]||"";h=e.isArray(c)?c:[c];for(i=0,s=h&&h.length;i<s;i++){c=h[i];if(!b.optgroups.hasOwnProperty(c)){c=""}if(!u.hasOwnProperty(c)){u[c]=[];a.push(c)}u[c].push(l)}}p=[];for(n=0,o=a.length;n<o;n++){c=a[n];if(b.optgroups.hasOwnProperty(c)&&u[c].length){d=b.render("optgroup_header",b.optgroups[c])||"";d+=u[c].join("");p.push(b.render("optgroup",e.extend({},b.optgroups[c],{html:d})))}else{p.push(u[c].join(""))}}S.html(p.join(""));if(b.settings.highlight&&E.query.length&&E.tokens.length){for(n=0,o=E.tokens.length;n<o;n++){r(S,E.tokens[n].regex)}}if(!b.settings.hideSelected){for(n=0,o=b.items.length;n<o;n++){b.getOption(b.items[n]).addClass("selected")}}v=b.settings.create&&E.query.length;if(v){S.prepend(b.render("option_create",{input:w}));y=e(S[0].childNodes[0])}b.hasOptions=E.items.length>0||v;if(b.hasOptions){if(E.items.length>0){g=T&&b.getOption(T);if(g&&g.length){m=g}else if(b.settings.mode==="single"&&b.items.length){m=b.getOption(b.items[0])}if(!m||!m.length){if(y&&!b.settings.addPrecedence){m=b.getAdjacentOption(y,1)}else{m=S.find("[data-selectable]:first")}}}else{m=y}b.setActiveOption(m);if(t&&!b.isOpen){b.open()}}else{b.setActiveOption(null);if(t&&b.isOpen){b.close()}}},addOption:function(t){var n,r,i,s,o=this;if(e.isArray(t)){for(n=0,r=t.length;n<r;n++){o.addOption(t[n])}return}s=x(t[o.settings.valueField]);if(!s||o.options.hasOwnProperty(s))return;o.userOptions[s]=true;o.options[s]=t;o.lastQuery=null;o.trigger("option_add",s,t)},addOptionGroup:function(e,t){this.optgroups[e]=t;this.trigger("optgroup_add",e,t)},updateOption:function(t,n){var r=this;var i,s;var o,u,a,f;t=x(t);o=x(n[r.settings.valueField]);if(!r.options.hasOwnProperty(t))return;if(!o)throw new Error("Value must be set in option data");if(o!==t){delete r.options[t];u=r.items.indexOf(t);if(u!==-1){r.items.splice(u,1,o)}}r.options[o]=n;a=r.renderCache["item"];f=r.renderCache["option"];if(S(a)){delete a[t];delete a[o]}if(S(f)){delete f[t];delete f[o]}if(r.items.indexOf(o)!==-1){i=r.getItem(t);s=e(r.render("item",n));if(i.hasClass("active"))s.addClass("active");i.replaceWith(s)}if(r.isOpen){r.refreshOptions(false)}},removeOption:function(e){var t=this;e=x(e);delete t.userOptions[e];delete t.options[e];t.lastQuery=null;t.trigger("option_remove",e);t.removeItem(e)},clearOptions:function(){var e=this;e.loadedSearches={};e.userOptions={};e.options=e.sifter.items={};e.lastQuery=null;e.trigger("option_clear");e.clear()},getOption:function(e){return this.getElementWithValue(e,this.$dropdown_content.find("[data-selectable]"))},getAdjacentOption:function(t,n){var r=this.$dropdown.find("[data-selectable]");var i=r.index(t)+n;return i>=0&&i<r.length?r.eq(i):e()},getElementWithValue:function(t,n){t=x(t);if(t){for(var r=0,i=n.length;r<i;r++){if(n[r].getAttribute("data-value")===t){return e(n[r])}}}return e()},getItem:function(e){return this.getElementWithValue(e,this.$control.children())},addItem:function(t){O(this,["change"],function(){var n,r;var i=this;var s=i.settings.mode;var o,u,a,f;t=x(t);if(i.items.indexOf(t)!==-1){if(s==="single")i.close();return}if(!i.options.hasOwnProperty(t))return;if(s==="single")i.clear();if(s==="multi"&&i.isFull())return;n=e(i.render("item",i.options[t]));i.items.splice(i.caretPos,0,t);i.insertAtCaret(n);i.refreshState();if(i.isSetup){a=i.$dropdown_content.find("[data-selectable]");r=i.getOption(t);f=i.getAdjacentOption(r,1).attr("data-value");i.refreshOptions(i.isFocused&&s!=="single");if(f){i.setActiveOption(i.getOption(f))}if(!a.length||i.settings.maxItems!==null&&i.items.length>=i.settings.maxItems){i.close()}else{i.positionDropdown()}i.updatePlaceholder();i.trigger("item_add",t,n);i.updateOriginalInput()}})},removeItem:function(e){var t=this;var n,r,i;n=typeof e==="object"?e:t.getItem(e);e=x(n.attr("data-value"));r=t.items.indexOf(e);if(r!==-1){n.remove();if(n.hasClass("active")){i=t.$activeItems.indexOf(n[0]);t.$activeItems.splice(i,1)}t.items.splice(r,1);t.lastQuery=null;if(!t.settings.persist&&t.userOptions.hasOwnProperty(e)){t.removeOption(e)}if(r<t.caretPos){t.setCaret(t.caretPos-1)}t.refreshState();t.updatePlaceholder();t.updateOriginalInput();t.positionDropdown();t.trigger("item_remove",e)}},createItem:function(){var t=this;var n=e.trim(t.$control_input.val()||"");var r=t.caretPos;if(!n.length)return false;t.lock();var i=typeof t.settings.create==="function"?this.settings.create:function(e){var n={};n[t.settings.labelField]=e;n[t.settings.valueField]=e;return n};var s=L(function(e){t.unlock();if(!e||typeof e!=="object")return;var n=x(e[t.settings.valueField]);if(!n)return;t.setTextboxValue("");t.addOption(e);t.setCaret(r);t.addItem(n);t.refreshOptions(t.settings.mode!=="single")});var o=i.apply(this,[n,s]);if(typeof o!=="undefined"){s(o)}return true},refreshItems:function(){this.lastQuery=null;if(this.isSetup){for(var e=0;e<this.items.length;e++){this.addItem(this.items)}}this.refreshState();this.updateOriginalInput()},refreshState:function(){var e=this;var t=e.isRequired&&!e.items.length;if(!t)e.isInvalid=false;e.$control_input.prop("required",t);e.refreshClasses()},refreshClasses:function(){var t=this;var n=t.isFull();var r=t.isLocked;t.$wrapper.toggleClass("rtl",t.rtl);t.$control.toggleClass("focus",t.isFocused).toggleClass("disabled",t.isDisabled).toggleClass("required",t.isRequired).toggleClass("invalid",t.isInvalid).toggleClass("locked",r).toggleClass("full",n).toggleClass("not-full",!n).toggleClass("input-active",t.isFocused&&!t.isInputHidden).toggleClass("dropdown-active",t.isOpen).toggleClass("has-options",!e.isEmptyObject(t.options)).toggleClass("has-items",t.items.length>0);t.$control_input.data("grow",!n&&!r)},isFull:function(){return this.settings.maxItems!==null&&this.items.length>=this.settings.maxItems},updateOriginalInput:function(){var e,t,n,r=this;if(r.$input[0].tagName.toLowerCase()==="select"){n=[];for(e=0,t=r.items.length;e<t;e++){n.push('<option value="'+T(r.items[e])+'" selected="selected"></option>')}if(!n.length&&!this.$input.attr("multiple")){n.push('<option value="" selected="selected"></option>')}r.$input.html(n.join(""))}else{r.$input.val(r.getValue())}if(r.isSetup){r.trigger("change",r.$input.val())}},updatePlaceholder:function(){if(!this.settings.placeholder)return;var e=this.$control_input;if(this.items.length){e.removeAttr("placeholder")}else{e.attr("placeholder",this.settings.placeholder)}e.triggerHandler("update")},open:function(){var e=this;if(e.isLocked||e.isOpen||e.settings.mode==="multi"&&e.isFull())return;e.focus();e.isOpen=true;e.refreshState();e.$dropdown.css({visibility:"hidden",display:"block"});e.positionDropdown();e.$dropdown.css({visibility:"visible"});e.trigger("dropdown_open",e.$dropdown)},close:function(){var e=this;var t=e.isOpen;if(e.settings.mode==="single"&&e.items.length){e.hideInput()}e.isOpen=false;e.$dropdown.hide();e.setActiveOption(null);e.refreshState();if(t)e.trigger("dropdown_close",e.$dropdown)},positionDropdown:function(){var e=this.$control;var t=this.settings.dropdownParent==="body"?e.offset():e.position();t.top+=e.outerHeight(true);this.$dropdown.css({width:e.outerWidth(),top:t.top,left:t.left})},clear:function(){var e=this;if(!e.items.length)return;e.$control.children(":not(input)").remove();e.items=[];e.setCaret(0);e.updatePlaceholder();e.updateOriginalInput();e.refreshState();e.showInput();e.trigger("clear")},insertAtCaret:function(t){var n=Math.min(this.caretPos,this.items.length);if(n===0){this.$control.prepend(t)}else{e(this.$control[0].childNodes[n]).before(t)}this.setCaret(n+1)},deleteSelection:function(t){var n,r,i,s,o,u,a,f,l;var c=this;i=t&&t.keyCode===d?-1:1;s=_(c.$control_input[0]);if(c.$activeOption&&!c.settings.hideSelected){a=c.getAdjacentOption(c.$activeOption,-1).attr("data-value")}o=[];if(c.$activeItems.length){l=c.$control.children(".active:"+(i>0?"last":"first"));u=c.$control.children(":not(input)").index(l);if(i>0){u++}for(n=0,r=c.$activeItems.length;n<r;n++){o.push(e(c.$activeItems[n]).attr("data-value"))}if(t){t.preventDefault();t.stopPropagation()}}else if((c.isFocused||c.settings.mode==="single")&&c.items.length){if(i<0&&s.start===0&&s.length===0){o.push(c.items[c.caretPos-1])}else if(i>0&&s.start===c.$control_input.val().length){o.push(c.items[c.caretPos])}}if(!o.length||typeof c.settings.onDelete==="function"&&c.settings.onDelete.apply(c,[o])===false){return false}if(typeof u!=="undefined"){c.setCaret(u)}while(o.length){c.removeItem(o.pop())}c.showInput();c.positionDropdown();c.refreshOptions(true);if(a){f=c.getOption(a);if(f.length){c.setActiveOption(f)}}return true},advanceSelection:function(e,t){var n,r,i,s,o,u;var a=this;if(e===0)return;if(a.rtl)e*=-1;n=e>0?"last":"first";r=_(a.$control_input[0]);if(a.isFocused&&!a.isInputHidden){s=a.$control_input.val().length;o=e<0?r.start===0&&r.length===0:r.start===s;if(o&&!s){a.advanceCaret(e,t)}}else{u=a.$control.children(".active:"+n);if(u.length){i=a.$control.children(":not(input)").index(u);a.setActiveItem(null);a.setCaret(e>0?i+1:i)}}},advanceCaret:function(e,t){var n=this,r,i;if(e===0)return;r=e>0?"next":"prev";if(n.isShiftDown){i=n.$control_input[r]();if(i.length){n.hideInput();n.setActiveItem(i);t&&t.preventDefault()}}else{n.setCaret(n.caretPos+e)}},setCaret:function(t){var n=this;if(n.settings.mode==="single"){t=n.items.length}else{t=Math.max(0,Math.min(n.items.length,t))}var r,i,s,o,u;o=n.$control.children(":not(input)");for(r=0,i=o.length;r<i;r++){u=e(o[r]).detach();if(r<t){n.$control_input.before(u)}else{n.$control.append(u)}}n.caretPos=t},lock:function(){this.close();this.isLocked=true;this.refreshState()},unlock:function(){this.isLocked=false;this.refreshState()},disable:function(){var e=this;e.$input.prop("disabled",true);e.isDisabled=true;e.lock()},enable:function(){var e=this;e.$input.prop("disabled",false);e.isDisabled=false;e.unlock()},destroy:function(){var t=this;var n=t.eventNS;var r=t.revertSettings;t.trigger("destroy");t.off();t.$wrapper.remove();t.$dropdown.remove();t.$input.html("").append(r.$children).removeAttr("tabindex").attr({tabindex:r.tabindex}).show();e(window).off(n);e(document).off(n);e(document.body).off(n);delete t.$input[0].selectize},render:function(e,t){var n,r,i;var s="";var o=false;var u=this;var a=/^[\t ]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;if(e==="option"||e==="item"){n=x(t[u.settings.valueField]);o=!!n}if(o){if(!S(u.renderCache[e])){u.renderCache[e]={}}if(u.renderCache[e].hasOwnProperty(n)){return u.renderCache[e][n]}}s=u.settings.render[e].apply(this,[t,T]);if(e==="option"||e==="option_create"){s=s.replace(a,"<$1 data-selectable")}if(e==="optgroup"){r=t[u.settings.optgroupValueField]||"";s=s.replace(a,'<$1 data-group="'+N(T(r))+'"')}if(e==="option"||e==="item"){s=s.replace(a,'<$1 data-value="'+N(T(n||""))+'"')}if(o){u.renderCache[e][n]=s}return s}});B.count=0;B.defaults={plugins:[],delimiter:",",persist:true,diacritics:true,create:false,createOnBlur:false,highlight:true,openOnFocus:true,maxOptions:1e3,maxItems:null,hideSelected:null,addPrecedence:false,preload:false,scrollDuration:60,loadThrottle:300,dataAttr:"data-data",optgroupField:"optgroup",valueField:"value",labelField:"text",optgroupLabelField:"label",optgroupValueField:"value",optgroupOrder:null,sortField:"$order",searchField:["text"],searchConjunction:"and",mode:null,wrapperClass:"selectize-control",inputClass:"selectize-input",dropdownClass:"selectize-dropdown",dropdownContentClass:"selectize-dropdown-content",dropdownParent:null,render:{}};e.fn.selectize=function(t){var n=e.fn.selectize.defaults;var r=e.extend({},n,t);var i=r.dataAttr;var s=r.labelField;var o=r.valueField;var u=r.optgroupField;var a=r.optgroupLabelField;var f=r.optgroupValueField;var l=function(t,n){var i,u,a,f,l=e.trim(t.val()||"");if(!l.length)return;a=l.split(r.delimiter);for(i=0,u=a.length;i<u;i++){f={};f[s]=a[i];f[o]=a[i];n.options[a[i]]=f}n.items=a};var c=function(t,n){var r,l,c,h,p=0;var d=n.options;var v=function(e){var t=i&&e.attr(i);if(typeof t==="string"&&t.length){return JSON.parse(t)}return null};var m=function(t,r){var i,a;t=e(t);i=t.attr("value")||"";if(!i.length)return;if(d.hasOwnProperty(i)){if(r){if(!d[i].optgroup){d[i].optgroup=r}else if(!e.isArray(d[i].optgroup)){d[i].optgroup=[d[i].optgroup,r]}else{d[i].optgroup.push(r)}}return}a=v(t)||{};a[s]=a[s]||t.text();a[o]=a[o]||i;a[u]=a[u]||r;a.$order=++p;d[i]=a;if(t.is(":selected")){n.items.push(i)}};var g=function(t){var r,i,s,o,u;t=e(t);s=t.attr("label");if(s){o=v(t)||{};o[a]=s;o[f]=s;n.optgroups[s]=o}u=e("option",t);for(r=0,i=u.length;r<i;r++){m(u[r],s)}};n.maxItems=t.attr("multiple")?null:1;h=t.children();for(r=0,l=h.length;r<l;r++){c=h[r].tagName.toLowerCase();if(c==="optgroup"){g(h[r])}else if(c==="option"){m(h[r])}}};return this.each(function(){if(this.selectize)return;var r;var i=e(this);var s=this.tagName.toLowerCase();var o={placeholder:i.children('option[value=""]').text()||i.attr("placeholder"),options:{},optgroups:{},items:[]};if(s==="select"){c(i,o)}else{l(i,o)}r=new B(i,e.extend(true,{},n,o,t));i.data("selectize",r);i.addClass("selectized")})};e.fn.selectize.defaults=B.defaults;B.define("drag_drop",function(t){if(!e.fn.sortable)throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');if(this.settings.mode!=="multi")return;var n=this;n.lock=function(){var e=n.lock;return function(){var t=n.$control.data("sortable");if(t)t.disable();return e.apply(n,arguments)}}();n.unlock=function(){var e=n.unlock;return function(){var t=n.$control.data("sortable");if(t)t.enable();return e.apply(n,arguments)}}();n.setup=function(){var t=n.setup;return function(){t.apply(this,arguments);var r=n.$control.sortable({items:"[data-value]",forcePlaceholderSize:true,disabled:n.isLocked,start:function(e,t){t.placeholder.css("width",t.helper.css("width"));r.css({overflow:"visible"})},stop:function(){r.css({overflow:"hidden"});var t=n.$activeItems?n.$activeItems.slice():null;var i=[];r.children("[data-value]").each(function(){i.push(e(this).attr("data-value"))});n.setValue(i);n.setActiveItem(t)}})}}()});B.define("dropdown_header",function(t){var n=this;t=e.extend({title:"Untitled",headerClass:"selectize-dropdown-header",titleRowClass:"selectize-dropdown-header-title",labelClass:"selectize-dropdown-header-label",closeClass:"selectize-dropdown-header-close",html:function(e){return'<div class="'+e.headerClass+'">'+'<div class="'+e.titleRowClass+'">'+'<span class="'+e.labelClass+'">'+e.title+"</span>"+'<a href="javascript:void(0)" class="'+e.closeClass+'">&times;</a>'+"</div>"+"</div>"}},t);n.setup=function(){var r=n.setup;return function(){r.apply(n,arguments);n.$dropdown_header=e(t.html(t));n.$dropdown.prepend(n.$dropdown_header)}}()});B.define("optgroup_columns",function(t){var n=this;t=e.extend({equalizeWidth:true,equalizeHeight:true},t);this.getAdjacentOption=function(t,n){var r=t.closest("[data-group]").find("[data-selectable]");var i=r.index(t)+n;return i>=0&&i<r.length?r.eq(i):e()};this.onKeyDown=function(){var e=n.onKeyDown;return function(t){var r,i,s,o;if(this.isOpen&&(t.keyCode===l||t.keyCode===h)){n.ignoreHover=true;o=this.$activeOption.closest("[data-group]");r=o.find("[data-selectable]").index(this.$activeOption);if(t.keyCode===l){o=o.prev("[data-group]")}else{o=o.next("[data-group]")}s=o.find("[data-selectable]");i=s.eq(Math.min(s.length-1,r));if(i.length){this.setActiveOption(i)}return}return e.apply(this,arguments)}}();var r=function(){var r,i,s,o,u,a,f;f=e("[data-group]",n.$dropdown_content);i=f.length;if(!i||!n.$dropdown_content.width())return;if(t.equalizeHeight){s=0;for(r=0;r<i;r++){s=Math.max(s,f.eq(r).height())}f.css({height:s})}if(t.equalizeWidth){a=n.$dropdown_content.innerWidth();o=Math.round(a/i);f.css({width:o});if(i>1){u=a-o*(i-1);f.eq(i-1).css({width:u})}}};if(t.equalizeHeight||t.equalizeWidth){C.after(this,"positionDropdown",r);C.after(this,"refreshOptions",r)}});B.define("remove_button",function(t){if(this.settings.mode==="single")return;t=e.extend({label:"&times;",title:"Remove",className:"remove",append:true},t);var n=this;var r='<a href="javascript:void(0)" class="'+t.className+'" tabindex="-1" title="'+T(t.title)+'">'+t.label+"</a>";var i=function(e,t){var n=e.search(/(<\/[^>]+>\s*)$/);return e.substring(0,n)+t+e.substring(n)};this.setup=function(){var s=n.setup;return function(){if(t.append){var o=n.settings.render.item;n.settings.render.item=function(e){return i(o.apply(this,arguments),r)}}s.apply(this,arguments);this.$control.on("click","."+t.className,function(t){t.preventDefault();if(n.isLocked)return;var r=e(t.target).parent();n.setActiveItem(r);if(n.deleteSelection()){n.setCaret(n.items.length)}})}}()});B.define("restore_on_backspace",function(e){var t=this;e.text=e.text||function(e){return e[this.settings.labelField]};this.onKeyDown=function(n){var r=t.onKeyDown;return function(t){var n,i;if(t.keyCode===d&&this.$control_input.val()===""&&!this.$activeItems.length){n=this.caretPos-1;if(n>=0&&n<this.items.length){i=this.options[this.items[n]];if(this.deleteSelection(t)){this.setTextboxValue(e.text.apply(this,[i]));this.refreshOptions(true)}t.preventDefault();return}}return r.apply(this,arguments)}}()});return B})