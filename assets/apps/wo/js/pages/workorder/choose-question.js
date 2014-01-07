//工单问题选择模块 by siwei.ransw at 20131128
define(function(require,exports,module){
	require('apps/wo/css/choose-question.css');
	var $ 		= require('$');
	var Dialog 	= require('dialog');
	var choice = require('biz/component/plugin.choice');
	var DialogTpl = $("#choiceTpl");
	choice($);
	function choiceQustion(ele){
		this.ele = ele;
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

			var _ChoiceD = new Dialog({
				trigger:"#" + me.ele,
				width:600,
				height:500,
				zIndex:100000,
				content:DialogTpl
			});

         var $menu = $(".catetory-menu");

        var activateSubmenu =function(row) {
            var $row = $(row),
                submenuId = $row.data("submenuId"),
                $submenu = $("#" + submenuId),
                height = $submenu.outerHeight(),
                width = $menu.outerWidth();

            $submenu.css({
                display: "block",
                top: -1,
                left: width - 3,
                height: 490
            });
            $row.find("a.stlink").addClass("maintainHover");
        }

        var deactivateSubmenu = function(row) {
            var $row = $(row),
                submenuId = $row.data("submenuId"),
                $submenu = $("#" + submenuId);

            $submenu.css("display", "none");
            $row.find("a.stlink").removeClass("maintainHover");
        }

        $menu.menuAim({
            activate: activateSubmenu,
            deactivate: deactivateSubmenu
        });
        $menu.delegate('a','click',function(e){
        	e.preventDefault();
        	var $this = $(this),
            	cid = $this.attr("data-id"),
            	pid = $this.attr("data-pid"),
            	txt = $this.attr("data-value");
            	questionTxt.html(txt);
            	serviceId.val(pid);
            	childId.val(cid);
            _ChoiceD.hide()
        })
		}
	}
	module.exports = choiceQustion;
});