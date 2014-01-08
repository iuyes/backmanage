/**
 * abc - 导航菜单UI
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var template = require('gallery/artTemplate/2.0.2/artTemplate');
    var Popup = require('arale/popup/1.1.5/popup');
    var Accordion = require('arale/switchable/1.0.2/accordion');

    /**
     * 导航菜单
     */
    var NavMenuUI = function() {
        var doc = document;
        var win = window;

        // 菜单数据
        var menuData = {};

        // 子菜单数据
        var subMenuData = {};

        // 菜单路径名称
        var menuPathMap = {};

        var initOpenSubMenuId = 0;

        var subMenuClickCallBack = function() {};

        /**
         * 左侧导航菜单
         */
        var LeftMenuUI = function() {

            var $menuEle;

            function _render(menuId) {
                var self = this;

                _renderMenu(subMenuData[menuId]);

                var accordion = new Accordion({
                    element: '#B_menubar',
                    multiple: true,
                    activeTriggerClass : 'current'
                }).switchTo(0);

                // 菜单标题
                $('#subTitlec').html(subMenuData[menuId].name);
            }

            function _renderMenu(menuData) {
                var subMenuHtml = template.render("subContentTpl", menuData);

                $menuEle = $(subMenuHtml);
                $menuEle.appendTo("#B_menubar");

                // 点击叶子节点，打开 右侧tab
                $menuEle.find('a.J_menu_leaf').on('click', function(e) {
                    e.preventDefault();

                    var url = this.getAttribute('data-url');
                    var menuInfo = menuPathMap[url];
                    var path = menuInfo.path;
                    var title = menuInfo.title;

                    subMenuClickCallBack({
                        url: url,
                        path: path,
                        title: title
                    });

                    $menuEle.find('a.J_menu_leaf').removeClass('current');
                    $(this).addClass('current');
                });

            }



            return {
                show: function(menuId) {
                    $('#B_menubar').html('');
                    _render(menuId);
                },

                activeMenuLight: function(url) {
                    $menuEle.find('a.J_menu_leaf').removeClass('current');
                    $menuEle.find('a.J_menu_leaf[data-url="'+ url +'"]').addClass('current');
                }

            };
        }();

        /**
         * 顶部导航菜单
         */
        var TopMenuUI = function() {

            function _render() {
                var self = this;
                $.each(menuData, function(k, v){
                    _renderTopMenu(v);
                });
            }

            function _renderTopMenu(menuData) {
                var topMenuHtml = template.render("topMenuTpl", {menu: menuData});
                var $topMenuHtml = $(topMenuHtml);
                $topMenuHtml.appendTo("#J_B_main_block");

                // 使用 popup 组件渲染
                new Popup({
                    trigger: $topMenuHtml.find('a.J_top_menu_trigger'),
                    element: $topMenuHtml.find('div.J_top_menu_popup'),

                    beforeShow: function() {
                        this.get('trigger').addClass('current');
                    },
                    afterHide: function() {
                        this.get('trigger').removeClass('current');
                    }
                });

                $topMenuHtml.find('a.J_top_menu').on('click', function(e) {
                    e.preventDefault();

                    var subMenuId = this.getAttribute('data-menu-id');
                    LeftMenuUI.show(subMenuId);
                });
            }

            function _event() {

            }

            return {
                init: function() {
                    _render();

                }
            }

        }();



        function initMenuData(opts) {
            menuData = opts.menuData;

            // 生成子菜单数据
            var obj = menuData;
            for (var i in obj) {
                var _item = obj[i].items;
                for (var j in _item) {
                    subMenuData[_item[j].id] = {};
                    subMenuData[_item[j].id]['name'] =  _item[j].name;
                    subMenuData[_item[j].id]['obj'] = _item[j].items;
                }
            }

            // 菜单路径数据
            $.each(obj, function(k, v) {
                var path = v.name;
                $.each(v.items, function(k2, v2) {
                    var path2 = path + " > " + v2.name;
                    if (!initOpenSubMenuId) {
                        initOpenSubMenuId = v2.id;
                    }

                    $.each(v2.items, function(k3, v3) {
                        var path3 = path2 + " > " + v3.name;
                        $.each(v3.items, function(k4, v4) {
                            var path4 = path3 + " > " + v4.name;
                            menuPathMap[v4.url] = {
                                url: v4.url,
                                path: path4,
                                title: v4.name
                            }
                        });
                    });
                });
            });

        }


        return {
            init: function(opts) {
                initMenuData(opts);
                if ($.isFunction(opts.subMenuClickCallBack)) {
                    subMenuClickCallBack = opts.subMenuClickCallBack;
                }

                TopMenuUI.init();
                LeftMenuUI.show(initOpenSubMenuId);
            },

            getMenuInfoByUrl: function(url) {
                return menuPathMap[url];
            },

            activeLeftMenuLight: function(url) {
                LeftMenuUI.activeMenuLight(url);
            }

        }

    }();


    return NavMenuUI;
    
});