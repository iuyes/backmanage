/**
 * abc - 页面管理
 */
define(function(require, exports, module) {
	
	var win = window;
	
	var ui = require('./ui');
	
	return {
        init: function(cfg){
        	// abc标识，供iframe子页面判断用
        	win.isABC = true;
            ui.init(cfg);
        }
    };

});