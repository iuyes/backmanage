/**
 * 阿里员工查询
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var Class = require('arale/class/1.1.0/class');
    var AutoComplete = require('arale/autocomplete/1.2.2/autocomplete');
    require('./autocomplete.css');

    var AliUser = Class.create({
        trigger: null,
        autocompleteObj: null,
        queryAliUserApi: '/support/json/query_ali_user.json',

        itemSelectCallBack: function(aliUser){},

        initialize: function(opts) {
            this.trigger = opts.trigger;
            if (typeof opts.itemSelectCallBack != "undefined" && $.isFunction(opts.itemSelectCallBack)) {
                this.itemSelectCallBack = opts.itemSelectCallBack;
            }

            this._createAutocomplete();
        },
        
        _createAutocomplete: function() {
            var self = this;

            this.autocompleteObj = new AutoComplete({
                trigger: self.trigger,
                submitOnEnter: false,
                disabled: false,
                locator: 'data',

                dataSource: function(value, done) {
                    $.ajax({
                        url: self.queryAliUserApi,
                        dataType: 'json',
                        data: {
                            q: value
                        },
                        success: function(data) {
                            done(data);
                        }
                    });

                    return false;
                },

                filter : function(data, query) {
                    var result = [];
                    if (!data) {
                        return result;
                    }

                    $.each(data, function(k, v) {
                        var aliUser = v.name + "(" + v.empId + ")" + " - " + v.depDesc;
                        result.push({
                            matchKey: aliUser,
                            aliUser:{
                                userName: v.name,
                                account: v.account,
                                empId: v.empId,
                                depDesc: v.depDesc
                            }
                        });
                    });

                    return result;
                }

            }).render();

            // 选中事件
            this.autocompleteObj.on('itemSelect', function(data){
                // 运行 itemSelectCallBack 回调函数
                self.itemSelectCallBack(data.aliUser);
            });


        }

    });
    
    
    return AliUser;

});