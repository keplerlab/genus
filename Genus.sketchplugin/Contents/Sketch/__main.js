var globalThis=this,global=this;function __skpm_run(e,t){globalThis.context=t;try{var n=function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=require("sketch")},function(e,t){e.exports=require("sketch/dom")},function(e,n,r){"use strict";r.r(n);var a=r(0),o=r.n(a);function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var l=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.context=t}var t,n,r;return t=e,(n=[{key:"appKitWeightToCSSWeight",value:function(e){return[100,100,100,200,300,400,500,500,600,700,800,900,900,900,900,900][e]}},{key:"runCommand",value:function(e,t){var n=NSTask.alloc().init();n.setLaunchPath("/bin/bash"),n.setArguments(e),n.launch()}},{key:"alertError",value:function(e,t){t=t||"Genus Plugin Error:",this.alert(e,t),this.runCommand(["-c","afplay /System/Library/Sounds/Basso.aiff"])}},{key:"alert",value:function(e,t){t=t||"Genus",NSApplication.sharedApplication().displayDialog_withTitle(e,t)}},{key:"hexColor",value:function(e){console.log("color",e);var t=255*e.red(),n=255*e.green(),r=255*e.blue();return("#"+t.toString(16)+n.toString(16)+r.toString(16)).toUpperCase()}},{key:"nameForScale",value:function(e){return e>1?"@"+e+"x":""}},{key:"generateLayerName",value:function(e){return this.cleanString(e.name)+"-"+e.id}},{key:"cleanString",value:function(e){return(e=(e=e.replace(/\//g,"-")).replace(/[^\w\s]/gi,"")).replace(/\W+/g,"-")}},{key:"isMaskLayerInGroup",value:function(e){for(var t=!1,n=e.layers,r=0;r<n.length;r++)n[r].sketchObject.isMasked()&&(t=!0);return t}}])&&i(t.prototype,n),r&&i(t,r),e}();function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var u=new l,c=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.context=t}var t,n,r;return t=e,(n=[{key:"saveTextToFile",value:function(e,t){NSString.stringWithFormat("%@",t).writeToFile_atomically_encoding_error(e,!0,NSUTF8StringEncoding,nil)}},{key:"getCurrentFilePath",value:function(){return this.context.document.fileURL().path().replace(/\.sketch$/,"")}},{key:"deleteFile",value:function(e){NSFileManager.defaultManager().removeItemAtPath_error(e,nil)}},{key:"createFolder",value:function(e){NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error_(e,!0,nil,nil)}},{key:"renameFile",value:function(e,t){var n=NSFileManager.defaultManager();NSFileManager.defaultManager().fileExistsAtPath(e)?n.moveItemAtPath_toPath_error(e,t,nil):(errorMessage="FileNotFoundError: Error in renaming file: "+e,u.alertError(errorMessage))}}])&&s(t.prototype,n),r&&s(t,r),e}(),f={sketch:{exportFormat:"png",use_id_for_asset_name:!0,embedSvg:!1,cssFileName:"styles.css",htmlFileName:"index.html",imageFolder:"images/"}},g=f.sketch.exportFormat,h=f.sketch.use_id_for_asset_name,d=f.sketch.embedSvg,p=new l;function m(e){e=e;var t=r(1).getSelectedDocument(),n=t?t.selectedLayers:nil,a=function(){for(var e=NSMutableSet.alloc().init(),t=[],r=0;r<n.length;r++){var a=n.layers[r],o=void 0;null==(o="Artboard"==a.type?a:a.getParentArtboard())||e.containsObject(o)||(e.addObject(o),t.push(o))}return t}(),i=g,l=[1],s=!1,u=null;this.file_obj=new c(e),this.setOptions=function(e){i=e.imageFormat,s=e.embedSvg,l=e.imageScales},this.getSelection=function(){return n},this.getSelectedArtboards=function(){return a};var f={};function d(e){f[e]=[];var t=function e(t,n){var r="";return function(e,t){for(var n=e.layers,r=0;r<n.length;r++)t(n[r])}(t,(function(t){if(t.sketchObject.isVisible()){t.layerName=p.generateLayerName(t);var a=n+"<div class='sk-asset sk-"+t.layerName+"'>";if(v(t)){f[t.getParentArtboard()].push(t);r+=a+"</div>\n"}else if("Group"==t.type){var o=e(t,n+"\t");""!=o&&(r+=a+"\n",r+=o,r+=n+"</div>\n",f[t.getParentArtboard()].push(t))}else"Text"==t.type?(t=function(e,t){var n=e.sketchObject.attributedStringValue(),r=n.string(),a=NSMakeRange(0,n.length()),o=MOPointer.alloc().init(),i=[],l=[],s=[],u=[],c=MOPointer.alloc().init();for(;a.length>0;){i.push(n.attribute_atIndex_longestEffectiveRange_inRange(NSFontAttributeName,a.location,o,a));var f=n.attributesAtIndex_longestEffectiveRange_inRange(a.location,c,a);null!=f&&l.push(f.MSAttributedStringColorAttribute.hexValue()),s.push(o.value().location),u.push(o.value().length),a=NSMakeRange(NSMaxRange(o.value()),NSMaxRange(a)-NSMaxRange(o.value()))}for(var g=[100,100,100,200,300,400,500,500,600,700,800,900,900,900,900,900],h=[],d=0;d<i.length;d++){var p=new Object,m=i[d],v=l[d],y=NSFontManager.sharedFontManager().weightOfFont_(e.sketchObject.font()),b=g[y],x=m.familyName(),k=m.pointSize(),S=r.substr(s[d],u[d]);S=S.replace(/(?:\r\n|\r|\n)/g,"<br>"),p.text=S,p.fontFamilyName=x,p.weight=b,p.fontSize=k,p.font_color=v,h.push(p)}e.tspan=h;e.tspan,h.length;return e.tspanObject=h,e}(t),r+=a+function(e){for(var t="",n=e.tspan,r=n.length,a=0;a<r;a++){var o='<span class="span'+(a+1)+'">',i=n[a].text;t+=void 0===i?o+"</span>":o+i+"</span>"}return t}(t)+"</div>\n",f[t.getParentArtboard()].push(t)):console.log("Unhandled layer type encountered, Skipping export of layer ...")}})),r}(e,"\t\t\t"),n=function(e){var t="<html>\n";return t+="\t<head>\n",t+="\t\t<link href='styles.css' rel='stylesheet'>\n",t+='\t\t<meta charset="utf-8"/>\n',t+="\t</head>\n",t+='\t<body style="margin:0px;">\n',t+='\t <div style="width: '+Math.round(e.frame.width)+'px; height: 100%; position:relative; margin:auto;"> \n',t+="\t\t<div class='sk-ab sk-"+p.cleanString(e.name)+"'>\n"}(e);return n+=t,n+="\t\t</div>\n\t</div>\n\t</body>\n</html>"}function m(e){var t="/* Generated by Genus plugin */\n";return t+="\n",t+="/* Boiler plate CSS \n",t+="sk-ab is css style applied to full art board\n",t+="sk-asset is common css property applied to every css style generated by genus plugin \n",t+="*/ \n",t+="\n",t+=".sk-ab {\n\tposition: relative;\n\toverflow: hidden;\n}\n\n.sk-asset {\n\tposition: absolute;\n\tbackground-repeat: no-repeat;\n}\n",t+="\n",t+="/* Specific to "+e.name+" */\n",t+=function(e){var t=".sk-ab.sk-"+p.cleanString(e.name)+" {\n";e.sketchObject.hasBackgroundColor&&(t+="\tbackground-color: "+e.background.color+";\n");return t+="\twidth: "+Math.round(e.frame.width)+"px;\n",t+="\theight: "+Math.round(e.frame.height)+"px;\n",t+="}\n"}(e),t+="\n",f[e].forEach((function(e){t+=function(e){var t=".sk-asset.sk-"+e.layerName+" {\n";t+="\tleft: "+Math.round(e.frame.x)+"px;\n",t+="\ttop: "+Math.round(e.frame.y)+"px;\n";var n=void 0;if(v(e)){var r="images/"+e.layerName+"."+i;t+='\tbackground-image: url("'+r+'");\n';var a={formats:g,output:!1,trimmed:!1},s=o.a.export(e,a).toNSData(),u=NSImage.alloc().initWithData(s);n=u.size(),t+="\twidth: "+Math.round(n.width)+"px;\n",t+="\theight: "+Math.round(n.height)+"px;\n"}else t+="\twidth: "+Math.round(e.frame.width)+"px;\n",t+="\theight: "+Math.round(e.frame.height)+"px;\n";if(t+="}\n",t+="\n",v(e))for(var c in l){var f=l[c];if(f>1){var h=p.nameForScale(f);t+="@media only screen and (min--moz-device-pixel-ratio: "+f+"),\nonly screen and (-o-min-device-pixel-ratio: "+f+"/1),\nonly screen and (-webkit-min-device-pixel-ratio: "+f+"),\nonly screen and (min-device-pixel-ratio: "+f+") {\n",t+="\t.sk-asset.sk-"+e.layerName+" {\n";r="images/"+e.layerName+h+"."+i;t+='\t\tbackground-image: url("'+r+'");\n',t+="\t\tbackground-size: "+Math.round(n.width)+"px "+Math.round(n.height)+"px;\n",t+="\t}\n",t+="}\n"}}else"Text"==e.type&&(t+=function(e){var t=0;if(null!=e.tspan){var n=e.tspan;null!=n.length&&(t=n.length)}var r="";r+=".sk-asset.sk-"+e.layerName+" {\n",r+='\tfont-family: "'+e.style.fontFamily+'" ;\n',r+="\tfont-variant: "+e.style.fontVariant+" ;\n",r+='\tfont-stretch: "'+e.style.fontStretch+'" ;\n',r+="\tfont-weight: "+p.appKitWeightToCSSWeight(e.style.fontWeight)+" ;\n",r+="\tfont-style: "+e.style.fontStyle+" ;\n","uppercase"==e.style.textTransform&&(r+="\ttext-transform: uppercase;\n");e.style.kerning>0&&(r+="\tletter-spacing: "+e.style.kerning+";\n");null!=e.style.verticalAlignment&&1==t&&(r+="\tdisplay: table;\n");e.style.fills.length>0?r+="\tcolor: "+e.style.fills[0].color+" ;\n":r+="\tcolor: "+e.style.textColor+" ;\n";r+="\tfont-size: "+e.style.fontSize+".0px ;\n",r+="\tline-height: "+e.style.lineHeight+".0px ;\n",r+="\topacity: "+e.style.opacity+" ;\n",r+="\ttext-align: "+e.style.alignment+" ;\n",r+="\tfont-kerning: "+e.style.kerning+" ;\n",r+=function(e){var t="",n=0;if(null!=e.shadows){for(var r=0;r<e.shadows.length;r++)e.shadows[r].enabled&&(1==(n+=1)?t+="\ttext-shadow: ":n>1&&(t+=" , "),t+=x(e.shadows[r]));n>0&&(t+=" ;\n")}return t}(e.style),r+=function(e){var t="",n=0;if(null!=e.borders){for(var r=0;r<e.borders.length;r++)e.borders[r].enabled&&(1==(n+=1)?t+="\tborder: ":n>1&&(t+=" , "),t+=b(e.borders[r]));n>0&&(t+=" ;\n")}return t}(e.style),r+="}\n",r+="\n";for(var a=0;a<t;a++){var o="";o+=".sk-asset.sk-"+e.layerName+" .span"+(a+1)+" {\n";var i=n[a];void 0!==i.fontFamilyName&&(o+='\tfont-family: "'+i.fontFamilyName+'" ;\n'),void 0!==i.weight&&(o+="\tfont-weight: "+i.weight+" ;\n"),null!=e.style.verticalAlignment&&1==t&&(o+="\tdisplay: table-cell;\n","top"==e.style.verticalAlignment?o+="\tvertical-align: top;\n":"center"==e.style.verticalAlignment?o+="\tvertical-align: middle;\n":"bottom"==e.style.verticalAlignment&&(o+="\tvertical-align: bottom;\n")),void 0!==i.font_color&&(e.style.fills.length>0?o+="\tcolor: "+e.style.fills[0].color+" ;\n":o+="\tcolor: #"+i.font_color+" ;\n"),void 0!==i.fontSize&&(o+="\tfont-size: "+i.fontSize+".0px ;\n"),o+="}\n",r+=o+="\n"}return r}(e));return t}(e)})),t}function v(e){var t=function(e){return e.exportFormats.length>0}(e),n="Group"==e.type&&p.isMaskLayerInGroup(e),r="Text"!=e.type&&"Group"!=e.type;return t||n||r}function y(e,t,n){t.forEach((function(t){!function(e,t,n,r,a){var i={scales:"1, 2, 3",formats:r};for(var l in i.output=n,i["use-id-for-name"]=h,i.trimmed=!1,o.a.export(t,i),a){var s=a[l];if(s>1){var u=p.nameForScale(s),c=n+t.id+u+"."+r,f=n+t.layerName+u+"."+r;e.file_obj.renameFile(c,f)}else{c=n+t.id+"."+r,f=n+t.layerName+"."+r;e.file_obj.renameFile(c,f)}}}(e,t,n+"images/",i,l)}))}function b(e){var t="";return null!=e.thickness&&(t+=e.thickness+"px "),null!=e.color&&"Color"==e.fillType&&(t+=e.color),t}function x(e){var t="";return null!=e.x&&(t+=e.x+"px "),null!=e.y&&(t+=e.y+"px "),null!=e.blur&&(t+=e.x+"px "),null!=e.color&&(t+=e.color),t}this.run=function(e){u=e;var t=this;a.forEach((function(e){var n=u+p.cleanString(e.name)+"/";t.file_obj.deleteFile(n),t.file_obj.createFolder(n);var r=n+"index.html";t.file_obj.saveTextToFile(r,d(e));var a=n+"styles.css";t.file_obj.saveTextToFile(a,m(e)),s||(t.file_obj.createFolder(n+"images/"),y(t,f[e],n))}))}}var v=function(e){o.a.UI.message("Genus Plugin processing your artboard 🙌");try{var t=new m(e),n=t.getSelectedArtboards();if(null==n||n.length<1){return void p.alertError("Please select the artboards you want to export to HTML.","Genus Plugin Error: No Artboard Selected")}var r=function(e){var t={};return t.imageFormat=g,t.embedSvg=d,t.imageScales=[],t.imageScales.push(1),t.imageScales.push(2),t.imageScales.push(3),t}();t.setOptions(r);var a=t.file_obj.getCurrentFilePath(),i=a+"/";t.run(i);var l="Export finished ☺️, Export location: "+a;o.a.UI.message(l),p.alert(l,"genus")}catch(s){if(s!=nil){log(s);p.alertError("Oops Something went wrong: You may want to an raise issue on github, Copy paste following message:\n "+s)}}};n.default=function(){v(t)}}]);if("default"===e&&"function"==typeof n)n(t);else{if("function"!=typeof n[e])throw new Error('Missing export named "'+e+'". Your command should contain something like `export function " + key +"() {}`.');n[e](t)}}catch(r){if("undefined"==typeof process||!process.listenerCount||!process.listenerCount("uncaughtException"))throw r;process.emit("uncaughtException",r,"uncaughtException")}}globalThis.onRun=__skpm_run.bind(this,"default");