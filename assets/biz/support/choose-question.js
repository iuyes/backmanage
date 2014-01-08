//工单问题选择模块 by siwei.ransw at 20131128
define(function(require,exports,module){
    var $       = require('$');
    var Dialog  = require('dialog');
    var choice = require('biz/component/plugin.choice');
    var DialogTpl = $("#choiceTpl").html();
    require('biz/component/plugin.nicescroll')($);
    require('arale/dialog/1.2.5/dialog.css');
    choice($);
    function choiceQustion(ele,tpl,callback){
        this.ele = ele;
        this.tpl = tpl?tpl:DialogTpl;
        this.callback = callback?callback:null;
        this.init();
    }
    choiceQustion.prototype = {
        constructor:"choiceQustion",
        init: function(){
            var me = this,
                ele = $("#"+me.ele),
                eleP = ele.parent(),
                serviceId = eleP.find(".serviceId"),
                questionTxt = eleP.find('.questionTxt'),
                _content,
                childId = eleP.find(".childId");
            if(!me._ChoiceD){
                me._ChoiceD = new Dialog({
                    trigger:"#" + me.ele,
                    width:500,
                    height:450,
                    zIndex:100000,
                    content:me.tpl
                });
            }
             me._ChoiceD.after('show',function(){
                _content = me._ChoiceD.contentElement;
                _content.find(".catetory-menu").menuAim({
                    activate: activateSubmenu,
                    deactivate: deactivateSubmenu
                });
                _content.find('.catetory-i').niceScroll({cursorborder:"",cursorcolor:"#a4c6ef",boxzoom:false});
             });
           
        var activateSubmenu =function(row) {
            var $row = $(row),
                submenuId = $row.data("submenuId"),
                $submenu = $row.find('.popover'),
                height = $submenu.outerHeight();
                width = 130;
              $submenu.css({
                display: "block",
                top: -1,
                left: width + 10,
                height:height
            });
            $row.find("a.stlink").addClass("maintainHover");
        };

        var deactivateSubmenu = function(row) {
            var $row = $(row),
                $submenu = $row.find('.popover');
            $submenu.css("display", "none");
            $row.find("a.stlink").removeClass("maintainHover");
        }
 
    me._ChoiceD.contentElement.delegate('a','click',function(e){
            e.preventDefault();
            var $this = $(this),
                cid = $this.attr("data-id"),
                pid = $this.attr("data-pid"),
                txt = $this.attr("data-value");
                questionTxt.html(txt);
                me._ChoiceD.hide();
                //给hidden赋值
                serviceId.val(pid);
                childId.val(cid);
                me.serviceVal = pid;
                me.childId = cid;
                if(me.callback){
                   me.callback(pid,cid); 
                }
        })

        }
    }
    module.exports = choiceQustion;
});