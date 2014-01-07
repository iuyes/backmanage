/*!
 * PHPWind UI Library
 * Wind.like 喜欢组件
 * Author: linhao87@gmail.com
 */
;
(function ($, window, document, undefined) {
	var pluginName = 'like';
	var defaults = {
		id : '', //
		type : '', //
		message : '' //
	};
	var html_like = '<div class="pop_read_like J_pop_like" style="">\
								<a id="J_like_close" href="" class="pop_close_mini">关闭</a>\
								<div class="hd"><span id="J_like_m">管理<a href="">我的喜欢</a></span></div>\
								<!--点击前-->\
								<div class="ct" id="J_like_trigger">\
									<input type="text" class="input" placeholder="说点什么吧～" />\
								</div>\
								<!--点击后-->\
								<div id="J_like_enter" style="display:none;">\
									<div class="ct">\
										<textarea></textarea>\
									</div>\
									<div class="ft">\
										<button class="btn">确认</button><label><input type="checkbox" />告诉我的粉丝</label>\
									</div>\
								</div>\
								<!--结束-->\
								<div class="pop_read_like_arrow"></div>\
							</div>';
	
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		
		this.init();
	}
	
	Plugin.prototype = {
		init : function () {
			
			var _this = this,
				element = _this.element,
				options = _this.options;
			
			$(element).on('click', function (e) {
				e.preventDefault();
				var $this = $(this),
					$wrap = $(html_like),
					role = $this.data('role'); //区分喜欢按钮
				
				_this.close();
				
				var url = role ? $this.data('url') : $this.attr('href');
				
				$.getJSON(url, function (data) {
					if (data.state === 'success') {
					
						if(role) {
							//喜欢主楼
							_this.plus($this.children('.J_like_count'), true);
						}else{
							//喜欢楼层
							_this.plus($this.siblings('a.J_like_user_btn'), false);
						}
					
						$wrap.appendTo($('body')).css({
							left : $this.offset().left - ($wrap.innerWidth() - $this.innerWidth()) / 2,
							top : $this.offset().top - $wrap.innerHeight() - 25
						});
						
						if(data.data > 3) {
							$('#J_like_m').hide();
						}
						
						timer = setTimeout(function(){
							_this.close();
						}, 3000);
						
						var like_enter = $('#J_like_enter');
						
						//点击输入
						$('#J_like_trigger').on('click', function () {
							var $this = $(this),
							top_origin = $wrap.css('top');
							
							$this.hide();
							like_enter.show().find('textarea').focus();
							
							//重新计算垂直距离
							$wrap.css({
								top : Number(top_origin.replace('px', '')) - (like_enter.innerHeight() - $this.innerHeight())
							});
							clearTimeout(timer);
						});
						
						$('#J_like_close').on('click', function (e) {
							e.preventDefault();
							_this.close();
						});
						
					}else if(data.state === 'fail'){
						_this.close();
						resultTip({
							follow : $this,
							msg : data.message[0],
							error : true
						});
					}
					
				});
				
			});
			
		},
		tell : function(){
			//转发
		},
		close : function(){
			//隐藏输入
			$('div.J_pop_like').remove();
		},
		plus : function(elem, avatar){
			//加1
			var c = Number(elem.text());
			elem.slideUp('fast', function(){
				$(this).text(c+1).slideDown();
			});
			
			//主楼显示最近喜欢
			if(avatar) {
				var read_like_list = $('#J_read_like_list');
				read_like_list.show().find('.J_read_like_tit').after('<a href="'+ U_CENTER +'"><img height="48" width="48" src="'+ U_AVATAR +'"><span>'+ U_NAME +'</span></a>');
			}
		}
	};
	
	$.fn[pluginName] = Wind[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}
	
})(jQuery, window);
