/*
** 根据产品分类请求不同的问题
 */
define(function(require,exports,module){
    var $       = require('$');
    var template = require('artTemplate');
    var Dialog  = require('dialog');
    var choice = require('biz/component/plugin.choice');
    require('biz/component/plugin.nicescroll')($);
    require('arale/dialog/1.2.5/dialog.css');
    choice($);
    var tpl = '<div class="catetory-i">'
        + '<h3 class="title"><b>当前已选择的产品:</b><span id="choice_title"><%=productName%></span></h3>'
        + '<ul class="catetory-menu">'
        +    '<%for(var i = 0,len = data.length; i <len;  i ++) {%>'
        +        '<li data-submenu-id="submenu-<%=data[i].id%>">'
        +            '<a data-id="<%=data[i].id%>" class="stlink" data-pid="<%=data[i].id%>" data-value="<%=data[i].name%>" href="javascript:;">'
        +             '<%if(data[i].children.length>0){%>'
        +            '<i class="icon-chevron-right"></i>'
        +              '<%}%>'
        +            '<%=data[i].name%></a>'
        +            '<div class="popover" id="submenu-<%=data[i].id%>">'
        +                '<%for(var j=0,jo=data[i].children,jl=jo.length;j<jl;j++){%>'
        +                    '<dl class="cc">'
        +                       '<dt>'
        +                            '<a data-id="<%=jo[j].id%>" data-pid="<%=data[i].id%>" data-value="<%=data[i].name%> - <%=jo[j].name%>" href="javascript:;">'
        +                            '<%=data[i].children[j].name%>'
        +                            '</a>'
        +                        '</dt>'
        +                        '<dd>'
        +                        '<%for(var k = 0,ko = data[i].children[j].children, kl = ko.length; k <kl;  k++) {%>'
        +                            '<a data-id="<%=ko[k].id%>" data-pid="<%=data[i].id%>" data-value="<%=data[i].name%> - <%=jo[j].name%> - <%=ko[k].name%>" href="javascript:;"><%=ko[k].name%></a>'                         
        +                           '<span>|</span>'
        +                           '<%}%>'
        +                        '</dd>'
        +                    '</dl>'
        +               '<%}%>'
        +           '</div>'
        +        '</li>'
        +    '<%}%>'
        + '</ul>'
        + '</div>';
    function choiceQustion(ele,qele,callback){
        this.ele = ele;
        this.qele = qele;
        this.callback = callback?callback:null;
        this.init();
    }
    choiceQustion.prototype = {
        constructor:"choiceQustion",
        init: function(){
            var me = this,
                ele = $("#"+me.ele),
                qele = $("#"+me.qele),
                eleP = ele.parent(),
                serviceId = eleP.find(".serviceId"),
                questionTxt = eleP.find('.questionTxt'),
                childId = eleP.find(".childId");
            var render = template.compile(tpl);
            //产品分类改变的时候要清空已经选择的问题分类
            qele.bind('change',function(){
                serviceId.val('');
                childId.val('');
                questionTxt.html('');
            });
            if(!me._ChoiceD){
                me._ChoiceD = new Dialog({
                    trigger:"#" + me.ele,
                    width:500,
                    height:450,
                    zIndex:100000,
                });
            }
            me._ChoiceD.before('show',function(){
                var _d = this;
                    _d.set('content', "正在加载问题分类..."),
                    _html = "",
                    curProductId = qele.val(),
                    curProductText = qele.find("option:selected").text();
                    $.ajax({
                        type: "get",
                        dataType : "json",
                        url: "/category/json/popup.json",
                        data:{
                            productId : curProductId
                        },
                        success:function(data){
                            if(data.success){
                                arr = data.data;
                                if(arr.length === 0){
                                    _html = '<div class="catetory-i"><h3 class="title"><b>当前选择的产品:</b><span>'+curProductText+'</span></h3>';
                                    _html += '<p>该产品下暂无问题分类</p></div>';
                                    _d.set('content', _html);
                                    return;
                                }
                                data.productName = curProductText;
                                _html = render(data);
                                _d.set('content', _html);
                                _d.element.find(".catetory-i").niceScroll({cursorborder:"",cursorcolor:"#a4c6ef",boxzoom:false});
                                _d.element.find(".catetory-menu").menuAim({
                                    activate: activateSubmenu,
                                    deactivate: deactivateSubmenu
                                });
                            }
                        },
                        error:function(){
                            _d.set('content', "加载问题分类有误,请重试");
                        }
                    });
            })
        var activateSubmenu =function(row) {
            var $row = $(row),
                submenuId = $row.data("submenuId"),
                $submenu = $row.find('.popover'),
                height = $submenu.outerHeight();
                width = 130;
              $submenu.css({
                display: "block",
                //top: -1,
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
        });

        }
    }
    module.exports = choiceQustion;
});