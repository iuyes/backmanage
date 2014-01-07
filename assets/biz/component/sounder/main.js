define(function(require,exports,module){
	require('biz/component/sounder/AC');

	module.exports = {
		playRingtone:function(){
			var sounder = document.sounder || window.sounder;
			sounder.playRingtone();
		},
		stopRingtone:function(){
			var sounder = document.sounder || window.sounder;
			sounder.stopRingtone();
		}
	}
});
define('biz/component/sounder/AC',['./AC_RunActiveContent'],function(require, exports, module){
	var AC = require('./AC_RunActiveContent');
	module.exports=AC( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,29,0',
	'width','1','height','1','src',
	'http://static.aliyun.com/flash/backyard-inc/sounder?v=20131219',
	'quality','high','pluginspage',
	'http://www.macromedia.com/go/getflashplayer',
	'allowscriptaccess','always','id','sounder','name',
	'sounder','wmode','transparent','movie',
	'http://static.aliyun.com/flash/backyard-inc/sounder?v=20131219' ); //end AC code

})