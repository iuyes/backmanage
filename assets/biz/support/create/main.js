/**
 * support
 * 新建工单
 */
define(function(require, exports, module) {
    
    var $ = require('jquery');
    
    var Upload = require('biz/upload/UploadFile');
    var choiceQ = require('biz/support/choose-question-asyn');
    var Validate = require('biz/component/plugin.validate');
    
    require('biz/component/plugin.ajaxform')($);
    
    var userDetailLink;
    
    var createSupport = function() {
        new Upload({
            trigger : '#uploadFile',
            uploadFileNum : 3,
            success : function(data) {
                if (!data.success) {
                    alert(data.message);
                    return;
                }

                var _data = data.data;
                if (_data.attatchments) {
                    $('#J_ul_list_attachment').html(_buildUploadHtml(_data.attatchments));
                }
            }
        });

        Validate($);
        
        // 表单验证
        var _rules = {
            'userName':{
                required:true,
                maxlength:64,
                minlength:2
            },
            /*
            'phone':{
                required:true
            },
            */
            'title':{
                required:true,
                maxlength:200,
                minlength:2
            },
            'content':{
                required:true
            },
            'serviceId':{
                required:true
            }
        };
            
        var _message = {
            'userName':{
                required:"云账号必填",
                maxlength:"云账号最大长度为64位",
                minlength:"云账号最小长度为2位"
            },
            /*
            'phone':{
                required:"电话号码为必填"
            },
            */
            'title':{
                required:"标题为必填",
                maxlength:"问题标题最大长度为200位",
                minlength:"问题标题最小长度为2位",
            },
            'content':{
                required:"问题描述为必填"
            },
            'serviceId':{
                required:"请选择问题分类"
            }
        };

        // 新建工单表单验证        
        $.validator.setDefaults({
            submitHandler: function(form) {
                
                ajaxFormSubmit({
                    formEle: $('#J_validate'),
                    submitBtnEle: $('#J_ajax_submit')
                });
                
                //form.submit();
                //$.ajax({

                //}) 
            }
        });

        $("#J_validate").validate({
            ignore: "",
            errorClass:"tip-error",
            errorElement:"span",
            onkeyup:false,
            errorPlacement:function(error,element){
                var p;
                if (element.is(":checkbox") || element.is(":radio") || element.is("input[type=file]")) {
                    p = element.parent().parent();
                }else{ 
                    p = element.parent(); 
                }
                if(p.find("span.tip-right").length > 0){
                    p.find("span").remove();
                }
                error.appendTo(p); 
            },
            rules:_rules,
            messages:_message,
            success:function(label){
                label.removeClass("tip-error").addClass("tip-right")
            }
        });

        function _buildUploadHtml(attatchments) {
            var html = "";

            $.each(attatchments, function(k, v) {
                html += '附件: <a href="' + v + '" target="_blank"> ' + k + ' </a> <input type="hidden" class="attachments" name="attachments" value="' + v + '" />';
            });

            return html;
        };

        new choiceQ("choice-wt-btn","J-selectQuestion",function(p,c){
            //选择之后去除错误的样式
            if($("#choice-wt-btn").parent().find('span.tip-error').length > 0){
                var _p = $("#choice-wt-btn").parent();
                _p.find('span.tip-error').remove();
                $('<span class="tip-right" />').appendTo(_p);
            }
        });

        //var userDetailLink = "$crmUserDetailLink";
        
        $("#match-user-btn").click(function(e) {
            e.preventDefault();

            var user = $("#user-name").val();
            var url = userDetailLink.concat("?cloud_account=").concat(user);
            window.open(url, "_blank");
        });

        var faqIdEle = $("#faq_id");
        $("#group_id").change(function() {
            var _groupId = $(this).val(), str = "";

            $.ajax({
                type : "get",
                dataType : "json",
                url : "/support/json/query_user_by_group_id.json",
                data : {
                    "groupId" : _groupId
                },
                success : function(data) {
                    if (data.success) {

                        // faqIdEle.empty();
                        var _data = data.data, uname;
                        for (var i = 0, len = _data.length; i < len; i++) {
                            uname = _data[i].nickName ? _data[i].nickName : _data[i].account;
                            str += '<option value="' + _data[i].id + '">' + uname + '</option>';

                        }
                        faqIdEle.html(str);
                    } else {
                        faqIdEle.html('');
                    }
                }
            });
        });
    	
    };
    
    

    module.exports = {

    	init: function(opts) {
    		userDetailLink = opts.userDetailLink;
    		
    		createSupport();
    	}
    		
    };

    
    
    
    /**
     * helper function
     */
    function ajaxFormSubmit(opts) {

        var formEle = opts.formEle;
        var submitBtnEle = opts.submitBtnEle;
        var beforeSubmit = opts.beforeSubmit;

        formEle.ajaxSubmit({
            url : formEle.attr('action'),			//按钮上是否自定义提交地址(多按钮情况)
            dataType : 'json',

            beforeSerialize: function($form, options) {
                if (typeof beforeSubmit != 'undefined' && $.isFunction(beforeSubmit)) {
                    beforeSubmit.call();
                }
            },

            beforeSubmit: function(arr, $form, options) {
                var text = submitBtnEle.text();

                //按钮文案、状态修改
                submitBtnEle.text(text +'中...').prop('disabled',true).addClass('disabled');
            },

            success: function(data, statusText, xhr, $form) {
                var text = submitBtnEle.text();

                //按钮文案、状态修改
                submitBtnEle.removeClass('disabled').text(text.replace('中...', '')).parent().find('span').remove();

                if (data.success == true) {
                    $( '<span class="tips_success">' + data.message + '</span>' ).appendTo(submitBtnEle.parent()).fadeIn('slow').delay( 1000 ).fadeOut(function() {
                        if (data.redirectUrl) {
                            window.location.href = data.redirectUrl;
                        } else {
                            reloadPage(window);
                        }
                    });
                } else {
                    $( '<span class="tips_error">' + data.message + '</span>' ).appendTo(submitBtnEle.parent()).fadeIn( 'fast' );
                    submitBtnEle.removeProp('disabled').removeClass('disabled');
                }

            }
        });

    }
    
    // 重新刷新页面，使用location.reload()有可能导致重新提交
    function reloadPage(win) {
        var location = win.location;
        location.href = location.pathname + location.search;
    }
});