//工单问题选择模块 by siwei.ransw at 20131128
define(function(require,exports,module){
    var $       = require('$');
    var Dialog  = require('dialog');
    var choice = require('biz/component/plugin.choice');
    var DialogTpl = $("#choiceTpl").html();
    choice($);
    function choiceQustion(ele){
        this.ele = ele;
        this.tpl = DialogTpl;
        this.init();
    }
    choiceQustion.prototype = {
        constructor:"choiceQustion",
        init: function(){
            var me = this,
                ele = $("#"+me.ele),
                eleP = ele.parent(),
                serviceId = eleP.find("input[name=serviceId]"),
                questionTxt = eleP.find('.questionTxt'),
                childId = eleP.find("input[name=childId]");
            //if(!me._ChoiceD){
                me._ChoiceD = new Dialog({
                    trigger:"#" + me.ele,
                    width:600,
                    height:500,
                    zIndex:100000,
                    content:DialogTpl
                });
            //}
        var activateSubmenu =function(row) {
            var $row = $(row),
                submenuId = $row.data("submenuId"),
                $submenu = $row.find('.popover'),
                height = $submenu.outerHeight();
                width = 150;
              $submenu.css({
                display: "block",
                top: -1,
                left: width + 10,
                height:height
            });
            $row.find("a.stlink").addClass("maintainHover");
        }

        var deactivateSubmenu = function(row) {
            var $row = $(row),
               // submenuId = $row.data("submenuId"),
                $submenu = $row.find('.popover');
            $submenu.css("display", "none");
            $row.find("a.stlink").removeClass("maintainHover");
        }

    ele.bind('click',function(e){
        e.preventDefault();
        console.log(me._ChoiceD.element.find(".catetory-menu"))
        me._ChoiceD.element.find(".catetory-menu").menuAim({
            activate: activateSubmenu,
            deactivate: deactivateSubmenu
        });

    });
 
    me._ChoiceD.element.delegate('a','click',function(e){
            e.preventDefault();
            var $this = $(this),
                cid = $this.attr("data-id"),
                pid = $this.attr("data-pid"),
                txt = $this.attr("data-value");
                questionTxt.html(txt);
                serviceId.val(pid);
                childId.val(cid);
                me._ChoiceD.hide();
        })

        }
    }
    module.exports = choiceQustion;
});