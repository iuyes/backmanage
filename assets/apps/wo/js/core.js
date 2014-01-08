(function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&/6.0/.test(navigator.userAgent)){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var prop=function(n){return n&&n.constructor==Number?n+'px':n;},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild);});}return this;};})(jQuery);

var guid = function(){return 'new_'+ new Date().getTime()};
var currentEditIndex;//弹出编辑框后记住当前是哪一题
//obj:弹出来的对象(只限于本页面中Element),callback:回调函数
function popping(obj,callback,argus){
		closePopp();
		var maskHeight = $(document).height();  
		var maskWidth = $(window).width();  
		$('<div id="mask"></div>').css({'width':maskWidth,'height':maskHeight}).appendTo('body').css({position:"absolute",left:'0',top:'0',display:'none','z-index':'9998'});  
		//$('#mask').fadeIn(200);      
		$('#mask').fadeTo("fast",0.3).click(function(){
			closePopp();
		});
		
		$('.close').live('click',function(){
			closePopp();
		});   
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		var winH = $(window).height();  
		var winW = $(window).width();  
		var t = $(obj).clone();
		t.appendTo('body').addClass('current-box').css({position:'fixed','z-index':'9999'});
		t.css('top',winH/2 - $(obj).height()/2).css('left', winW/2-$(obj).width()/2).show();
		if( $.browser.msie && $.browser.version == "6.0") {
			$('#mask').bgIframe();
			var top = document.documentElement.scrollTop +  $(obj).height()/2;
			t.css({position:'absolute',top:top+'px'});
			$(window).scroll(function(){
				t.css({position:'absolute',top:top+'px'});
			});
		}
		t.find("input[type=text],textarea").addClass('input');
		if(callback){callback.call(obj);}
		try{
			$( ".current-box" ).draggable({handle:'.h1',cursor:'move'});
		}catch(e){
		}
	}
	function closePopp(){
		$(".setup-box").hide();
		$("#mask,.current-box").remove();
	 }
				
	$('a.popping').click(function(e){
		e.preventDefault();
		var target = $(this).attr("href");
		popping(target);
	});

//关闭弹出窗口
function closePopp(){
	$(".setup-box,#mask").hide();
	$(".current-box").remove();
}
/*
此方法依赖jquery.js和jquery.bgifrmae(); jquery.bgifrmae已放入jquery.ui.js中
使用方法
<a href="#id" class="popping">点我弹出</a>
只要a标签加入了class='popping',点击就会自动弹出它的href,href只限于本页面当中的某个元素的ID,如:
<div id="" style="display:none">我是弹出层</div>

至于弹出层的样式,需要自行定义

自定义弹出方式
<a href="javascript:;" onclick="popping('#id')">
*/


