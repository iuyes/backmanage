 /**
 myUploader({
     objName: '',
     url:'',
     fnName: 'UploadFinish',
     onStart: function(){},
     iframeName: 'iframe_for_upload', //iframe's name
     iframePrefix: true
 });
 **/

var myUploader = function(s) {
    s.iframeName = s.iframeName || "iframe_for_upload";
    s.fnInputName = s.fnInputName || "function";
    s.fnName = s.fnName || "UploadFinish";
    s.fnDataTypeInputName = s.fnDataTypeInputName || "dataType";
    s.fnDataType = s.fnDataType || "json";
    s.objInputName = s.objInputName || "obj";
    s.iframeName = s.iframeNoPrefix ? s.iframeName : s.iframeName + '_' + Math.floor(Math.random() * 10000);

    var newIframe = $('<iframe id="'+s.iframeName+'" name="'+s.iframeName+'"/>')
                    .attr({
                        'src': $.browser.msie ? 'javascript:false' : 'about:blank'
                    })
                    .hide()
                    .css({
                        'width' : 0,
                        'height' : 0,
                        'border': 0,
                        'visibility' : 'hidden',
                        'position' : 'absolute'
                    })
                    .appendTo("body");
    var newForm = $("<form/>")
                     .attr({
                         'action' : s.url,
                         'method' : 'post',
                         'target' : s.iframeName
                     })
                    .hide()
                    .appendTo("body");

    if ($.browser.msie) {
        newForm.attr('encoding', 'multipart/form-data');
    } else {
        newForm.attr('enctype', 'multipart/form-data');
    }

    $("<input type='hidden'/>")
    .attr({
        'name' : s.objInputName,
        'value' : s.objName
    })
    .appendTo(newForm);
                            
    $("<input type='hidden'/>")
    .attr({
            'name' : s.fnInputName,
            'value' : s.fnName
        })
    .appendTo(newForm);

    $("<input type='hidden'/>")
    .attr({
            'name' : s.fnDataTypeInputName,
            'value' : s.fnDataType
        })
    .appendTo(newForm);

    newForm.append($("#" + s.objName));
    if ($.isFunction(s.onStart)) s.onStart();

    newForm.submit();
}
