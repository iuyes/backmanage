
;(function() {
	//全局ajax处理
	$.ajaxSetup({
		complete: function(jqXHR) {
			//登录失效处理
		   if(jqXHR.responseText.state === 'logout') {
		   	location.href = GV.URL.LOGIN;
		   }
  	},
  	data : {
  		csrf_token : GV.TOKEN
  	},
		error : function(jqXHR, textStatus, errorThrown){
			//请求失败处理
			alert(errorThrown ? errorThrown : '操作失败');
		}
	});

	if($.browser.msie) {
		//ie 都不缓存
		$.ajaxSetup({
			cache : false
		});
	}
	
	var ajaxForm_list = $('form.J_ajaxForm');
	if( ajaxForm_list.length ) {
		Wind.use('dialog','ajaxForm',function() {

			if($.browser.msie) {
				//ie8及以下，表单中只有一个可见的input:text时，会整个页面会跳转提交
				ajaxForm_list.on('submit', function(e){
					//表单中只有一个可见的input:text时，enter提交无效
					e.preventDefault();
				});
			}

			$('button.J_ajax_submit_btn').on('click', function(e) {
				e.preventDefault();
				var btn = $(this),
					form = btn.parents('form.J_ajaxForm');

				//ie处理placeholder提交问题
				if($.browser.msie) {
					form.find('[placeholder]').each(function() {
						var input = $(this);
						if(input.val() == input.attr('placeholder')) {
							input.val('');
						}
					});
				}

				form.ajaxSubmit({
					url : btn.data('action') ? btn.data('action') : form.attr('action'),			//按钮上是否自定义提交地址(多按钮情况)
					dataType	: 'json',
					beforeSubmit: function(arr, $form, options) {
						btn.prop('disabled',true).addClass('subDisable');
						var gdTitle = $("#gd-title");
						if($.trim(gdTitle.val())==""){
							gdTitle.focus();
							$( '<span class="tips_error">工单标题必填</span>' ).appendTo(btn.parent()).fadeIn( 'fast' ).delay( 1000 ).fadeOut(
								function() {
								btn.parent().find('span').remove();
								btn.removeProp('disabled').removeClass('subDisable');
							});
							return false;
						}
						$( '<span class="tips_loading">提交中……</span>' ).appendTo(btn.parent()).fadeIn( 'fast' );
					},
					success		: function(data, statusText, xhr, $form) {
						var text = btn.text();

						//按钮文案、状态修改
						btn.parent().find('span').remove();

						if( data.state === 'success' ) {
							$( '<span class="tips_success">' + data.message + '</span>' ).appendTo(btn.parent()).fadeIn('slow');
						}else if( data.state === 'fail' ) {
							$( '<span class="tips_error">' + data.message + '</span>' ).appendTo(btn.parent()).fadeIn( 'fast' ).delay( 2000 ).fadeOut();
							btn.removeProp('disabled').removeClass('subDisable');
						}
					}
				});
			});

		});
	}
})();