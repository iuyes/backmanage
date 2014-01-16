define("arale/dialog/1.0.0/confirmbox",["./dialog","$","arale/widget/1.0.2/templatable","gallery/handlebars/1.0.0/handlebars","arale/overlay/0.9.13/overlay","arale/position/1.0.0/position","arale/iframe-shim/1.0.0/iframe-shim","arale/widget/1.0.2/widget","arale/base/1.0.1/base","arale/class/1.0.0/class","arale/events/1.0.0/events","arale/overlay/0.9.13/mask"],function(a,b,c){var d=a("$"),e=a("arale/widget/1.0.2/templatable"),f=a("gallery/handlebars/1.0.0/handlebars"),g=a("./dialog");seajs.importStyle('.ui-dialog{background-color:rgba(0,0,0,.5);border:0;FILTER:progid:DXImageTransform.Microsoft.Gradient(startColorstr=#88000000, endColorstr=#88000000);padding:6px}:root .ui-dialog{FILTER:none9}.ui-dialog-close{position:absolute;display:block;z-index:10;color:#999;top:16px;right:16px;font-family:tahoma;font-size:24px;line-height:14px;height:18px;width:18px;text-decoration:none;overflow:hidden;cursor:pointer;font-weight:700}.ui-dialog-close:hover{color:#666;text-shadow:0 0 2px #aaa}.ui-dialog-title{height:45px;font-size:16px;font-family:"微软雅黑","黑体",Arial;line-height:46px;border-bottom:1px solid #E1E1E1;color:#4d4d4d;text-indent:20px;background:-webkit-gradient(linear,left top,left bottom,from( #fcfcfc),to( #f9f9f9));background:-moz-linear-gradient(top, #fcfcfc, #f9f9f9);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#fcfcfc", endColorstr="#f9f9f9");background:-o-linear-gradient(top, #fcfcfc, #f9f9f9);background:linear-gradient(top, #fcfcfc, #f9f9f9)}.ui-dialog-container{padding:15px 20px 20px}.ui-dialog-message{margin-bottom:15px}.ui-dialog-operation{zoom:1}.ui-dialog-confirm,.ui-dialog-cancel{display:inline}.ui-dialog-operation .ui-dialog-confirm{margin-right:6px}',"arale/dialog/1.0.0/dialog.css");var h=g.extend({Implements:e,attrs:{content:'{{#if title}}\n<div class="{{classPrefix}}-title" data-role="head">{{{title}}}</div>\n{{/if}}\n<div class="{{classPrefix}}-container">\n<div class="{{classPrefix}}-message" data-role="message">{{{message}}}</div>\n{{#if hasFoot}}\n<div class="{{classPrefix}}-operation" data-role="foot">\n{{#if confirmTpl}}\n<div class="{{classPrefix}}-confirm" data-role="confirm">\n{{{confirmTpl}}}\n</div>\n{{/if}}\n{{#if cancelTpl}}\n<div class="{{classPrefix}}-cancel" data-role="cancel">\n{{{cancelTpl}}}\n</div>\n{{/if}}\n</div>\n{{/if}}\n</div>',title:"默认标题",confirmTpl:'<div class="ui-button ui-button-sorange">                            <a href="javascript:;" class="ui-button-text">确定</a>                         </div>',cancelTpl:'<div class="ui-button ui-button-swhite">                            <a href="javascript:;" class="ui-button-text">取消</a>                        </div>',message:"默认内容"},parseElement:function(){var a={classPrefix:this.get("classPrefix"),message:this.get("message"),title:this.get("title"),confirmTpl:this.get("confirmTpl"),cancelTpl:this.get("cancelTpl"),hasFoot:this.get("confirmTpl")||this.get("cancelTpl")},b=f.compile(this.get("content"));this.set("content",b(a)),h.superclass.parseElement.call(this)},events:{"click [data-role=confirm]":function(a){a.preventDefault(),this.trigger("confirm")},"click [data-role=cancel]":function(a){a.preventDefault(),this.hide()}},_onChangeMessage:function(a){this.$("[data-role=message]").html(a)},_onChangeTitle:function(a){this.$("[data-role=title]").html(a)},_onChangeConfirmTpl:function(a){this.$("[data-role=confirm]").html(a)},_onChangeCancelTpl:function(a){this.$("[data-role=cancel]").html(a)}});h.alert=function(a,b,c){var e={message:a,title:"",cancelTpl:"",closeTpl:"",onConfirm:function(){b&&b(),this.hide()}};new h(d.extend(null,e,c)).show().after("confirm close",function(){this.destroy()})},h.confirm=function(a,b,c,e){var f={message:a,title:b||"确认框",closeTpl:"",onConfirm:function(){c&&c(),this.hide()}};new h(d.extend(null,f,e)).show().after("confirm close",function(){this.destroy()})},h.show=function(a,b,c){var e={message:a,title:"",confirmTpl:!1,cancelTpl:!1,onConfirm:function(){b&&b(),this.hide()}};new h(d.extend(null,e,c)).show().after("confirm close",function(){this.destroy()})},c.exports=h});