/**
 * support
 * 工单列表 - 包商工单
 */
define(function(require, exports) {
    "use strict";

    var $ = require('jquery');
    var artTemplate = require('artTemplate');
    
	//var AliUser = require('biz/component/AliUser/1.0/AliUser');
    
	//var Calendar = require('arale/calendar/0.9.0/calendar');
	//require('arale/calendar/0.9.0/calendar.css');
	//require('arale/calendar/0.9.0/i18n/zh-cn');
    
    require('biz/component/plugin.pagination')($);
    require('biz/component/plugin.collapse')($);


    var formUI = function() {


        function bindEvent() {
            

        }

        return {
            init: function(opts) {
                bindEvent();


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
         * 显示内容
         * @private
         *
         */
        function _display(rsp) {
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
                
                // 初始化时，请求第一页数据
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
            		isvQuestionId: $('#isvQuestionId').val(),  // 工单号
            	    isvUserName: $('#isvUserName').val(), // 用户名    
            	    isvQuestionCategoryId: $('#isvQuestionCategoryId').val(), // 关键字
            	    isvDisposeUser: $('#isvDisposeUser').val(), // 问题状态
            	    isvMobile: $('#isvMobile').val(), // 问题分类
                    
            	    searchType: $('#searchType').val() // 查询工单类型
                };
                

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