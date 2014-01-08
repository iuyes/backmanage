/**
 * abc - 首页UI
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    require('./plugin/jquery-wm/main')($);
    require('./plugin/jquery-wm/main.css');
    
    var win = window;
    
    var fn = {};
    
	// 已打开的窗口
	var openWindow = {};

    /**
     * opts.title
     * opts.url
     */
    fn.window = function(opts) {

    	// 窗口定位在tab菜单下面
    	var getWindowPos = function() {
    		var $win = $(win);
            var domWidth = $win.width();
            var domHeight = $win.height();
    		
    		var topMenuOffset = $('#J_page_top').offset();
    		var tabMenuOffset = $('#J_page_tab').offset();
    		var topMenuHeight = $('#J_page_top').outerHeight();
    		var tabMenuHeight = $('#J_page_tab').outerHeight();
    		
    		return {
                left: 50,
                top: tabMenuOffset.top + 30,
                width: domWidth-100,
                height: domHeight - topMenuHeight - tabMenuHeight
    		};
    		
    	};
    	
    	if (typeof openWindow[opts.url] == 'undefined') {
    		openWindow[opts.url] = $().WM('open', opts.url, "_blank", {
        		title: opts.title, 
        		pos: getWindowPos(),
        		closeWindowCallback: function() {
        			delete openWindow[opts.url];
        		}
        	});
    		
    	} else {
    		openWindow[opts.url].WM('restore');
    	}
    	
    	
    	/*
    	var $w = $().WM('open', opts.url, "_blank", {
    		title: opts.title, 
    		pos: getWindowPos()
    	});
    	*/
    	
    	//$w.WM('ensure_viewable');
    	
    	//$w.WM('maximize');
    	
    	
    	// other jquery extensions that can be used on children windows
    	/*
    	$w.WM('maximize');
    	$w.WM('minimize');
    	$w.WM('raise');
    	$w.WM('close');
		*/
    };

    return fn;

});