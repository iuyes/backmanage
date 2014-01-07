/**
 * abc - 菜单UI
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var template = require('gallery/artTemplate/2.0.2/artTemplate');
    var Widget = require('arale/widget/1.1.1/widget');
    var Messenger = require('arale/messenger/1.0.2/messenger');

    var iframeWidget = Widget.extend({
        attrs: {
            url: '', // iframe url,
            parentNode: $('#B_frame')[0]
        },

        template: '<iframe width="100%" scrolling="auto" height="100%" frameborder="0" src="<%= url %>" data-url="<%= url %>"></iframe>',

        /**
         * iframe 消息监听对象
         */
        _messenger: null,

        setup: function() {
            var iframeElement = this.element[0];

            this._messenger = new Messenger({
                target: iframeElement,
                onmessage: function(data) {
                    alert(data);
                    //output.html(output.html() + ' ' + data);
                }
            });

            // 初始化时即渲染
            this.render();
        },

        parseElementFromTemplate: function() {
            var url = this.get('url');
            var compiled = template.compile(this.template);
            var templateHtml = compiled({url: url});

            this.element = $(templateHtml);
        },


        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        },

        destroy: function() {
            // 销毁消息监听
            this._messenger.destroy();

            iframeWidget.superclass.destroy.call(this);
        }


    });


    return iframeWidget;

});