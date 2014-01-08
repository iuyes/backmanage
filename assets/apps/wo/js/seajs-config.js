/**
 * seajs config
 */
(function(){

    seajs.config({
        base: '/assets',
        alias: {
            '$'             : 'gallery/jquery/1.10.2/jquery',
            '$-debug'       : 'gallery/jquery/1.10.2/jquery-debug',
            'jquery'        : 'gallery/jquery/1.10.2/jquery',
            'jquery-debug'  : 'gallery/jquery/1.10.2/jquery-debug',
            'artTemplate'   : 'gallery/artTemplate/2.0/artTemplate',
            'dialog'        : 'arale/dialog/1.1.3/dialog',

            '_'             : 'gallery/underscore/1.4.3/underscore',
            'underscore'    : 'gallery/underscore/1.4.3/underscore',
            'backbone'      : 'gallery/backbone/0.9.10/backbone',
            'backbone-debug': 'gallery/backbone/0.9.10/backbone-debug'
        },

        //map: mapRules,
        preload: [
          //'libs/seajs/2.1.1/seajs-text',
          'libs/seajs/2.1.1/seajs-style'
        ],

        'map': [
            [ /^(.*\.(?:css|js))(.*)$/i, '$1?201308301020' ]
        ]


    });

})();
