/**
 * abc - 首页UI
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var menuUI = require('./ui/menuUI');
	
	var doc = document;
    var win = window;
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
		init: function(cfg) {
			menuUI.init(cfg);
			
            this._resizeContentPage();
		},

        _resizeContentPage: function() {
            resize();
            $win.on('resize', function(){
                resize();
            });
        }
		
	}
	
});