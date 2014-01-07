/**
 * support
 * 工单列表
 */
define(function(require, exports) {
    "use strict";

    var $ = require('jquery');
    var artTemplate = require('artTemplate');
    
	var AliUser = require('biz/component/AliUser/1.0/AliUser');
    
	var Calendar = require('arale/calendar/0.9.0/calendar');
	require('arale/calendar/0.9.0/calendar.css');
	require('arale/calendar/0.9.0/i18n/zh-cn');
    
    require('biz/component/plugin.pagination')($);
    require('biz/component/plugin.collapse')($);


    var formUI = function() {


        function bindEvent() {
            
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
				new Calendar({trigger: '#sloveStart'});
				
				// 结单时间(结束)
				new Calendar({trigger: '#sloveEnd'});
                
                // 工单时间(开始)
				new Calendar({trigger: '#supportStart'});
				
				// 工单时间(结束)
				new Calendar({trigger: '#supportEnd'});

            }
        }
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
            DOM.style(_loadingBar, 'display', 'block');
            DOM.html(_contentBox, '');
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
                    _totalNum = rsp.total;
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
            $(_contentBox).html(buildHtml);

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
                formUI.init(cfg);

                this._setOptions(cfg);
                //this.connect(1)

                this._bindEvent();
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
                    
            		questionId: $('#questionId').val(),  // 工单号
            	    userName: $('#userName').val(), // 用户名    
            	    keywords: $('#keywords').val(), // 关键字
            	    status: $('#status').val(), // 问题状态
            	    questionChild: $('#questionChild').val(), // 问题分类
            	    score: $('#score').val(), // 问题评价
            	    productId: $('#productId').val(), // 产品名称
            	    typicalQuestion: $('#typicalQuestion').val(), // 典型问题
            	    sloveStart: $('#sloveStart').val(), // 结单时间(开始时间)
            	    sloveEnd: $('#sloveEnd').val(), // 结单时间(结束时间)
            	    groupId: $('#groupId').val(), // 
            	    
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
            	    priority: $('#priority').val() // 优先级
            	    
                };

                if ($.trim($('#reviewUser').val()) == "") {
                    _searchQueryData.disposeName = "";
                    _searchQueryData.disposeAccount = "";
                    _searchQueryData.disposeEmpId = "";
                    _searchQueryData.disposeDepName = "";
                    
                }

                if ($.trim($('#disposeUser').val()) == "") {
                    _searchQueryData.disposeName = "";
                    _searchQueryData.disposeAccount = "";
                    _searchQueryData.disposeEmpId = "";
                    _searchQueryData.disposeDepName = "";
                }
                
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

                // 发送前显示 loading 状态
                /*
                Ajax.on('send', function(){
                    _start();
                });
                */

                $.ajax({
                    url:  _ajaxcfg.url,
                    data: query_data,
                    type: 'get',
                    dataType: 'json',
                    cache: false,
                    success: function(d, s, xhr) {
                        _Success(d);
                    },

                    error: _failure,
                    complete: function() {
                        $(_loadingBar).css({'display': 'none'});
                    }

                });
            },

            /**
             * 初始化翻页程序
             * @param p1 {String} 传入参数p1的说明及其类型
             */
            naviInit: function() {
                $(_pagenaviBox).html();

                if (_totalNum > 1000) {
                    _totalNum = 1000;
                }

                $(_pagenaviBox).pagination(_totalNum,{
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




    return SupportSearch;



    /*
    return {
        init: function(opts) {

        }
    }
    */

})