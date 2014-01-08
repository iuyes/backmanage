/**
 * abc - TaskBar UI
 */
define(function(require, exports, module) {

    var $ = require('jquery');
    var Widget = require('arale/widget/1.1.1/widget');

    var TaskBarUI = Widget.extend({

        attrs: {
            title: '',
            path: '',
            url: ''
        },

        events: {
            'click .taskTab': 'showTaskContent'
        },

        bars:[],

        setup: function() {

            this.render();

        },

        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        },

        /**
         *
         */
        appendTaskBar: function() {


        },

        /**
         *
         */
        removeTaskBar: function() {


        },

        /**
         *
         */
        showTaskContent: function(opts) {
            var url = opts.url;
            var title = opts.title;

            if (typeof this.bars[url] != 'undefined') {


            }

        },

        /**
         *
         */
        closeTaskContent: function() {




        }




    });






    return TaskBarUI;








});