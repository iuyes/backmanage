/**
 * abc - Tab菜单
 */
define(function(require, exports, module) {
	var $ = require('gallery/jquery/1.10.2/jquery');
	var template = require('gallery/artTemplate/2.0.2/artTemplate');
    var Widget = require('arale/widget/1.1.1/widget');
    var IframeUI = require('./IframeUI');

    /**
     * 创建一个Tab及和它关联的 iframe
     */
    var TabPanel = Widget.extend({

        attrs: {
            title: '',
            path: '',
            url: '',

            // 是否显示关闭按纽
            isCloseBtn: true
        },

        template: '<li data-url="<%=url%>" data-path="<%=path%>" data-title="<%=title%>" class="current J_tab"><span><a><%=title%></a> <% if (isCloseBtn == true) { %> <a title="关闭此页" data-url="<%=url%>" class="del J_close_tab">关闭</a> <% } %> </span></li>',
        iframeElement: null,

        events: {
            //'click a.del': '_remove'
        },

        setup: function() {
            this._bindIframe();

            this.set('parentNode', $('#B_history')[0]);
            this.render();

        },

        parseElementFromTemplate: function() {
            var url = this.get('url');
            var path = this.get('path');
            var title = this.get('title');
            var isCloseBtn = this.get('isCloseBtn');

            var compiled = template.compile(this.template);
            var templateHtml = compiled({url: url, path: path, title:title, isCloseBtn: isCloseBtn});

            this.element = $(templateHtml);
        },

        getTabElement: function() {
            return this.element;
        },

        getIframeElement: function() {
            return this.iframeElement;
        },

        show: function() {
            this.element.addClass('current');
            this.iframeElement.show();
        },

        hide: function() {
            this.element.removeClass('current');
            this.iframeElement.hide();
        },

        remove: function() {
            this._remove();
        },

        _remove: function() {
            this.iframeElement.destroy();
            this.destroy();
        },

        _bindIframe: function() {
            var url = this.get('url');
            this.iframeElement = new IframeUI({
                url: url
            });
        }

    });


    var TabViewUI = Widget.extend({
        template: '<div class="tabA" id="B_tabA">'
                       + '<a title="上一页" id="J_tab_prev" class="tabA_pre" tabindex="-1" href="#">上一页</a>'
                       + '<a title="下一页" id="J_tab_next" class="tabA_next" tabindex="-1" href="#">下一页</a>'
                       +  '<div style="margin:0 25px;min-height:1px;">'
                       +     '<div style="position:relative;height:30px;width:100%;overflow:hidden;">'
                       +         '<ul id="B_history" style="white-space: nowrap; position: absolute; left: 4px; top: 0px;"></ul>'
                       +     '</div>'
                       + '</div>'
                     + '</div>',

        tabElements:{},

        attrs: {

            activeIndex: 0,

            parentNode: $('#J_tabView')[0]

        },

        events: {
            'click #J_tab_prev': '_switchToPrevEventHandler',
            'click #J_tab_next': '_switchToNextEventHandler',
            'click li.J_tab': '_switchToEventHandler',
            'click a.J_close_tab': '_removeTabEventHandler'
        },

        setup: function() {

            // 添加默认首页tab


        },

        parseElementFromTemplate: function() {
            var templateHtml = this.template;
            this.element = $(templateHtml);
        },

        showTab: function(opts) {
            var url = opts.url;
            var path = opts.path;
            var title = opts.title;
            var isCloseBtn = opts.isCloseBtn;

            if (typeof this.tabElements[url] == "undefined") {
                this._createTabBindIframe(url, path, title, isCloseBtn);
            }

            this._switchToTab(url, path);

        },

        _switchToTab: function(url, path) {
            if (typeof this.tabElements[url] == "undefined") {
                return;
            }

            var tabElement = this.tabElements[url].getTabElement();
            var $nextTabEle = this.element.find('#J_tab_next');
            var $prevTabEle = this.element.find('#J_tab_prev');

            var ul = this.element.find('#B_history');
            var li_offset = tabElement.offset();
            var li_width = tabElement.outerWidth(true);
            var next_left = $nextTabEle.offset().left - 9; //右边按钮的界限位置
            var prev_right = $prevTabEle.offset().left + $prevTabEle.outerWidth(true);//左边按钮的界限位置
            var distance;

            if (li_offset.left + li_width > next_left) {//如果将要移动的元素在不可见的右边，则需要移动
                distance = li_offset.left + li_width - next_left;//计算当前父元素的右边距离，算出右移多少像素
                ul.animate({left:'-='+distance},200,'swing');
            } else if (li_offset.left < prev_right) {//如果将要移动的元素在不可见的左边，则需要移动
                distance = prev_right - li_offset.left;//计算当前父元素的左边距离，算出左移多少像素
                ul.animate({ left:'+='+distance },200,'swing');
            }

            this._hideAllTab();
            this.tabElements[url].show();

            // tab 面包屑
            $('#breadCrumb').html(path);
        },

        _hideAllTab: function() {
            $.each(this.tabElements, function(k, v) {
                v.hide();
            });
        },

        _switchToPrevTab: function() {
            var $prevTabEle = this.element.find('li.current').prev();
            var url = $prevTabEle.attr('data-url');
            var path = $prevTabEle.attr('data-path');

            this._switchToTab(url, path);

        },

        _switchToNextTab: function() {
            var $nextTabEle = this.element.find('li.current').next();
            var url = $nextTabEle.attr('data-url');
            var path = $nextTabEle.attr('data-path');

            this._switchToTab(url, path);
        },

        _createTabBindIframe: function(url, path, title, isCloseBtn) {
            this.tabElements[url] = new TabPanel({
                title: title,
                path: path,
                url: url,
                isCloseBtn: isCloseBtn
            });
        },

        /**
         * 显示指定的tab
         * @param e
         * @private
         */
        _switchToEventHandler: function(e) {
            var thisElement = e.currentTarget;
            var url = thisElement.getAttribute('data-url');
            var path = thisElement.getAttribute('data-path');

            this._switchToTab(url, path);
        },

        /**
         * 移动到前一个tab
         * @param e
         * @private
         */
        _switchToPrevEventHandler: function(e) {
            this._switchToPrevTab();
        },

        /**
         * 移动到后一个tab
         * @param e
         * @private
         */
        _switchToNextEventHandler: function(e) {
            this._switchToNextTab();
        },

        /**
         * 移除一个 tab
         * @param e
         * @private
         */
        _removeTabEventHandler: function(e) {
            var thisElement = e.currentTarget;
            var url = thisElement.getAttribute('data-url');

            this._switchToPrevTab();
            this.tabElements[url].remove();
            delete this.tabElements[url];
        }


    });




    return {

        tabView: null,

        init: function(opts) {
            this.tabView = new TabViewUI();
            this.tabView.render();
        },

        showTab: function(opts) {
            this.tabView.showTab(opts);
        }

    }



	
    
});