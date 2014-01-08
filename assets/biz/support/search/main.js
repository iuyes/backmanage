/**
 * support
 * 工单列表
 */
define(function(require, exports, module) {
    "use strict";
    
    var win = window;
    
    var $ = require('jquery');
    //var artTemplate = require('artTemplate');
    
    var artTemplate = require('gallery/artTemplate/2.0.2/artTemplate-debug');
    
	var AliUser = require('biz/component/AliUser/1.0/AliUser');
    
	var Calendar = require('arale/calendar/0.9.0/calendar');
	require('arale/calendar/0.9.0/calendar.css');
	require('arale/calendar/0.9.0/i18n/zh-cn');
    
    require('biz/component/plugin.pagination')($);
    require('biz/component/plugin.collapse')($);
    require('biz/component/plugin.ajaxform')($);

    var Sticky = require('arale/sticky/1.3.1/sticky');

    var Choose = require('biz/support/choose-question');
    var Tip = require('arale/tip/1.2.1/tip');
    var ringtonePlaying;
    var search_result = $('#search_result');
    var checkTimer;

    var formUI = function() {

        //根据产品名称加载不同的典型问题
        var _typicalQuestion = $("#typicalQuestion");
        var _productId = $("#productId");
        
        function loadQustionByProduct(pid){

            $.post('/support/json/query_customer_common_question_by_product_id.json',
                {
                    'product_id':pid
                },
                function(data){
                    var result = data.data;
                    var _qstr = '';
                    if(data.success && result.length>0 ){
                        $.each(result,function(i,o){              
                            var _name = o.name,
                                _val = o.id;
                            _qstr += "<option value='"+_val+"'>"+_name+"</option>"
                        });
                    }else{
                        _qstr = '';
                    }
                    _typicalQuestion.html(_qstr);

                })
        }
        
        function bindEvent() {
            // 产品名称加载典型问题
            _productId.on('change',function(){
                var pid = $(this).val();
                loadQustionByProduct(pid);
            });

            //刷新tabs
            $("#J-tab-reload").on('click',function(e){
                e.preventDefault();
                win.location.href = win.location.href;
            });
        	// 展开高级搜索
        	$('#J_support_query').on('click', function(e) {
        		e.preventDefault();
        		
        		var $this = $(this);
        		var state = $this.attr('data-state');
        		var $advancedTable = $('#advanced');
        		if (state == "on") {
        			$this.html('+展开搜索');
        			$advancedTable.hide();
        			$this.attr('data-state', 'off');
        			return;
        		}
        		
    			$this.html('-精简搜索');
    			$advancedTable.show();
    			$this.attr('data-state', 'on');
        	});
        	
        	$('#search_result').on('click', '#checkboxBtnAll', function(e) {
        		var $this = $(this);
        		
        		if ($this.prop('checked')) {
        			$('input[name="locateQuestionId"]').prop('checked', true);
        		} else {
        			$('input[name="locateQuestionId"]').prop('checked', false);
        		}
        	});
        	
        	$('#J_select_owner_btn').on('click', function(e) {
        		e.preventDefault();
        		
				// 批量交接班分配提交表单
				ajaxFormSubmit({
					formEle: $('#J_select_owner_form'),
					submitBtnEle: $('#J_select_owner_btn')
				});
        	});
        	
        }

        return {
            init: function(opts) {
                bindEvent();

                // 处理人选择
                new AliUser({
                    trigger: '#disposeUser',
                    itemSelectCallBack: function(aliUser) {
                        $('#disposeAccount').val(aliUser.account);
                        $('#disposeName').val(aliUser.userName);
                        $('#disposeEmpId').val(aliUser.empId);
                        $('#disposeDepName').val(aliUser.depDesc);
                    }
                });

                // 复核人选择
                new AliUser({
                    trigger: '#reviewUser',
                    itemSelectCallBack: function(aliUser) {
                        $('#reviewAccount').val(aliUser.account);
                        $('#reviewName').val(aliUser.userName);
                        $('#reviewEmpId').val(aliUser.empId);
                        $('#reviewDepName').val(aliUser.depDesc);
                    }
                });
				
				// 结单时间(开始)
				new Calendar({trigger: '#solveStart'});
				
				// 结单时间(结束)
				new Calendar({trigger: '#solveEnd'});
                
                // 工单时间(开始)
				new Calendar({trigger: '#supportStart'});
				
				// 工单时间(结束)
				new Calendar({trigger: '#supportEnd'});
				
				new Choose("choice-wt-btn");

            }
        };
    }();

    
    /**
     * 新工单消息通知UI
     */
    var newQuestionMsgUI = function() {
    	
    	var searchType;
    	var groupId;
    	
    	function checkNewQuestion() {
    		if (!ringtonePlaying) {
    			$.ajax({
    				type: "get",
    				url: "/support/json/query_new_question_remind.json",
    				dataType:'json',
    				success: function(data) {
                        var d = data.data,
                            str = "",
                            linkType = "";
                        if(data.success){

                            if (d.isNewQuestion || d.isNewReply|| d.isNewReview ) {
        						SOUNDER.playRingtone();
        						ringtonePlaying = true;
                                if(d.isNewQuestion){
                                    str = "您有新的工单";
                                    linkType = 'newQuestion';
                                }else if(d.isNewReply){
                                    str = "您有新的回复";
                                    linkType = 'newReply';
                                }else{
                                    str = "您有新的复核"
                                    linkType = 'newReview';
                                }
                                var html = $('<div class="tips mb5">'+str+'[<a href="#" data-type='+linkType+' class="newlink">点击查看</a>]</div>');
                                search_result.prepend(html)
        					}
                        }
                        
    				}
    			});
    		}
    	}
    	
    	
    	return {
    		init: function(opts) {
    			var checkTimer;
                if($("#J-pageType").val()==="my"){
                    checkTimer = setInterval(checkNewQuestion,30000);
                }
    			
    		}
    	};
    	
    }();
    

    var SupportSearch = function() {
        /**
         * 是否第一次请求
         * @private
         *
         */
        var _isfirstLink = true;

        /**
         * ajax请求参数
         * @private
         *
         */
        var _ajaxcfg = {};

        /**
         * 客户搜索条件
         * @type {{}}
         * @private
         */
        var _searchQueryData = {
            /*
            customer_id: '',
            cloud_account: '',
            customer_name: ''
            */
        };

        /**
         * 初始化翻页页数,总共多少页
         * @private
         *
         */
        var _totalNum;

        /**
         * 总页数
         */
        var _totalPage;

        /**
         * 翻页容器
         * @private
         *
         */
        var _pagenaviBox;

        /**
         * loadingbar
         * @private
         *
         */
        var _loadingBar;

        /**
         * 翻页内容容器
         * @private
         */
        var _contentBox;

        /**
         * 指向 this
         */
        var _self;

        /**
         * 配置参数
         */
        var _cfg;

        var _pageObj;

        var _item_template = '';

        /**
         * ajax开始调用方法
         * @private
         */
        function _start() {
        	
        	_loadingBar.css({'display':'block'});
        	
            //DOM.style(_loadingBar, 'display', 'block');
            //DOM.html(_contentBox, '');
        }

        /**
         * 成功调用方法
         * @private
         */
        function _Success(rsp) {
            if (!rsp.data) {
                _commentNull(rsp);
            } else {
                // 如果是第一次请求，则初始化翻页
                if (_isfirstLink) {
                    _totalNum = rsp.totalCount;
                    _totalPage =  rsp.totalPage;
                    _self.naviInit(); // 初始化翻页方法
                    _isfirstLink = false;
                }

                _display(rsp);
            }
        }

        /**
         * 失败调用方法
         * @private
         */
        function _failure(e){
            alert("请求数据失败，请重试");
        }

        /**
         * 内容为空
         * @private
         *
         */
        function _commentNull(rsp){
            //console.log ("内容为空")
            //_contentBox.innerHTML=""
        }

        /**
         * js计算字节
         */
        function _getBytesLength(str){
           return str.replace(/[^\x00-\xff]/gi, "--").length; 
        }

        /**
         * 显示内容
         * @private
         *
         */
        function _display(rsp) {

            /*
            if (_item_template == '') {
                _item_template =  $('#searchResultTpl').html();
            }

            var queryData = {};

            $.each(_searchQueryData, function(k, v){
                if (v != '') {
                    queryData[k] = v;
                }
            });

            queryData.total_page = _totalPage;
            queryData.total_num = _totalNum;
            var searchQueryString = S.param(queryData);
            */

            var buildHtml = artTemplate.render('searchResultTpl', {searchResult: rsp.data, total: rsp.total});
            _contentBox.html(buildHtml);
            
            var _srtitle = $("#search_result_title");
            new Sticky("#search_result_title",0,function(status){
                if(status){
                    var d = $("#search_result_title").width();
                    _srtitle.css({"width":d-20});
                }else{
                    _srtitle.css({"width":''});
                }
            })

            // 问题标题,字节数如果大于23,则显示tips
            /*
            var _title_tips = _contentBox.find('.j-title');
            _title_tips.each(function(i,item) {
                var me = $(item);
                var _title = me.attr('data-title');
                      if (_title) {
                    new Tip({
                        trigger: me,
                        content: htmlEncode(_title),
                        //theme: 'blue',
                        arrowPosition: 10
                    });
                }

            });
*/
            // 提问人,显示tips
            var _name_tips = _contentBox.find('.j-name');
            _name_tips.each(function(i,item){
                var me = $(item);
                var _name = me.attr('data-name');
                if (_name.length < 7) {
                    return;
                }
                
                if (_name) {
                    new Tip({
                        trigger: me,
                        content: htmlEncode(_name),
                       // theme: 'blue',
                        arrowPosition: 10
                    });
                }

            });

            
           // if (typeof win.parent != 'undefined' && typeof win.parent.isABC !='undefined') {
                
            	$('a.J_abc_window').off('click').on('click', function(e) {
                	e.preventDefault();
                	
                	var title = this.getAttribute('title');
                	var href = this.href;
                	
                	ABC.window({
                		title: title,
                		url: href
                	});
                });
                
            //}  
            
        }

        function htmlEncode(value) { 
        	return $('<div/>').text(value).html(); 
        }

        return {
            /**
             * 内容列表ajax翻页初始化方法
             * @param cfg {Object} cfg.url            ajax请求url
             * @param cfg {Object} cfg.query_keyword  查询关键字
             * @param cfg {Object} cfg.contentBox     内容显示容器
             * @return {String 注明返回类型}
             * @function _f1
             * @public
             * @example
             * search.init({
                    url: 'tuan',
                    query_keyword: D.get('f-query-text').value,
                    pagenaviBox:   D.get('page-wrap'),          // 分页链接容器
                    contentBox:    D.get('search_content_box'), // 搜索内容容器
                    sortBtn:       D.query('.J_sort'),          // 排序按纽

                    priceBtn:   D.get('price_query'),             // 价格查询按纽
                    startPrice: D.get('start_price'),             // 起始价格
                    endPrice:   D.get('end_price')                // 结束价格
                });
             *
             */
            init: function(cfg){
                var self = this;

                formUI.init(cfg);

                newQuestionMsgUI.init();

                this._setOptions(cfg);
                //this.connect(1)

                this._bindEvent();

                _isfirstLink = true;
                this._setQueryData();
                this.connect(1);
            },

            _setOptions: function(cfg) {
                _self = this;

                _ajaxcfg.url = cfg.searchApi;   // ajax调用地址

                _pagenaviBox = $('#search_pages');
                _contentBox = $('#search_result');
                _loadingBar = $('#J_loading');
            },

            _setQueryData: function() {
                var self = this;
                
                _searchQueryData = {
                    searchType: $('#searchType').val(), // 搜索类型
            		questionId: $('#questionId').val(),  // 工单号
            	    userName: $('#userName').val(), // 用户名    
            	    keywords: $('#keywords').val(), // 关键字
            	    status: $('#status').val(), // 问题状态
            	    serviceId: $('#serviceId').val(), // 问题大分类
            	    questionChild: $('#questionChild').val(), // 问题子分类
            	    score: $('#score').val(), // 问题评价
            	    productId: $('#productId').val(), // 产品名称
            	    typicalQuestion: $('#typicalQuestion').val(), // 典型问题
            	    solveStart: $('#solveStart').val(), // 结单时间(开始时间)
            	    solveEnd: $('#solveEnd').val(), // 结单时间(结束时间)
            	    groupId: $('#groupId').val(), // 

                    disposeUserId: $('#disposeUserId').val(), // 处理人id
            	    disposeName: $('#disposeName').val(), // 处理人姓名
            	    disposeAccount: $('#disposeAccount').val(), // 处理人域帐号
            	    disposeEmpId: $('#disposeEmpId').val(), // 处理人工号
            	    disposeDepName: $('#disposeDepName').val(), // 处理人部门

            	    mobile: $('#mobile').val(), // 手机
            	    supportStart: $('#supportStart').val(), // 工单时间(开始时间)
            	    supportEnd: $('#supportEnd').val(), // 工单时间(结束时间)
            	    isSensitive: $('#isSensitive').val(), // 敏感词
            	    isvUid: $('#isvUid').val(), // ISV
            	    reviewResult: $('#reviewResult').val(), // 复核进度
            	    
            	    reviewName: $('#reviewName').val(), // 复核人姓名
            	    reviewAccount: $('#reviewAccount').val(), // 复核人域帐号
            	    reviewEmpId: $('#reviewEmpId').val(), // 复核人工号
            	    reviewDepName: $('#reviewDepName').val(), // 复核人部门
            	    
            	    complainType: $('#complainType').val(), // 是否投诉
            	    msgTimes: $('#msgTimes').val(), // 超时次数
            	    priority: $('#priority').val(), // 优先级
            	    
            	    msgTimesOrderBy: '',
            	    statusOrderBy: ''
                };
                
                if ($.trim($('#reviewUser').val()) == "") {
                    _searchQueryData.reviewName = "";
                    _searchQueryData.reviewAccount = "";
                    _searchQueryData.reviewEmpId = "";
                    _searchQueryData.reviewDepName = "";
                    
                }

                if ($.trim($('#disposeUser').val()) == "") {
                    _searchQueryData.disposeName = "";
                    _searchQueryData.disposeAccount = "";
                    _searchQueryData.disposeEmpId = "";
                    _searchQueryData.disposeDepName = "";
                }

            },

            //清空搜搜条件
            _resetQueryData: function(){
                var _form = $("#showInfo360");
                var _inputs = _form.find("input[type=text]");
                var _selects = _form.find("select");
                $.each(_inputs,function(i,item){
                    $(item).val('');
                });
                $.each(_selects,function(i,item){
                    $(item).val('');
                });
                //清空问题分类
                $("#serviceId").val('');
                $("#questionChild").val('');
                $("#serviceId").parent().find('.questionTxt').html('');
            },
            _bindEvent: function() {
                var _self = this;

                /**
                 * 查询客户提交按纽
                 */
                $('#J_search').on('click', function(e){
                    e.preventDefault();

                    _isfirstLink = true;
                    _self._setQueryData();
                    _self.connect(1);
                });
                
                /**
                 * 重置按钮
                 */
                $('#J_reset').on('click', function(e){
                    e.preventDefault();
                    _self._resetQueryData();
                });

                /**
                 * 超时次数排序
                 */
                search_result.on('click', 'a.J_msgTimesOrderBy', function(e){
                	e.preventDefault();
                	
                    _isfirstLink = true;
                    _self._setQueryData();
                    _searchQueryData.msgTimesOrderBy = 'desc';
                    
                    _self.connect(1);
                	
                });
                
                /**
                 * 问题状态排序
                 */
                search_result.on('click', 'a.J_statusOrderBy', function(e){
                	e.preventDefault();
                	
                    _isfirstLink = true;
                    _self._setQueryData();
                    _searchQueryData.statusOrderBy = 'asc';
                    
                    _self.connect(1);
                });
                
                // 最新工单提醒
                search_result.on('click', 'a.newlink', function(e){
                    e.preventDefault();
                    clearInterval(checkTimer);
                   // SOUNDER.stopRingtone();
                    //ringtonePlaying = false;
                    var type = $(this).attr("data-type");

                    if (type==="newQuestion") { //新工单
                        _searchQueryData = {
                            searchType : "my",
                            status :"assigned"
                        }
                    } else if(type==="newReply") { //新回复
                        _searchQueryData = {
                            searchType : "my",
                            status :"feedback"
                        }
                    } else { //新的复核
                        _searchQueryData = {
                            searchType : "my",
                            reviewResult : "wait"
                        }
                    }
                    _isfirstLink = true;
                    _self.connect(1);
                });

                
                $(document).on('keydown', function(e){
                    if (e.keyCode == 13) {
                        _isfirstLink = true;
                        _self._setQueryData();
                        _self.connect(1);
                    }
                });
                
            },

            /**
             * ajax 请求获取数据
             * @param page {String} 当前页
             * @return {String 注明返回类型}
             * @function _f1
             * @public
             */
            connect: function(page) {
                var query_data = {
                    page: page
                };

                query_data = $.extend(query_data, _searchQueryData);
                
                // 停止音乐播放
                if(window.SOUNDER || document.SOUNDER){
                    ringtonePlaying = false;
                    SOUNDER.stopRingtone();
                }
                var currentRequest = $.ajax({
                    url:  _ajaxcfg.url,
                    data: query_data,
                    type: 'get',
                    dataType: 'json',
                    cache: false,
                    
                    beforeSend: function(e) {
                        if (currentRequest != null) {
                            currentRequest.abort();
                            return;
                        }

                    	_loadingBar.css({'display':'block'});
                    	_contentBox.html('');
                    	
                    	if (_isfirstLink) {
                    		_pagenaviBox.html('');
                    	}
                    },
                    
                    complete: function() {
                        _loadingBar.css({'display': 'none'});
                    },
                    
                    success: function(d, s, xhr) {
                        _Success(d);
                    },

                    error: function(xhr, status, error) {
						if (xhr.status === 0 || xhr.readyState === 0) {
						    return;
						}
                    	
                    	_failure(error);
                    }  

                });
            },

            /**
             * 初始化翻页程序
             * @param p1 {String} 传入参数p1的说明及其类型
             */
            naviInit: function() {
                _pagenaviBox.html('');

                _pagenaviBox.pagination(_totalNum,{
                    prev_text: "上一页",
                    next_text: "下一页",
                    num_edge_entries: 2,
                    num_display_entries: 8,
                    items_per_page: 20,
                    prev_show_always: false,
                    next_show_always: false,
                    //  current_page: PAGES.pageIndex,
                    load_first_page: false,
                    callback: function(idx) {
                        //PAGES.pageselectCallback.call(PAGES,page);

                        if (_isfirstLink == false) {
                            _self.requstData(idx);
                        }
                    }
                });

                /*
                _self.pagenavi = new ajaxpage({
                    container: _pagenaviBox,
                    totalPage: _totalPage,
                    totalNum: _totalNum,
                    loadFirstPage: false,

                    callback: function(idx, pg, ready) {
                        if (_isfirstLink == false) {
                            _self.requstData(idx);
                        }

                        ready(idx);
                        return false;
                    }
                });
                */

            },

            /**
             * 翻页点击事件
             * @param p1 {String} 传入参数p1的说明及其类型
             */
            requstData: function(page) {
                page = page + 1;
                _self.connect(page);
            }


        };
    }();


    //return SupportSearch;

    module.exports = SupportSearch;
    
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
    

})