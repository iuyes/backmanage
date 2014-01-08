/**
 * abc - 首页UI
 */
define(function(require, exports, module) {
	var $ = require('jquery');
    var Event = require('arale/events/1.1.0/events');

    var fn = require('./fn');
    var NavMenuUI = require('./ui/NavMenuUI');
    var TabViewUI = require('./ui/TabViewUI');
    require('biz/component/plugin.nicescroll')($);
    var doc = document;
    var win = window;
    
    // 默认 iframe 地址
    var defaultIframeUrl = 'http://crm.aliyun-inc.com/search/index.htm';
    
    var globalEvent = function() {
        var event = new Event();

        event.on('showTab', function() {
        	
        	
        });

        event.on('messageDispatch', function(data){
        	
            if (typeof fn[data.fn] != 'undefined') {
                fn[data.fn](data.data);
            }

        });

        return event;
    }();



    var IframeResize = function(){
        var $win = $(win);
        var $B_menubar = $("#B_menubar");
        function resize() {
            var $pageTop = $('#J_page_top');
            var $pageTab = $('#J_page_tab');

            var domWidth = $win.width() < 1200 ? 1200 : $win.width();
            var domHeight = $win.height() < 400 ? 400 : $win.height();
            var topOuterHeight = $pageTop.outerHeight() + $pageTab.outerHeight();
            var footOuterHeight = 0;
            var h = domHeight - topOuterHeight - footOuterHeight;

            // 右侧frame高度设置，多一个面包屑,所以这里要把高度减去
            $(".J_frame_page").height(h - $('#breadCrumb').outerHeight());
            // 左侧菜单高度
            $B_menubar.height(h - 10);
            $B_menubar.niceScroll({cursorborder:"",cursorcolor:"#a4c6ef",boxzoom:false});

        }

        return {
            init: function() {
                resize();
                $win.on('resize', function(){
                    resize();
                });
            }
        };
        
    }();


    function initTabViewUI() {
        TabViewUI.init({
            globalEvent: globalEvent
        });

        // 显示默认首页
        TabViewUI.showTab({
            title: '后台首页',
            path: '后台首页',
            url: defaultIframeUrl,

            // 是否显示关闭按纽
            isCloseBtn: false
        });

        $('#loading').hide();
    }

    function initNavMenuUI(menuData) {
        NavMenuUI.init({
            menuData: menuData,
            subMenuClickCallBack: function(data) {
                $('#loading').show();
                TabViewUI.showTab({
                    title: data.title,
                    path: data.path,
                    url: data.url
                });
                $('#loading').hide();

                // 添加hash
                win.location.hash = (win.location.hash ? data.url : "#" + data.url);
            }

        });


        if (window.location.hash) {
            var hash = window.location.hash.substr(1);
            var menuInfo = NavMenuUI.getMenuInfoByUrl(hash);
            if (menuInfo == 'undefined') {
                return;
            }

            TabViewUI.showTab(menuInfo);
            NavMenuUI.activeLeftMenuLight(menuInfo.url);
        }

    }


	function initMiscUI() {
        // 全屏/非全屏
        $('#J_fullScreen').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $body = $(document.body);
            if ($body.hasClass('fullScreen')) {
                $body.removeClass('fullScreen');
            } else {
                $body.addClass('fullScreen');
            }
        });

        // 刷新页面
        $('#J_refresh').on('click', function(e) {
            e.preventDefault();

            reloadPage();
        });

        IframeResize.init();
    }

    // 重新刷新页面，使用location.reload()有可能导致重新提交
    function reloadPage() {
        var location = win.location;
        location.reload();
        // location.href = location.pathname + location.search + location.hash;
    }
	
	return {
		init: function(opts) {
			
			if (typeof opts.defaultIframeUrl != 'undefined') {
				defaultIframeUrl = opts.defaultIframeUrl;
			}
			
            initTabViewUI();
            initNavMenuUI(opts.menuData)
            initMiscUI();
		}
		
	}
	
});