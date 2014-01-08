/**
 * Droplist tool
 *
 * 功能说明:本js文件为$类库的一个插件,主要实现对select的操作.
 * 
 *  
 *  Data array like: 
 *       [{text:'beijing',value:'010'},{text:'shanghai', value:'020',selected:true},{...},...]
 *
 *  Entity like:
 *   {
 *       text_field : 'text', //代表显示值的字段
 *       value_filed : 'value', //代表值的字段
 *       erase : true, //是否擦除之前的数据
 *       selected : 0 //被选中的index number
 *   };
 *
 * zhihua.zhangzh @2013-12-11
*/


;(function($) {
    // 过滤一下实体参数
    _filterEntity = function(entity) {
        var default_entity = {
            text_field : 'text', //代表显示值的字段
            value_filed : 'value', //代表值的字段
            selected_field : 'selected', //代表显示值的字段
            erase : true, //是否擦除之前的数据
            selected : 0 //被选中的index number
        };

        if (entity == undefined) {
            return default_entity;
        } else {
            return $.merge(default_entity, entity);
        }
    }

    //追加一个Option(下拉项) 
    $.fn.appendOption = function(text, value, selected) {  
        var option = _createOption(text, value, selected);
        $(this).append(option);
        return $(option);
    }

    //插入一个Option(第一个位置)
    $.fn.prependOption = function(text, value, selected) {
        var option = _createOption(text, value, selected);
        $(this).prepend(option);
        return $(option);
    }

    //向select中添加一项，显示内容为text，值为value,如果该项值已存在，则提示
    _createOption = function(text, value, selected) {
        if ($(this).isOptionValueExisted(value)) {
            console.log("待添加项的值已存在[text:" + text +",value:" + value +"]");
            return;
        } 

        var option = new Option(text, value);
        if (selected != undefined && selected) {
            option.selected = true;
        }
        return option;
    }

    //将数组转成 select 对象
    $.fn.addOptions = function(datas, entity) {

        if (datas == undefined || datas.length == 0) {
            console.log("illegal data" + entity);
            return $(this);     
        }  

        entity = _filterEntity(entity);

        this.each(function() {
            if (this.tagName == "SELECT") {
                var select = this;
                if (entity.erase) $(select).html("");
                $.each(datas, function(i, n) {
                    option = new Option(eval("n." + entity.text_field), eval("n." + entity.value_filed));
                    if (eval("n." + entity.selected_field) == 'true') {
                        option.selected = true;
                    } else if (i == entity.selected) {
                        option.selected = true;
                    }
                    select.options.add(option);
                });
            }
        });

        return $(this); 
    }

    //通过url的方式获取数据，然后填充
    $.fn.addOptionsViaAjax = function(url, entity) {
        if (url.length == 0) {
            console.log("illegal url");
            return this;     
        }  
        
        entity = _filterEntity(entity);
        
        var datas;

        $.ajaxSetup({async:false});
        
        $.getJSON(url, function(json){datas=json;});
        
        return $(this).addOptions(datas, entity);
    }

    //获取个数
    $.fn.selectSize = function() {
        return $(this).find("option").size(); 
    }

    //获得当前选中项的文本
    $.fn.getSelectedText = function() {
        return $(this).find("option:selected").text(); 
    }

    //获取最后一个对象
    $.fn.getLastOptionObject = function() {
        return $(this).find("option:last").get(0); 
    }

    //获取最大索引值
    $.fn.getLastOptionIndex = function() {
        return this.getLastOptionObject().index;
    }

    //获得当前选中项的值
    $.fn.getSelectedValue = function() {
        return $(this).val();
    }

    //获取选中的索引值
    $.fn.getSelectedIndex = function() {
        return $(this).get(0).selectedIndex;
    }

    //根据text获取index
    $.fn.getSelectedIndexByText = function(text) {
        var count = this.selectSize();
        for (var i = 0; i < count; i++) {
            if ($(this).get(0).options[i].text == text) {
                return $(this).get(0).options[i].index;
            }
        }
        return undefined;
    }

    //根据value获取index
    $.fn.getSelectedIndexByValue = function(value) {
        try {
            return $(this).find("option[value='"+value+"']").get(0).index;
        } catch (err) {
            return undefined;
        }
    }

    //设置select中值为value的项为选中
    $.fn.setSelectedValue = function(value) {
        return $(this).val(value);
    }

    //设置选中指定索引项
    $.fn.setSelectedIndex = function(index) {
        return $(this).get(0).selectedIndex = index;
    }

    //设置select中文本为text的第一项被选中
    $.fn.setSelectedByText = function(text) {
        console.log(this.getSelectedIndexByText(text));
        return this.setSelectedIndex(this.getSelectedIndexByText(text));
    }

    //判断select项中是否存在值为value的项
    $.fn.isOptionValueExisted = function(value) {
        return ($(this).find("option[value='"+value+"']").size() > 0);
    }

    //判断select项中是否存在值为value的项
    $.fn.isOptionValueNotExisted = function(value) {
        return !this.isOptionValueExisted(value);
    }

    //删除第一个项
    $.fn.removeFirstOption = function() {
        return this.removeOptionByIndex(0);
    }

    //删除select中指定索引的项
    $.fn.removeOptionByIndex = function(index) {
        return $(this).get(0).remove(index);
    }

    //删除选中的项
    $.fn.removeSelectedOption = function() {
        return this.removeOptionByIndex(this.getSelectedIndex());
    }

    //删除最后一个项
    $.fn.removeLastOption = function() {
        return this.removeOptionByIndex(this.getLastOptionIndex());
    }

    //删除select中值为value的项，如果该项不存在，则提示
    $.fn.removeOptionByValue = function(value) {    
        return $(this).find("option[value='"+value+"']").remove();
    }

    //清除所有项
    $.fn.clearAllOptions = function() {
        return $(this).empty();
    }
})(jQuery);