/**
 * 客户分类 by siwei.ransw@aliyun-inc.com
 */
define(function(require,exports,module){
   var $ = require("jquery");
   var doc = document;

   var choiceCategory = function(categoryJson,main,subs){
        this.main = $(main);
        this.subs = $(subs);
        this.json = categoryJson;
        this.init();
   };

   choiceCategory.prototype= {
      init : function(){
         var _this = this;
         _this.main.bind("change",function(){
            var _v = $(this).val();
            var _relateSubs = "item_"+_v;
            var _subsItems = _this.json[_relateSubs] ;
            _this.subs[0].options.length = 0;
            if (_subsItems && _subsItems.length > 0) {
                _this.subs.show();
                _this.subs.prop('disabled', false);

                $.each(_subsItems,function(i,item){
                    _this.addOptions(_this.subs[0],item,item);
                });
            } else {
                _this.subs.hide();
                _this.subs.prop('disabled', true);
            }
         })
      },

      addOptions:function(cmb,txt,val) {
            var _option = doc.createElement("option");
            _option.text = txt;
            _option.value = val;
            cmb.options.add(_option);
      }

   }

   module.exports = choiceCategory;

})