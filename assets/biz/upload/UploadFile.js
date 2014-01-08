/**
 * support - upload file
 * 工单 - 上传附件
 * @example 
 *
 * new Uploader({
        trigger: '#uploadFile', 
        uploadFileNum: 3,
        success: function(data) {
            
        }
   });
 *
 */
define(function(require, exports, module) {
    "use strict";

    var $ = require('jquery');
    var artTemplate = require('artTemplate');

    var Widget = require('arale/widget/1.1.1/widget');
    var Dialog = require('arale/dialog/1.2.5/dialog');
    require('biz/component/plugin.ajaxform')($);
    require('./upload.css');

    /**
     * 附件上传对话框
     */
    var AttachmentBox = Dialog.extend({
        attrs: {
            title: "默认标题",
            confirmTpl: '<a class="ui-dialog-button-orange" href="javascript:;">上传</a>',
            cancelTpl: '<a class="ui-dialog-button-white" href="javascript:;">取消</a>',
            uploadApi: '/upload/json/upload.json',
            uploadFileNum: 3,
            success: function() {},
            message: "默认内容",
            zIndex: 100000
        },
        
        setup: function() {
            AttachmentBox.superclass.setup.call(this);
            var model = {
                classPrefix: this.get("classPrefix"),
                message: this.get("message"),
                title: this.get("title"),
                confirmTpl: this.get("confirmTpl"),
                cancelTpl: this.get("cancelTpl"),
                hasFoot: this.get("confirmTpl") || this.get("cancelTpl"),
                uploadApi: this.get("uploadApi"),
                uploadFileNum: this.get("uploadFileNum")
            };
            
            this.set("content", buildTemplate(model));
        },
        
        events: {
            "click [data-role=confirm]": function(e) {
                e.preventDefault();
                this._ajaxSubmit();
                this.trigger("confirm");
            },
            "click [data-role=cancel]": function(e) {
                e.preventDefault();
                this.hide();
            }
        },
        
        _ajaxSubmit: function() {
            var self = this;
            var form = this.$("[class=J_ajax_upload_form]")[0];
            var successCallBack = this.get('success');
            
            // 使用 ajax form 插件上传文件
            $(form).ajaxSubmit({
                dataType : 'json',
                success: function(result, statusText, xhr, $form) {

                    successCallBack && successCallBack(result);
                }
            });

        },
        
        _onChangeMessage: function(val) {
            this.$("[data-role=message]").html(val);
        },
        _onChangeTitle: function(val) {
            this.$("[data-role=title]").html(val);
        },
        _onChangeConfirmTpl: function(val) {
            this.$("[data-role=confirm]").html(val);
        },
        _onChangeCancelTpl: function(val) {
            this.$("[data-role=cancel]").html(val);
        }
    });
    
    
    var Uploader = Widget.extend({

        attrs: {
            uploadApi: '/upload/json/upload.json',
            
            // 上传文件数量
            uploadFileNum: 3,
            
            // 上传成功 回调函数
            success: function() {},
            
            // 对话框触发点
            trigger: {
                value: null,
                getter: function(val) {
                    return $(val);
                }
            }
        },
        
        dialog: null,
        
        setup: function() {
            this._setupTrigger();
        },
        
        // 绑定触发对话框出现的事件
        _setupTrigger: function() {
            this.delegateEvents(this.get("trigger"), "click", function(e) {
                e.preventDefault();
                // 标识当前点击的元素
                //this.activeTrigger = $(e.currentTarget);
                this.show();
            });
        },
        
        show: function() {
            var successCallback = this.get('success');
            var uploadFileNum = this.get('uploadFileNum');
            
            var options = {
                title: "上传附件",
                uploadFileNum: uploadFileNum,
                success: successCallback,
                onConfirm: function() {
                    //callback && callback();
                    this.hide();
                }
            };
            
            new AttachmentBox(options).show().after("hide", function() {
                this.destroy();
            });
        }

    
    });
    
    module.exports = Uploader;
    
    
    function buildTemplate(data) {
        var html = '';
        if (data.title) {
            html += '<div class="ui-dialog-title" data-role="title">' + data.title + '</div>'
        }
        
        html += '<div class="ui-dialog-container">';
        html += '<form class="J_ajax_upload_form" method="post" action="' + data.uploadApi + '" enctype="multipart/form-data">';
        html += '<div class="ui-dialog-message" data-role="message">';
        
        for (var i=0; i < data.uploadFileNum; i++) {
            html += '<div><input type="file" size="0" name="attatchments"></div>';
        }
        
        //html += '<div><input type="file" size="0" name="attatchments"></div>';
        //html += '<div><input type="file" size="0" name="attatchments"></div>';
        html += '</div>';
        
        html += '<div class="ui-dialog-operation" data-role="foot">'
        html += '<div class="ui-dialog-confirm" data-role="confirm">' + data.confirmTpl + '</div>'
        html += '<div class="ui-dialog-cancel" data-role="cancel">' + data.cancelTpl + '</div>'
        html += '</div>';
        
        html += '</form>'
        
        html += '</div>';
        return html;
    }
    
    
});