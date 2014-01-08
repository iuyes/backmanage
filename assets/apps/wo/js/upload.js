var upload = function(id) {
    myUploader({
        'url' : _base_uri_ + 'upload.php/act/ajax',
        'onStart' : function() {
               $('#' + id + '_view').html('<img src="'+ _base_uri_ +'images/loading.gif" border=0> 正在上传文件，请稍候……有可能因为网络问题，出现程序长时间无响应，请点击“<a href="javascript:reupload(\''+ id +'\');"><font color="red">取消</font></a>”重新上传文件'); 
            },
        'objName': id
        });
};

var UploadFinish = function(data) {
    var res = data.split("|");
    var obj = $('#' + res[1] + '_view');
    var objv = $('#' + res[1] + '_value');
    if (res[0] == 0) {
        objv.val(res[2]); 

        var html = '上传成功：<a href="'+ res[2] + '" target="_blank">下载</a> <a href="javascript:reupload(\''+ res[1] +'\');">重新上传！</a>';
        obj.html(html);
    } else {

        var html = '抱歉：' + res[2] + ' <a href="javascript:reupload(\''+ res[1] +'\');">重新上传！</a>';
        obj.html(html);
    }
};

var reupload = function(id) {
    var obj = $('#' + id + '_view');
    var objv = $('#' + id + '_value');
    $('#' + id).remove();
    objv.val(''); 

    var html = '<input type="file" name="'+ id +'" id="'+ id +'" onchange="upload(\''+ id +'\')" class="input_long" />';
    obj.html(html);
};
