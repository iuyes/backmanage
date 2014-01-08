
define(function(require,exports,module) {
    var $ = require('$');
    var tabs = require('tabs');
    var comfirmBox = require('comfirmbox');
    var choiceQustion = require('biz/support/choose-question-asyn');
    var Uploader = require('biz/upload/UploadFile');
    var loadAreaFaq = require('biz/support/loadAreaFaq');
    require('biz/component/plugin.ajaxform')($);
    require('biz/component/plugin.pagination')($);
    require('biz/component/plugin.nicescroll')($);
    require('biz/component/plugin.event.drag')($);

    var win = window;

    new Uploader({
       trigger: '#detailUploadFile',
       uploadFileNum: 3,
       success: function(rep) {
          if (!rep.success) {
             alert(rep.message);
             return;
          }

          var data = rep.data;
          if (data.attatchments) {

			 var html = "";
				var i=1;
				$.each(data.attatchments, function(k, v){
				  html+='&nbsp;<a href="' + v + '" target="_blank"> 附件'+i+'</a>&nbsp; <input type="hidden" name="attachments" value="' + v + '" />';
				  i++;
				});

             $('#detailAttachments').html( html);
          }
       }
    });

    //刷新页面
    $("#J-reload").bind('click',function(e){
        e.preventDefault();
        window.location.href = window.location.href;
    })

    /**
     * iframe高度自适应
     */
     /*
     $("#J-kcustomer").load(function(){
        new aiframeHeight("J-kcustomer").ajustHeight();
     });
        */

    /**
     * 工单详情 UI
     */

    var detailInfoUI = function() {
        var scrooArr = ["#J-scroll-gt","#J-scroll-zy","#J-scroll-dt","#J-scroll-fh"];
        $.each(scrooArr,function(i,item){
            $(item).niceScroll({cursorborder:"",cursorcolor:"#a4c6ef",boxzoom:false});
        })

    }();

    /**
     * 工单操作面板 UI
     * @type {operationPanelUI}
     */
    var operationPanelUI = function() {
        // 拖动
        var $w = $(window),
            $d = $(document),
            $w_width = $w.width(),
            $w_height = $w.height(),
            controlBar = $('#controlBar'),
            controlBarHeight = controlBar.outerHeight();

            //windowresize修改弹框页面最大、最小化切换时controlBar的定位问题
            $w.on('resize',function(){
               // console.log(controlBar.css('top'))
                if( controlBar.css('top') && parseInt(controlBar.css('top')) + controlBarHeight > $w.height()){
                    controlBar.css('top',$w.height()-controlBarHeight);
                }
            });
        controlBar.drag("start",function( ev, dd ){
           dd.limit = {};
            dd.limit.top = 0;
            dd.limit.left = 20;
            dd.limit.right = $w.width() - $( this ).outerWidth()-20;
            dd.limit.bottom = $w.height() - $(this).outerHeight();
        }).drag(function( ev, dd ){
            $( this ).css({
               top: Math.min( dd.limit.bottom, Math.max( dd.limit.top, dd.offsetY - $d.scrollTop() ) ),
                left: Math.min( dd.limit.right, Math.max( dd.limit.left, dd.offsetX ) )
            });   
        });

        //页面锚点定位
        var _abody = $('body,html');

        // 浮层操作
        var submitWrap = $("#handle-submit-wrap"),
            controlBar = $("#controlBar"),
            submitPanel = $("#submit-panel"),
            sCommunication = $(".s-communication",submitPanel),
            sNormal = $('.s-normal',submitPanel),
            sSupport = $('.s-sendrecord-wrap',submitPanel),
            gotoWrap = $('.r-goto',submitPanel),
            _sinit = submitPanel.find('.s-init'),
            panelTabs,
            spanel,
            tabsIndex = 0,
            panel;

        //判断页面是否在滚动状态中
        gotoWrap.delegate('a','click',function(e){   
            e.preventDefault();
            var _anchor = $(this).attr("data-anchor");
            var _stp = $("#"+_anchor).offset().top;
            _abody.animate({scrollTop: _stp}, 500,function(){
            });
        });


        submitWrap.delegate('a','click',function(e){
            e.preventDefault();
            var me = $(this),
                ajaxUrl;
            if(me.hasClass('disabled')){
                return;
            }
            if(me.attr('id')){
               var cid = me.attr("id"),
                _p = cid.split("-")[1],
                _panel = ".panel-"+_p,
                _submitbar = ".s-"+_p;
                if(_p === "sendrecord" && tabsIndex > 0){
                    _submitbar = ".s-sendrecord"+tabsIndex;
                }
            }else{
                //submitWrap 里面直接提交的按钮处理
                if(me.attr('data-role')==="ajax"){
                    me.text('正在响应...');
                    me.addClass('disabled');
                    if(me.attr("data-action")==="response"){
                        var responseForm = $("#J-response-form");
                        ajaxUrl = responseForm.attr("action");
                        var params = {
                            'questionId' : responseForm.find("input[name=questionId]").val(),
                            'actionType' : "response"
                        }
                        $.post(ajaxUrl,params,function(data){
                                if(data.success){
                                    window.location.href = window.location.href;
                                }else{
                                    window.location.href = window.location.href;
                                }
                        })
                    }
                }
                return;
            }

            // 显示操作面板
            if ($(_panel,controlBar).length > 0) {
                panel = $(_panel,controlBar);
                panel.show();
            }

            // 显示操作面板对应的提交
            submitPanel.find('.submit-bar').hide();
            if ($(_submitbar,submitPanel).length>0) {
                spanel = $(_submitbar,submitPanel);
                spanel.show();
            } 
        });

        //返回关闭操作面板
        submitPanel.find("a.a-goback").bind('click',function(e){
                e.preventDefault();
                //initPanel();
                panel.hide();
                spanel.hide();
                _sinit.show();
            });

        //最小关闭操作面板
        controlBar.find('a.a-min').bind('click',function(e){
                e.preventDefault();
                panel.hide();
                spanel.hide();
                _sinit.show();
            });

        // 提交
        sCommunication.delegate('a.btn_submit','click',function(e){
            e.preventDefault();
			var $this = $(this);
			var na = $this.attr("data-name");
            panel.find('form').find("input[name=actionType]").val(na);
            //提交待确认
            if( na==="wait_confirm" ){
        
                comfirmBox.confirm('您确认要提交待确认吗?','提示',function(){
                    ajaxFormSubmit({
                        formEle: panel.find('form'),
                        submitBtnEle: $this
                    });
                },{width:300,closeTpl: "×"});

                return;
            };
			
			  ajaxFormSubmit({
                formEle: panel.find('form'),
                submitBtnEle: $this
            });

            return;

        });

        // 派单tabs切换
        var sendPanelArr = $("#send-tab-panel .abc-send-content .send-type");
      

        var _tabs = new tabs({
            element: '#send-tab-panel',
            triggers: '#send-tab-panel .send-tab li',
            panels: '#send-tab-panel .abc-send-content .send-type',
            activeTriggerClass :'current',
            triggerType:'click'
        });

        _tabs.on('change:activeIndex', function(toIndex, fromIndex) {
            tabsIndex = toIndex;
            panelTabs = $(sendPanelArr[toIndex]);
            //根据不同的tabs显示不同的提交按钮
            $(".submit-bar",sSupport).hide();
            var curSubBar = ".s-sendrecord"+(toIndex===0?"":toIndex);
            $(curSubBar,sSupport).show();
            spanel = $(curSubBar,sSupport);
        });

        // 提交表单
        sNormal.delegate('a.btn_submit','click',function(e){
            e.preventDefault();
            var self = this;
            var $this = $(this);
            ajaxFormSubmit({
                formEle: panel.find('form'),
                submitBtnEle: $this
            });

        });

        panelTabs = $(sendPanelArr[tabsIndex]);
        // 派单提交按纽
        sSupport.delegate('a.btn_submit', 'click', function(e){
            e.preventDefault();
            var self = this;
            var $this = $(this);
            ajaxFormSubmit({
                formEle: panelTabs.find('form'),
                submitBtnEle: $this
            });
            return;
        });


        var cid = $('.send-area').find('input[name=serviceId]').val();
        loadAreaFaq.getArea(cid);

        //tabs里面根据产品分类加载问题分类
        new choiceQustion("choice-wt-btn",'J-choiceproduct-area',function(s,c){
            loadAreaFaq.getArea(c);
        });
        new choiceQustion("choice-wt-btn-p",'J-choiceproduct-man');
        new choiceQustion("choice-wt-btn-bs",'J-choiceproduct-bs');
        new choiceQustion("choice-wt-btn-change",'J-change-productcat');

        var loadQustionByProduct = function(pid){
            var result,_qstr;
            $.post('/support/json/query_customer_common_question_by_product_id.json',
                {
                    'product_id':pid
                },
                function(data){
                    result = data.data;
                    _qstr = '';
                    if(data.success && result.length>0 ){
                        $.each(result,function(i,o){              
                            var _name = o.name,
                                _val = o.id;
                            _qstr += "<option value='"+_val+"'>"+_name+"</option>"
                        });
                    }else{
                        _qstr = '';
                    }
                    $("#J-change-normalq").html(_qstr);
                });
        };
        
        $("#J-change-productcat").bind('change',function(){
            var val = $(this).val();
            loadQustionByProduct(val);
        });
        /**
         *派单到处理人 接手组联动接手人
         */
         var detailGroup = $("#s-detailGroup"),
            detailPerson = $("#s-detailPerson");
        detailGroup.bind("change",function(){
            var val = $(this).val(),
                str = "",
                selected,
                defaultVal = detailPerson.attr('data-default'),
                result;
            $.post("/support/json/query_user_by_group_id.json",
                {
                    groupId: val
                },
                function(data){
                    result = data.data;
                    //result = isObject(data)?data:$.parseJSON(data);
                    if(data.success && result.length>0){
                        $.each(result,function(i,o){                
                            var _name = o.nickName,_val = o.id;
                            selected = (defaultVal!=="0" && defaultVal==_val)?"selected" : "";
                            str += "<option "+selected+" value='"+_val+"'>"+_name+"</option>"
                        });
                    }
                    detailPerson.html(str);
                }
            );
        });
        detailGroup.trigger('change');

    }();

    /**
     * 沟通记录表单
     * @constructor
     */
    var CommunicationFormUI = function() {

        var queryQuickAnswerApi = '/support/json/query_quick_answer.json';

        /**
         * 上传附件
         * @type {Uploader}
         */
        new Uploader({
            trigger: '#answerUploadFile',
            uploadFileNum: 3,
            success: function(rep) {
                if (!rep.success) {
                    alert(rep.message);
                    return;
                }

                var data = rep.data;
                if (data.attatchments) {
                  $('#answerAttachments').hide();
                  $('#J_uploadText').html(_buildUploadHtml(data.attatchments));
                }
            }
        });


        function _buildUploadHtml(attatchments) {
            var html = "";
            var i=1;
            $.each(attatchments, function(k, v){
              html+='&nbsp;<a href="' + v + '" target="_blank"> 附件'+i+'</a>&nbsp; <input type="hidden" name="attachments" value="' + v + '" />';
              i++;
            });

            return html;
        }

        /**
         * 快捷短语
         */
        var PAGES = {
            //pageIndex : 1,//页面索引值
            pageSize : 5,//每页显示条数
            isInitPagination : false,

            initPagination : function(total) {
                // PAGES.isInitPagination = true;
                $("#quickAnswerPages").pagination(total,{
                    prev_text: "上一页",
                    next_text: "下一页",
                    num_edge_entries: 2,
                    link_to:"javascript:;",
                    num_display_entries: 8,
                    items_per_page: PAGES.pageSize,
                    prev_show_always: false,
                    next_show_always: false,
                    //current_page: PAGES.pageIndex,
                    load_first_page: false,
                    callback: function(page) {
                        PAGES.pageselectCallback.call(PAGES,page);
                    }
                });


                $("#quickAnswer").delegate('a.J_quick_answer', 'click', function(e){
                    e.preventDefault();

                    var answerContent = this.getAttribute('data-content');
                    $('#answerContent').val(function(i, text) {
                        return text + answerContent;
                    });
                });

            },

            _buildHtml: function(data) {
                var html = '<table width="100%">';

                $.each(data, function(k, v){
                    if (typeof v.answerContent != 'undefined' && v.answerContent) {
                        html += '<tr><td><a data-content=' + v.answerContent + ' href="#" class="J_quick_answer">'  + v.title +  '</a></td></tr>';
                    }
                });

                html += '</table>';

                return html;

            },

            pageselectCallback : function(page){
                var self = this,
                    result = "",
                    page = page ? page + 1 : 0;

                $.ajax({
                    type: "get",
                    dataType: "json",
                    url: queryQuickAnswerApi,
                    cache: false,
                    data: {
                        'page': page,
                        'page_size' : PAGES.pageSize
                    },

                    success: function(req) {
                        var total = req.totalCount;
                        var lists = req.data;

                        if (!self.isInitPagination) {
                            PAGES.initPagination.call(PAGES,total);
                            //PAGES.initPagination(total);
                            PAGES.isInitPagination = true;
                        }

                        var resHtml = self._buildHtml(lists);
                        $("#quickAnswer").html(resHtml);



                    },

                    error: function(e) {

                    }
                });

            }
        };



        PAGES.pageselectCallback();


    }();


    /**
     * 包商工单 UI
     * @type {SupportIsvFormUI}
     */
    var SupportIsvFormUI = function() {

        /**
         * 上传附件
         * @type {Uploader}
         */
        new Uploader({
            trigger: '#isvUploadFile',
            uploadFileNum: 3,
            success: function(rep) {
                if (!rep.success) {
                    alert(rep.message);
                    return;
                }

                var data = rep.data;
                if (data.attatchments) {
                    $('#isvAttachments').html(_buildUploadHtml(data.attatchments));
                }
            }
        });

        // 处理人派单附件上传
        new Uploader({
            trigger: '#dealUserUploadFile',
            uploadFileNum: 3,
            success: function(rep) {
                if (!rep.success) {
                    alert(rep.message);
                    return;
                }

                var data = rep.data;
                if (data.attatchments) {
                    $('#dealUserAttachments').html(_buildUploadHtml(data.attatchments));
                }
            }
        });

        // 责任田派单附件上传
        new Uploader({
            trigger: '#dutyUploadFile',
            uploadFileNum: 3,
            success: function(rep) {
                if (!rep.success) {
                    alert(rep.message);
                    return;
                }

                var data = rep.data;
                if (data.attatchments) {
                    $('#dutyAttachments').html(_buildUploadHtml(data.attatchments));
                }
            }
        });


        function _buildUploadHtml(attatchments) {
            var html = "";

          var i=1;
          $.each(attatchments, function(k, v){
            html+='&nbsp;<a href="' + v + '" target="_blank"> 附件'+i+'</a>&nbsp; <input type="hidden" name="attachments" value="' + v + '" />';
            i++;
          });

            return html;
        }

    }();


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
define('biz/support/loadAreaFaq',['$'],function(require,exports,module){

    var $ = require("$"),
        workerId = $("#c-questionId").val(),
        dutyAreaIdSelect = $("#dutyAreaIdSelect"),
        faqCaseIdSelect = $("#faqCaseIdSelect");
    var isObject = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    var isStr= function(str){
        return Object.prototype.toString.call(str) === '[string Object]';
    }
    var getData = function(url,param,ele){
        var str = "",
            ele = isStr(ele)?$("#"+ele):ele,
            selected,
            defaultVal = ele.attr("data-default");
        $.post(url,param,
                function(data){
                    var result;
                    result = isObject(data)?data.data:$.parseJSON(data).data;
                    if(data.success && result.length>0){
                        $.each(result,function(i,o){              
                            var _name = o.name,
                                _val = o.id;
                            selected = (defaultVal!=="0" && defaultVal==_val)?"selected":"";
                            str += "<option "+selected+" value='"+_val+"'>"+_name+"</option>";
                        });
                        ele.html(str);      
                    }else{
                        ele.html('<option value="">暂无</option>');
                    }
                     ele.trigger('change');
                }
        )
    };
    //根据责任田获取问题
    var getProblemByArea = function(areaid){
        if(areaid){
            var param = {
                    dutyAreaId:areaid
                },
                url = "/support/json/query_case_by_duty_area_id.json";
            getData(url,param,faqCaseIdSelect);
        }else{
            faqCaseIdSelect.html('');
        }
    };

    dutyAreaIdSelect.bind("change",function(e){
        var _id = $(e.currentTarget).val();
        getProblemByArea(_id);
    });

    module.exports = {
           //选择分类获取责任田的数据
        getArea: function(cid){
            var param = {
                    serviceId : cid
                },
                url = "/support/json/query_duty_area_by_service_id.json";
            getData(url,param,dutyAreaIdSelect);
        }
    }
});

/*
//iframe高度自适应
define('biz/support/ajustIframeHeight',function(require, exports, module){
    //var $ = require('$');
    var ajustIframeHeight = function(id){
        this.ele = id;
    }
    module.exports = ajustIframeHeight;
    ajustIframeHeight.prototype = {
        constructor : "ajustIframe",
        ajustHeight : function(){
            //var win = this.ele; 
            if (document.getElementById){ 
                var win = document.getElementById(this.ele);
                if (win && !window.opera){
                    if (win.contentDocument && win.contentDocument.body.offsetHeight){ 
                        win.height = win.contentDocument.body.offsetHeight; 
                    console.log(win.height)
                    }else if(win.Document && win.Document.body.scrollHeight){ 
                        win.height = win.Document.body.scrollHeight; 
                        console.log(win.height)
                    }
                } 
            }
        }
    }
});
*/