//绑定页面中数据
function bindView(o){
	var o = $.isPlainObject(o)?o:$.parseJSON(o),isNew=false;
	var $template = $('#template .askBox').clone();
	var num = !currentEditIndex?$('#preview .askBox').size():currentEditIndex+1;
	//$template.find('h2').html('<span class="s2 mr5 f14">'+(num+1)+'.</span><span class="f14 b mr5">'+o['title']+'</span>');
	$template.find('h2').html('<span class="f14 b mr5">'+o['title']+'</span>');
	$template.find(":hidden[name='uniqueID']").val(function(){
		o['uniqueID']==''?guid():o['uniqueID'];//如果是新增那么给个脚本产生的uniqueID
	});
	if(o['uniqueID']==''){
		o['uniqueID'] = guid();
		isNew = true;//证明是新增,不是编辑
	}
	$template.find(":hidden[name='uniqueID']").val(o['uniqueID']);
	$template.find(":hidden[name^='form_topic']").val(JSON.stringify(o));
	//console.log(JSON.stringify(o));
	var ul = $template.find('ul');
	if( o['type']=='0' || o['type']=='1'){//单选或多选
		var now = guid(),
			type = o['type']=='0'?'radio':'checkbox';
		for(var i in o["value"]){
			li = $("<li><label><input type=\""+type+"\" name=\""+now+"\" />"+ o["value"][i] +"</label></li>");
			if(o["is_custom"][i] == '1'){
				li.append('<input type="text" class="custom input" style="margin:0 3px;" />');
			}
			ul.append(li);
		}
	}else if( o['type']=='2' ){//单行
		ul.append("<li><input type=\""+(o["is_password"]=='1' ? 'password' : 'text')+"\" name=\"default_value\" class=\"input input_wb\" value=\""+o["default_value"]+"\"/></li>");
	}else if( o['type']=='3' ){
		ul.append("<li><textarea name=\"default_value\" class=\"textarea\">"+ o["default_value"] +"</textarea></li>");
	}else if( o['type']=='4' ){//下拉
		var parent = $("<select><option value=\"\">请选择</option></select>"),child = $("<select><option parent_id=\"\">请选择</option></select>");
		for(var i in o['value']){
			parent.append('<option value="'+o['id'][i]+'">'+o['value'][i]+'</option>');
			for(var j in o['child'][i]){
				child.append('<option value="'+o['child'][i][j]["child_id"]+'" parent_id = "'+ o['child'][i][j]["parent_id"] +'">'+o['child'][i][j]["child_value"]+'</option>');
			}
		}
		ul.append($("<li>").append(parent).append(child));
		bindSelect(parent,child);
	}else if( o['type']=='5' ){//附件上传
		ul.append("<li><input type=\"file\" name=\"default_value\" class=\"input input_wb\"/></li>");
	}
	ul.find("input[name='default_value'],textarea[name='default_value']").focus(function(){
		if($(this).val()==o["default_value"]){
			$(this).val('');
		}
		}).blur(function(){
		if($(this).val()==''){
			$(this).val(o["default_value"]);
		}
	});
	if(o['layout_type']=='1'){//如果选择模排，添加使模排样式
		ul.addClass('horizontal cc');
	}
	if(isNew || currentEditIndex==undefined ){
		$template.appendTo('#preview').show();//最终添加一个预览
	}else{
		var editBox = $("#preview .askBox").slice(currentEditIndex,currentEditIndex+1);
		$template.insertAfter(editBox).fadeIn(200);
		editBox.remove();
	}
}

//绑定下拉框
function bindSelect(parent,child){
	if(child.children().size()<1){
		child.hide();
	}
	var hidchild = $('<select style="display:none"></select>');
	child.children().clone().appendTo(hidchild);
	child.empty().after(hidchild);
	var id = parent[0].options[0].value;;
	hidchild.find("option").each(function(i,j){
			if($(j).attr('parent_id')==id){
				$(j).clone().appendTo(child);
			}
	});
	parent.change(function(){
		child.empty();
		var id = this.options[this.selectedIndex].value;
		hidchild.find("option").each(function(i,j){
			if($(j).attr('parent_id')==id){
				$(j).clone().appendTo(child);
			}
		});
	});
}
	
