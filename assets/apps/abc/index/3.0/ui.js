/**
 * abc - 首页UI
 */
define(function(require, exports, module) {
	var $ = require('jquery');

    var NavMenuUI = require('./ui/NavMenuUI');
    var TabViewUI = require('./ui/TabViewUI');
    var doc = document;
    var win = window;

    var IframeResize = function(){
        var $win = $(win);

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
            $(".menubar").height(h - 10);
        }

        return {
            init: function() {
                resize();
                $win.on('resize', function(){
                    resize();
                });
            }

        }
    }();





    function initTabViewUI() {
        TabViewUI.init();

        // 显示默认首页
        TabViewUI.showTab({
            title: '后台首页',
            path: '后台首页',
            url: '/ABC-demo/build/html/text.html',

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
                
                
                
                $('a.J_menu_leaf').removeClass('current');
                $(data.element).addClass('current');
                
                
            }

        });

        if (window.location.hash) {
            var hash = window.location.hash.substr(1);
            var menuInfo = NavMenuUI.getMenuInfoByUrl(hash);
            if (menuInfo == 'undefined') {
                return;
            }

            TabViewUI.showTab(menuInfo);
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


        IframeResize.init();
    }


	
	return {
		init: function(opts) {
			//menuUI.init(cfg);

            initTabViewUI();
            initNavMenuUI(opts.menuData)
            initMiscUI();
		}
		
	}
	
});