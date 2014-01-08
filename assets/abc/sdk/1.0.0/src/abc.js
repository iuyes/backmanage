/**
 * abc sdk 公开方法
 * @author sunhe
 */
(function(abc, mod, Qatrix, global) {
    var win = window;
    var $json = Qatrix.$json;
    var messager;

    /**
     * 打开 abc tab
     * @param cfg
     */
    abc.showTab = function(opts) {

        abc.use('showTab', {
            title: opts.title,
            path: opts.path,
            url: opts.url
        });

    };

    abc.window = function(opts) {
        abc.use('window', {
            title: opts.title,
            url: opts.url
        });
    };

    /**
     * 调用 abc  module
     */
    abc.use = function(fn, opts) {
        if (typeof fn != 'string' || fn == '') {
            return;
        }

        triggerABCEvent({
            fn: fn,
            data: opts
        });
    };

    function triggerABCEvent(data) {
        var msg = $json.encode(data);
        sendParentMessage(msg);
    }

    /**
     * 向abc父iframe发送消息
     * @private
     */
    function sendParentMessage(msg) {
        if (!messager) return;
        messager.send(msg);
    }

    var init = function() {
        /**
         * 初始化 postMessage 监听对象
         */
        function initMessager() {
            if (typeof win.parent == 'undefined') {
                return;
            }

            messager = new mod.Messenger({
                target: parent,
                onmessage: function(data) {
                    output.html(output.html() + ' ' + data);
                }
            });
        }

        initMessager();
        win.ABC = abc;

    }();


})(AliyunBusinessCenter, AliyunBusinessCenter._module, AliyunBusinessCenter._Qatrix, this);