function html_encode(str) {   
  var s = "";   
  if (str.length == 0) return "";   
  s = str.replace(/&/g, "&gt;");   
  s = s.replace(/</g, "&lt;");   
  s = s.replace(/>/g, "&gt;");   
  //s = s.replace(/ /g, "&nbsp;");   
  s = s.replace(/\'/g, "&#39;");   
  s = s.replace(/\"/g, "&quot;");   
  s = s.replace(/\n/g, "<br>");
  return s;   
}  

;(function($) {
    var map = new Array();
    $.Watermark = {
        ShowAll: function() {
            for (var i = 0; i < map.length; i++) {
                if (map[i].obj.val() == "") {
                    map[i].obj.val(map[i].text);
                    map[i].obj.css("color", map[i].WatermarkColor);
                } else {
                    map[i].obj.css("color", map[i].DefaultColor);
                }
            }
        },
        HideAll: function() {
            for (var i = 0; i < map.length; i++) {
                if (map[i].obj.val() == map[i].text)
                    map[i].obj.val("");
            }
        }
    }

    $.fn.Watermark = function(text, color) {
        if (!color)
            color = "#aaa";
        return this.each(
			function() {
			    var input = $(this);
			    var defaultColor = input.css("color");
			    map[map.length] = { text: text, obj: input, DefaultColor: defaultColor, WatermarkColor: color };
			    function clearMessage() {
			        if (input.val() == text)
			            input.val("");
			        input.css("color", defaultColor);
			    }

			    function insertMessage() {
			        if (input.val().length == 0 || input.val() == text) {
			            input.val(text);
			            input.css("color", color);
			        } else
			            input.css("color", defaultColor);
			    }

			    input.focus(clearMessage);
			    input.blur(insertMessage);
			    input.change(insertMessage);

			    insertMessage();
			}
		);
    };
})(jQuery);

$(function(){
		$('.popInputList').live('mouseover',function(){
			$(this).sortable({ axis: 'y' ,cursor: 'move',placeholder: 'ui-state-highlight'});//
		});
		$('.popInputList div').live('mouseover',function(){
			$(this).sortable({ axis: 'y' ,cursor: 'move',placeholder: 'ui-state-highlight'});//选项框排序
		});
		$('#j_showMore').click(function(){
			if($("#setupForm").css('display')=='none'){
				$("#setupForm").css('display','');
				$('#j_showMore').val('隐藏更多设置');
			}else{
				$("#setupForm").css('display','none');
		$('#j_showMore').val('更多细节设置');
			}
			
		});
		$('#btnSave').click(function(){
			$('#setupForm').hide(200);
		});
		
		
		$('.setup-box,#preview .askBox').bgiframe();
		
		
		$('a.popping').click(function(e){
			e.preventDefault();
			var target = $(this).attr("href");
			popping(target);
		});
		
		
		//增加一个选项
		$('a.add').live('click',function(){
			var box = this.title,ul = $('.current-box').find('div.popInputList');
			if(box=='j_dropdown'){
				ul.append('<div class="mb5 parent">'+ 
							'<input type="hidden" name="id" value="'+guid()+'" />'+
							'<input type="text" class="input mr10" style="width:242px;" value="" name="value" />'+ 
							'<a href="javascript:;" class="addChild mr5">[增加子项]</span><a href="javascript:;" class="mr5 adelA">[删除]</a></div>');//下拉选项
			}else{
				ul.append('<div class="mb5"><input type="hidden" name="id" value="'+guid()+'" /><input type="text" value="" class="input mr10" style="width:242px;" name="value" /><a href="javascript:;" class="mr5 adelA">[删除]</a><label><input type="checkbox" name="is_custom" value="1" />支持输入其他内容</label></div>');
			}
			var target = $('.current-box');
			target.find("input[name='maximum']").val(ul.children().size());
			target.find("input[name='minimum']").val(1);
		});
		
		//添加一个子选项(用于下拉题)
		$('a.addChild').live('click',function(){
			var $el = $(this).parent();
			var parentId = $el.find(":hidden[name=id]").val();
			$el.append('<div class="mb5 child" style="padding-left:30px;margin-top:5px;">'+
			'<input type="hidden" value="'+guid()+'" name="child_id" />'+
			'<input type="text" class="input mr10" value="" name="child_value" style="width:212px;" />'+
			'<a href="javascript:;" class="mr5 childDel">[删除]</a>'+
			'<input type="hidden" value="'+parentId+'" name="parent_id" /></div>');
		});
		
		//删除一个选项
		$('a.adelA').live('click',function(){//删除一个选项
			if(confirm('删除后此选项的问卷结果也会清空，真的要删除吗？')){
				$(this).parentsUntil('div.popInputList').remove(); 
		var target = $('.current-box');
				target.find("input[name='maximum']").val($('.current-box div.popInputList').children().size());
				target.find("input[name='minimum']").val(1);
			}   
		});

		//删除一个子选项(用于下拉题)
		$('a.childDel').live('click',function(){
			if(confirm('删除后此选项的问卷结果也会清空，真的要删除吗？')){
				$(this).parent().remove(); 
			}   
		});
		
		//提交form时产生预览数据
		$(".setup-box form button[type='submit']").live('click',function(e){
			e.preventDefault();
			var form = $(this).parents('form');
			if(validateForm(form)==false){return false;}
			form.find(':checkbox').each(function(i,j){
				if(!j.checked){//jquery serializeArray时会过滤过没有选中的checkbox
					$(j).after('<input type="hidden" name="is_custom" value="0">');
				}else{
					$(j).after('<input type="hidden" name="is_custom" value="1">');
				}
				$(j).remove();
			});
			
			form.find(':text').each(function(i,j){
				if(j.value==''){//jquery serializeArray时会过滤值为''的input text
					j.value = ' ';
				};
			});
			
			form.find(':hidden[name=id]').each(function(i,j){
				if(j.value==''){
					j.value = guid();
				};
			});
			var uniqueID = form.find(":hidden[name='uniqueID']").val();//找出唯一ID用于判断是新增还是编辑
			
			var fields = form.serializeArray();
			var o = {};
			$.each( fields, function(i, field){
				if ( o[field.name] ) {
					if (!o[field.name].push) {
						o[field.name] = [o[field.name]];
					}
					o[field.name].push(field.value || '');
				} else {
					o[field.name] = field.value || '';
				}
			});

			if (typeof o['default_value'] == 'string') {
					o['default_value'] = html_encode(o['default_value']);
			}

			if($(".current-box").hasClass("j_checkbox")){
				if (typeof o['id'] == 'string') {
					o['id'] = [o['id']];
					o['value'] = [o['value']];
					o['is_custom'] = [o['is_custom']];
				}
			}

			if($(".current-box").hasClass("j_dropdown")){//如果是下拉选项，那么对象要经过改造然后再序列化成特别的json格式
				delete o['child_id'];
				delete o['child_value'];
				delete o['parent_id'];
				o['child'] = [];
				$('.current-box .popInputList > div').each(function(i,li){
					var arr = [];
					$(li).find('div').each(function(i,p){
						var child_id = $(p).find("input[name='child_id']").val();
						var child_value = $(p).find("input[name='child_value']").val();
						var parent_id = $(p).find("input[name='parent_id']").val();
						var c = {
							child_id:child_id,
							child_value:child_value,
							parent_id:parent_id
						};
						arr.push(c);//添加子项的数据
					});
					o['child'].push(arr);//
					
				});
			}
			closePopp();
			bindView(o);
		});
		
		
		$('a.box-edit').live('click',function(e){//编辑预览题目
			e.preventDefault();
			currentEditIndex = $(this).parent().parent().index();
			var jsonStr = $(this).parent().parent().find(":hidden[name^='form_topic']").val();//找到存放json数据的隐藏域
			var o = $.parseJSON(jsonStr);
			var openDiv = '',id = $(this).parent().parent().find(":hidden[name='id']").val();
			if(o['type']=='0'){
				openDiv = "#j_radio";
			}else if(o['type']=='1'){
				openDiv = "#j_checkbox";
			}else if(o['type']=='2'){
				openDiv = "#j_textbox";
			}else if(o['type']=='3'){
				openDiv = "#j_textarea";
			}else if(o['type']=='4'){
				openDiv = "#j_dropdown";
			}else if(o['type']=='5'){
				openDiv = "#j_upload_file";
			}
			this.href = openDiv;
			popping($(openDiv),function(){
				var target = $('.current-box');
				//target.addClass('edit-box');
				target.find(":hidden[name='uniqueID']").val(o['uniqueID']);//保存uniqueID以标识是添加还是编辑
				target.find("input[name='title']").val(o['title']);
				//target.find("input[name='summary']").val(o['summary']);
				target.find("textarea[name='summary']").val(o['summary']);
				target.find("input[name='is_required'][value='"+o['is_required']+"']").attr("checked","checked");
				target.find("input[name='is_password'][value='"+o['is_password']+"']").attr("checked","checked");
				target.find("input[name='layout_type'][value='"+o['layout_type']+"']").attr("checked","checked");
				target.find("input[name='maximum']").val(o['maximum']);
				target.find("input[name='minimum']").val(o['minimum']);
				target.find('input[type="radio"][name^="extend"]').each(function(i,j){
					if ($(j).val() == o[$(j).attr("name")]) {	
						$(j).attr("checked","checked");
					} else {
						$(j).attr("checked", false);
					}
				});

				target.find('input[type="checkbox"][name^="extend"]').each(function(i,j){
					if ($(j).val() == o[$(j).attr("name")]) {
						alert(1);
						$(j).attr("checked","checked");
					} else {
						alert(0);
						$(j).attr("checked","");
					}
				});
				target.find('input[type!="radio"][type!="checkbox"][name^="extend"]').each(function(i,j){
					$(j).val(o[$(j).attr("name")]);
				});

				//target.find("input[name='default_value']").val(o['default_value']);
				target.find("input[name='default_value'],textarea[name='default_value']").val(o['default_value']);
				for(var i in o['value'] ){
					var el = '';
					if(o['type']=='0' || o['type']=='1'){
						el = '<div class="mb5">'+
								'<input type="hidden" value="'+o['id'][i]+'" name="id">'+
								'<input type="text" name="value" class="input mr10" style="width:242px;" value="'+o['value'][i]+'" /><a href="javascript:;" class="mr5 adelA">[删除]</a>'+
								'<label><input type="checkbox" value="1" name="is_custom"' +(o['is_custom'][i]=='1'?'checked="checked"':'')+'>支持输入其他内容</label>'+
								'</div>';
					}else if(o['type']=='4'){//编辑时动态添加下拉选项
						el = $('<div class="mb5 parent">'+ 
							'<input type="hidden" name="id" value="'+o['id'][i]+'" />'+
							'<input type="text" name="value" class="input mr10" style="width:242px;" value="'+o['value'][i]+'" />'+ 
							'<a href="javascript:;" class="addChild">[增加子项]</a><a href="javascript:;" class="mr5 adelA">[删除]</a></div>');
						for(var j in o['child'][i]){//子选项
							var parentId = el.find(":hidden[name=id]").val();
							el.append('<div class="mb5 child" style="padding-left:30px;">'+
										'<input type="hidden" value="'+o['child'][i][j]["child_id"]+'" name="child_id" />'+
										'<input type="text" value="'+o['child'][i][j]["child_value"]+'" class="input mr10" style="width:212px;" name="child_value" />'+
										'<a href="javascript:;" class="childDel">[删除]</a>'+
										'<input type="hidden" value="'+parentId+'" name="parent_id" /></div>');
						}
					}
					target.find("div.popInputList").append(el);
				}
				
				
				if(o['type']=='2' || o['type']=='3'){//单行和多行也需要有一个id隐藏域
					target.find(":hidden[name='id']").val(o['id']);
				}
			});
		});
		
		$('a.box-del').live('click',function(e){
			e.preventDefault();
			if(confirm("真的要删除此项吗？")){
				$(this).parent().parent().remove();
			}
		});
		
		
		function validateForm($form){
			var flag = true;
			var title = $form.find("input[name='title']"),
				type = $form.find("input[name='type']"),
				summary = $form.find("input[name='summary']"),
				maximum = $form.find("input[name='maximum']"),
				minimum = $form.find("input[name='minimum']"),
				default_value = $form.find("input[name='default_value']"),
				value = $form.find("input[name='value']"),
				child_value = $form.find("input[name='child_value']");
			if(title.size() > 0 && $.trim(title.val())==''){
				alert('请填写标题!');title.focus();return false;
			}
			if(summary.size() > 0 && $.trim(summary.val())==''){
				alert('请填写说明!');summary.focus();return false;
			}
			if((type.val() == 0 || (type.val() == 4 && $form.find("input[name='extend1']:checked").val() == 0)) && value.size() < 2){
				alert('请至少填写两个选项!');return false;
			}
			if(type.val() == 1 && value.size() < 1) {
				alert('请至少填写一个选项!');return false;
			}
			if(maximum.size() > 0 && (maximum.val()==''|| isNaN(maximum.val()))){
				alert('请填写正确的最多选择数量!');maximum.focus();return false;
			}
			if(minimum.size() > 0 && (minimum.val()=='' || isNaN(minimum.val()))){
				alert('请填写正确的最少选择数量!');minimum.focus();return false;
			}
			if(minimum > maximum){
				alert('最多选择数不能小于最少选择数!');minimum.focus();return false;
			}
			if(value.size()>0){
				var past = true;
				for(var i=0,j=value.size();i<j;i++){
					if($.trim(value.get(i).value)==''){
						past=false;value.get(i).focus();
					}
				}
				if(!past){
					alert('选项不能为空!');return false;
				}
			}
			if(child_value.size()>0){
				var past = true;
				for(var i=0,j=child_value.size();i<j;i++){
					if($.trim(child_value.get(i).value)==''){
						past=false;child_value.get(i).focus();
					}
				}
				if(!past){
					alert('子选项不能为空!');return false;
				}
			}
			if(summary.size() > 0 && (isNaN(maximum) || isNaN(minimum))){
				alert('最大数和最小数只能是数字!');minimum.focus();return false;
			}
			if(summary.size() > 0 && maximum <= minimum){
				alert('最大选择数必须大于最少选择数!');maximum.focus();return false;
			}
		}
		
});
