define(function(require, exports, module) {
	var $ = require('jquery');
	require('arale/dialog/1.2.4/dialog.css');
	var Dialog = require('dialog');
	var _Jwrap = $("#J-worker-wrap .j-worker-link");

	_Jwrap.each(function(i,item){
		var me = $(item);
			me.__Dialog = new Dialog({
                    trigger:me,
                    width:800,
                    initialHeight:600,
                    hasMask:false,
                    zIndex:100000,
                    content:me.attr("href")
             });
	})
	/*
	_Jwrap.delegate('.j-worker-link','click',function(e){
		e.preventDefault();
		var me = $(this);
		if(!me.__Dialog){
			console.log(9)
			me.__Dialog = new Dialog({
                    trigger:me,
                    width:700,
                    initialHeight:500,
                    zIndex:100000,
                    content:me.attr("href")
             });
			me.__Dialog.show();
		}else{
			me.__Dialog.show();
		}
	});
*/
});