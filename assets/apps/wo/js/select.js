//通过数据无限递归
// data like:
// {id:['',''], value:['','',''], child:{[{'child_id':'','child_value':'','parent_id':''},{}],[],[]}}
function build_select(id, data, ids) {
    var select = $("<select onchange=\"cascading_select(this, '"+id+"');\" name ='"+ id +"' />");
    $("#select_" + id).html("").append(select);
    console.log(select);
    select.appendOption("请选择", "", true);
    //console.log(select.isOptionValueExisted(""));

    //var iss = $.parseJSON(ids);
    console.log(ids);

    $.each(data.id, function(i, j) {
        //console.log(data.child[i]);
        var o = [];
        $.each(data.child[i], function(m, n){
            //console.log(n);
            var x = '{"text":"' + n.child_value + '","value":"' + n.child_id + '","selected":"'+(n.child_id == ids[1] ? 'true' : 'false')+'"}';
            o.push(x);
        });

        select.appendOption(data.value[i], j)
        .attr("idx", i)
        .attr("data", "[" + o.join(",") + "]");
    });

    if (ids.length > 0) {
        select.setSelectedValue(ids[0]);
        cascading_select(select, id);
    }
}

//通过数据无限递归
function cascading_select(e, id) {
    var o = $(e);  
    //alert(o.val());
    var select = $("<select name ='"+ id +"' />").hide();

    var obj = $("#select_" + id);

    if (obj.find("select").size() > 1) {
        obj.find("select:last").remove();
    }
    
    obj.append(select);

    var data = o.find("option[value='"+o.val()+"']").attr('data');
    data = $.parseJSON(data);
    console.log(data);
    select.addOptions(data);
    
    if (select.selectSize() > 0) {
        select.show();
    }

}

//通过接口生成
// url: [{text:'beijing',value:'010'},{text:'shanghai', value:'020',selected:'true'},{...},...]
function build_select_url(id, url, ids) {
    var selectObj = $("#select_" + id).html("");
    //ids = $.extend([""], ids);
    ids.splice(0, 0, "");
    
    console.log(ids);
    $.each(ids, function(i, j) {
        if (i > 0 && j == "") return;

        var select = $("<select onchange=\"cascading_select_url(this, '"+id+"', '"+ url +"');\" name ='"+ id +"' />");
        select.hide();
        console.log(select);
        selectObj.append(select);
        select.addOptionsViaAjax(url.replace("[value]", j));

        select.prependOption("请选择", "", true);
       
        if (ids[i+1]) {
            select.val(ids[i+1]);
        }
        if (select.selectSize() > 1) {
            select.show();
        } else {
            select.remove();
        }
    });
}

//通过接口无限递归生成
function cascading_select_url(e, id, url) {
    var o = $(e);  
    console.log(o.val());
    var j = o.val();
    o.nextAll().remove();
    if (j == "") return;

    var select = $("<select onchange=\"cascading_select_url(this, '"+id+"', '"+ url +"');\" name ='"+ id +"' />");
    select.hide();
    console.log(select);
    o.parent().append(select);
    select.addOptionsViaAjax(url.replace("[value]", j));
    select.prependOption("请选择", "", true);

    if (select.selectSize() > 1) {
        select.show();
    } else {
        select.remove();
    }
}
