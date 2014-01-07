/**
 * abc - 菜单UI
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var template = require('artTemplate');
	
	
	// 菜单数据
	var SUBMENU_CONFIG = {};
	
    var USUALL = [], /*常用的功能模块*/
        TEMP = [],
        SUALL = USUALL.concat('-', [ {
            name : '最近操作',
            disabled : true
        } ], TEMP),
        imgpath = '',
        times = 0,
        getdescurl = '',
        searchurl = '',
        token = "",
        hashList = {};

		
	//把三四级的数据提取出来保存在subStore对象里面;
	//subStore:{name:,list:[]}
	var subStore = {};	
	var buildSubStoreData = function () {
		var obj = SUBMENU_CONFIG.list;
		var sublist = function(){
			for (var i in obj) {
				var _item = obj[i].items;
				for (var j in _item) {
					subStore[_item[j].id] = {};
					subStore[_item[j].id]['name'] =  _item[j].name;
					subStore[_item[j].id]['obj'] = _item[j].items;
				}
			}
		}();
	};

	
    var appMenu = function() {
        var doc = document;
        var win = window;
        var menubar = $('.menubar');
        var showPathHtml = $("#breadCrumb");
        
        // 通过二级菜单的id显示左侧二级、三级、四级菜单
        var showLeftMenuList = function(id){
            doc.getElementById("subTitlec").innerHTML = template.render("subTitle",id);
            doc.getElementById("B_menubar").innerHTML = template.render("subContent",id);
        };

        // 当前url的层级,用于面包屑展示
        var  getPathName = function(key){
            var pathObj = SUBMENU_CONFIG.path,
                pathArr = [],
                key = key;
            
            while (pathObj[key]) {
                pathArr.push(pathObj[key]['name']);
                key = pathObj[key]['parentId'];
            }
            
            return pathArr.reverse().join(" > ");   
        };

        // 通过hash找到二级菜单的id,用于hash操作
        var findIdByHash = function(hash) {
            var pathObj = SUBMENU_CONFIG.path,
                hash = hash;
            
            while (pathObj[hash].level != '2') {
                hash = pathObj[hash]['parentId'];
            }
            
            return pathObj[hash]['id'];
        };
		
        // 判断显示或创建iframe
        function iframeJudge(options) {
            var elem = options.elem,
                href = options.href,
                id = options.id,
                path = options.path,
                li = $('#B_history li[data-id='+ id +']');
            
            if (li.length > 0) {
                //如果是已经存在的iframe，则显示并让选项卡高亮,并不显示loading
                var iframe = $('#iframe_'+ id);
                var iframeSrc = iframe.attr("data-url");
                
                $('#loading').hide();
                li.addClass('current');

                /*
                if (iframe[0].contentWindow && iframe[0].contentWindow.location.href !== href ) {
                    iframe[0].contentWindow.location.href = href;
                }
                */
                
                // 刷新iframe
                iframe[0].contentWindow.location.href = iframeSrc;
                
                $('#B_frame iframe').hide();
                iframe.show();
                showTab(li);//计算此tab的位置，如果不在屏幕内，则移动导航位置
                
            } else {
                // 创建一个并加以标识
                var	iframeAttr = {
                    src			: href,
                    id			: 'iframe_' + id,
                    frameborder	: '0',
                    scrolling	: 'auto',
                    height		: '100%',
                    width		: '100%'
                };

                //var iframeGroup = $('<iframe/>').prop(iframeAttr).appendTo('#B_frame');
                var iframeEle = createIframe(iframeAttr);
                
                
                //$(iframeEle).appendTo('#B_frame');
                var _text = elem ? elem.html() : options.text;
                
                var showIframe = function() {
                    $('#B_frame iframe').hide();
                    $('#loading').hide();
                    var li = $('<li tabindex="0"><span><a>'+ _text +'</a><a class="del" title="关闭此页">关闭</a></span></li>').attr({'data-id':id,'data-path':path}).addClass('current');
                    li.siblings().removeClass('current');
                    li.appendTo('#B_history');
                    showTab(li);//计算此tab的位置，如果不在屏幕内，则移动导航位置
                };
                
                // TODO 后端做过 redirect 后 ready 无效, 暂时使用直接运行 showIframe 的方法
                showIframe();
                
                /*
                $(iframeEle.contentWindow.document).ready(function() {
                	showIframe();
                });
                */
            }
        }

        function createIframe(cfg) {
            var iframeEle = doc.createElement("iframe");
            iframeEle.setAttribute("src", cfg.src);
            iframeEle.setAttribute("data-url", cfg.src);
            iframeEle.setAttribute("id", cfg.id);
            iframeEle.setAttribute("frameborder", cfg.frameborder);
            iframeEle.setAttribute("scrolling", cfg.scrolling);
            iframeEle.setAttribute("height", cfg.height);
            iframeEle.setAttribute("width", cfg.width);
            
            doc.getElementById('B_frame').appendChild(iframeEle);
            return iframeEle;
        }
        
        function createMenu(pid) {
            var html = template.render("topMenuList", SUBMENU_CONFIG);
            doc.getElementById("J_B_main_block").innerHTML = html;
			
            //为菜单添加对应的class
            //var classArr = ["business-nav","customer-nav","charging-nav","money-nav","companion-nav","other-nav","del-nav"],
            var navLinks = $('#J_B_main_block li').find('.topMenuLists'),
                i = 0;
            	
            $.each(navLinks, function(k, v) {
            	
            	var $ele = $(v),
            	    $ep = $ele.parent();
            	//$ele.addClass(classArr[i]);
            	$ep.on('mouseover', function(e) {
            		var $this = $(this);
            			//menuTopWidth = $this.width();
            		$(this).addClass('current');
            		if ($this.find('div.t-subMenu').length > 0) {
                        var $subMenu = $this.find('div.t-subMenu');
                            //menuSubWidth = $subMenu.width();
                        //if (menuTopWidth > menuSubWidth) {
                           // $subMenu.css("width", menuTopWidth);
                       // }
                        $subMenu.show();
              	    }
            	});
				
            	$ep.on('mouseout', function(e) {
                    $(this).removeClass('current');
            		if ($(this).find('div.t-subMenu').length > 0) {
              		    $(this).find('div.t-subMenu').hide();
            		}
            	});
            	
                i++;
            });
            
            $(".t-subMenu").find('p').on('click', function(e){
            	e.preventDefault();

                var _o = subStore[$(this).attr('data-menu-id')];
                if (_o) {
                    showLeftMenuList(_o);
                }
            });
            
            // 初始化点击
            $("div.t-subMenu").eq(0).find('a').eq(0).click();
        }

        function initEvent() {
			/*
			// iframe 加载事件
            $('#iframe_default').load(function() {
				console.log('11');
			
                $('#loading').hide();
                !win.location.hash?$(this).show():$(this).hide();
            });
			*/
            
           // $(win).on('resize', adjustBodySize);
            //adjustBodySize();
            menuEvent();
        }

        function menuEvent() {
            // 一级导航点击
            $('#J_B_main_block').on('click','a',function(e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this),
                    data_id = $this.attr('data-id'),
                    html = [],
                    B_menubar = $('#B_menubar');

                //$this.parent().addClass('current').siblings().removeClass('current');
                $.each(SUBMENU_CONFIG.list, function(k,v){
                    if (v.id == data_id) {
                        data_list = v;
                        return;
                    }
                });
                	
                if (B_menubar.attr('data-id') == data_id) {
                    return false;
                }
            });
            
            //左侧三级标题点击
            $('#B_menubar').on('click','a.J_menu_title',function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var thisMenuBar = $(this),
                     _dt = thisMenuBar.parent(),
                     _dd = _dt.next('dd');
                
                // 子菜单显示&隐藏
                if (_dd.length) {
                    _dt.toggleClass('current');
                    _dd.toggle();

                    return false;
                } else {
                    return false;
                }
            });

            // 左边四级链接点击
            $('#B_menubar').on('click','a.J_menu_list',function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var thisMenuBar = $(this),
                    _dt = thisMenuBar.parent(),
                    _dd = _dt.next('dd'),
                    data_id = thisMenuBar.attr('data-id'),
                    li = $('#B_history li[data-id='+ data_id +']'),
                    href = this.href,
                    pheft = thisMenuBar.attr("data-url"),
                    menuState = thisMenuBar.attr('data-state'),
                    getPath = getPathName(pheft);
                
                
                // 如果是即将下线菜单,显示提示层
                if (menuState == 'comingoff') {
                	showXbox(pheft);
                	return;
                }
                
                //高亮
                $("a.J_menu_list").removeClass('current');
                thisMenuBar.addClass('current');

                $('#loading').show().focus();
                $('#B_history li').removeClass('current');
               
                
                //显示面包屑
                //showPathHtml.html();

            	iframeJudge({
                    elem : thisMenuBar,
                    href : href,
                    id : data_id,
                    path: getPath
                });
                
                // 添加hash by ransiwei 20130413
                win.location.hash = (win.location.hash ? pheft : "#" + pheft);
            });

            // 顶部点击一个tab页
            $('#B_history').on('click focus','li',function(e) {
                e.preventDefault();
                e.stopPropagation();
                var data_id = $(this).data('id'),
                    path = $(this).data('path');
                $(this).addClass('current').siblings('li').removeClass('current');
                showPathHtml.html(path);
                $('#iframe_'+ data_id).show().siblings('iframe').hide();//隐藏其它iframe
            });

            // 顶部关闭一个tab页
            $('#B_history').on('click','a.del',function(e) {
                e.stopPropagation();
                e.preventDefault();
                var li = $(this).parent().parent(),
                    prev_li = li.prev('li'),
                    data_id = li.attr('data-id');

                li.hide(60,function() {
                    $(this).remove();//移除选项卡
                    $('#iframe_'+ data_id).remove();//移除iframe页面
                    var current_li = $('#B_history li.current');
                    //找到关闭后当前应该显示的选项卡
                    current_li = current_li.length ? current_li : prev_li;
                    current_li.addClass('current');
                    showPathHtml.html( current_li.data("path"));
                    cur_data_id = current_li.attr('data-id');
                    $('#iframe_'+ cur_data_id).show();
                });
            });

            // 刷新
            $('#J_refresh').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var id = $('#B_history li.current').attr('data-id'),iframe = $('#iframe_'+ id);
                
                if (iframe[0].contentWindow) {
                    var iframeSrc = iframe.attr("src");
                    iframe[0].contentWindow.location.href = iframeSrc; 
                    //common.js
                    //reloadPage(iframe[0].contentWindow);
                }
                
            });

            // 全屏/非全屏
            $('#J_fullScreen').toggle(function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(document.body).addClass('fullScreen');
            },function(){
                $(document.body).removeClass('fullScreen');
            });

            // 下一个选项卡
            $('#J_next').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                var ul = $('#B_history'),
                    current = ul.find('.current'),
                    li = current.next('li');

                showTab(li);
            });

            // 上一个选项卡
            $('#J_prev').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                var ul = $('#B_history'),
                    current = ul.find('.current'),
                    li = current.prev('li');
                showTab(li);
            });

        }

        /**
         * 显示即将下线菜单的提示框
         */
        function showXbox(url) {

        	seajs.use(['arale/dialog/1.0.2/dialog', 'arale/dialog/1.0.2/dialog.css'], function(Dialog) {
        	    
        		new Dialog({
        	        content: '<div style="padding:50px;font-size:14px;">' +
        	        	        '<p>该功能将在<span style="color:red">2013年7月下线</span>。如要继续访问此功能，<a style="color:blue" href="'+ url +'" target="_blank">请点击这里</a>。</p>' + 
        	        	        '<p>如有疑问请直接反馈给孙颖,邮箱地址: shadow.suny@alibaba-inc.com</p>' + 
        	        	     '</div>',
        	        width : 550
        	    }).show();
        	});
        	
        }
        



        // 显示顶部导航时作位置判断，点击左边菜单、上一tab、下一tab时公用
        function showTab(li) {
            if (li.length) {
                var ul = $('#B_history'),
                    $prevEle = $('#J_prev'),
                    $nextEle = $('#J_next'),
                    li_offset = li.offset(),
                    li_width = li.outerWidth(true),
                    next_left = $nextEle.offset().left - 9,//右边按钮的界限位置
                    prev_right = $prevEle.offset().left + $prevEle.outerWidth(true);//左边按钮的界限位置

                // 如果将要移动的元素在不可见的右边，则需要移动
                var distance = 0;
                if (li_offset.left + li_width > next_left) {
                    distance = li_offset.left + li_width - next_left;// 计算当前父元素的右边距离，算出右移多少像素
                    ul.animate({left:'-='+distance},200,'swing');
                } else if (li_offset.left < prev_right) {// 如果将要移动的元素在不可见的左边，则需要移动
                    distance = prev_right - li_offset.left;// 计算当前父元素的左边距离，算出左移多少像素
                    ul.animate({ left:'+='+distance },200,'swing');
                }

               li.trigger('click');
            }
        }

        // 根据hash加载页面 by ransiwei 20130409
        function loadPageByhash() {
            if (window.location.hash) {
                var hash = window.location.hash.substr(1);
                if (typeof SUBMENU_CONFIG.path[hash] == 'undefined') {
                	return;
                }
                
                var sid = findIdByHash(hash),
                    obj = subStore[sid],
                    cid = SUBMENU_CONFIG.path[hash]['id'],
                    cpath = getPathName(hash);
                
                showLeftMenuList(obj);
                showPathHtml.html(cpath);
                $("#J_menu_list_"+cid).addClass('current');
                if (SUBMENU_CONFIG.path[hash]) { 
                    iframeJudge({
                        elem:null,
                        id: cid,
                        href:hash,
                        path:cpath,
                        text:SUBMENU_CONFIG.path[hash].name
                    });
                }
            } else {
			
				// 显示默认iframe
				$('#loading').hide();
				$('#iframe_default').show();
			}

        }
 
        return {
            init: function() {
                initEvent(); 
                createMenu();
                loadPageByhash();
            }
        };
        
    }();
    
	return {
		init: function(cfg){
			SUBMENU_CONFIG = cfg.menuData;
			buildSubStoreData();
			
			appMenu.init();
		}
	};
	
    
});