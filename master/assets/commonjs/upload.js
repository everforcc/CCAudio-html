// load menu html
$("#sidebar").load("commonhtml/menu.html");
$("#navbar").load("commonhtml/header.html");
// del
$("#ace-settings-container").load("commonhtml/page-content.html");

var parentList ;
var childList ;

$(document).ready(function(data){
    init();
});

function init() {

    $.ajax({
        url: "/audio/file/getFileChildDir?token=" + localStorage.getItem("token"),
        type: "GET",
        data:{},
        async: false,
        dataType: "json",
        success: function (objReturn) {
            if (objReturn.code==200) {
                parentList = objReturn.data.obj.parent;
                childList = objReturn.data.obj.child;
                initOption(parentList);
            }else {
                alert(objReturn.value);
            }
        },
        error: function (objReturn) {
            // 跳转后台给我发邮件
            // alert("系统故障,请联系管理员");
        }
    });

    $("#childTypeInput").val($("#childType").find("option:selected").text());
    $("#fileTypeInput").val($("#fileType").val());
}

// 加载下拉框
function initOption(list) {
    var size = list.length;
    $("#childType").empty();
    for(var i=0;i<size;i++){
        $("#childType").append("<option value='" + list[i].fileType + "' >" + list[i].fileType + "</option>");
    }
}

var uploadUrl = "/audio/cc/upload" ; //+ "?token=" + localStorage.getItem("token")
                  //+ "&fileType=" + $("#fileType").val() ;//+ "&childType=" + $("#fileType").val();

var myAvatarzone = new Dropzone("#dropzone", {
    url: uploadUrl,//文件提交地址 + token fileType=" + $("#fileType").val()
    method: "post",  //也可用put
    paramName: "fileList", //默认为file
    params : {
        token : localStorage.getItem("token")
    },
    maxFiles: 10,//一次性上传的文件数量上限
    maxFilesize: 100, //文件大小，单位：MB
    acceptedFiles: ".jpg,.gif,.png,.jpeg,.mp3,.MPEG-4,.mpeg-4", //上传的类型
    addRemoveLinks: true,
    parallelUploads: 1,//一次上传的文件数量
    //previewsContainer:"#preview",//上传图片的预览窗口
    dictDefaultMessage: '拖动文件至此或者点击上传',
    dictMaxFilesExceeded: "您最多只能上传10个文件！",
    dictResponseError: '文件上传失败!',
    dictInvalidFileType: "文件类型只能是.jpg,.gif,.png,.jpeg,.mp3,.MPEG-4,.mpeg-4",
    dictFallbackMessage: "浏览器不受支持",
    dictFileTooBig: "文件过大上传文件最大支持100MB.",
    dictRemoveLinks: "删除",
    dictCancelUpload: "取消",
    init: function () {
        this.on("addedfile", function (file) {

            //上传文件时触发的事件
            // 回写成功字样
            if(file!=null){
                // alert(file.toString());
            }
        });
        this.on("success", function (file, data) {
            //alert(data.data);
            $("#errmsg").append(data.data);
            // 上传成功触发的事件
            $(".dz-error-message").html(data.data);
            if (data != null && data != "") {
                $("#avatarImgId").val(data.data);
            }

        });
        this.on("error", function (file, data) {
            //上传失败触发的事件
            $(".dz-error-message").html("文件上传失败");
        });
        this.on("removedfile", function (file) {//删除文件触发结果
            //console.log(file);
            $("#avatarImgId").val("");
        });
    }
});

//  切换分区 ，加载不同数据
$("#fileType").click(function () {
    if($("#fileType").val() == "1"){
        $("#fileType").val("2");
        $("#fileType").html("儿童区");
        initOption(childList);
    }else {
        $("#fileType").val("1");
        $("#fileType").html("家长区");
        initOption(parentList);
    }

    $("#childTypeInput").val($("#childType").find("option:selected").text());
    $("#fileTypeInput").val($("#fileType").val());

    //  这里也是可以修改参数的方法，不用非要 放到form，但是我不会
    //myAvatarzone.options.url = uploadUrl + $("#fileType").val();

});



// 新增手动选择或者添加
function addChildType() {
    var val = $("#addChildType").html();

    if("新增分类" == val){
        $("#childType").attr("style","display: none;");
        $("#newChildType").attr("style","");
        $("#addChildType").html("确定");
    }else if("确定" == val){
        var input = $("#newChildType").val();
        $("#childType").attr("style","");
        $("#newChildType").attr("style","display: none;");
        $("#childType").append("<option value='" + input + "'>" + input + "</option>");
        $("#addChildType").html("新增分类");
        $("#newChildType").val();
    }

    $("#childTypeInput").val($("#childType").find("option:selected").text());
    $("#fileTypeInput").val($("#fileType").val());

}

function selectChange() {
    $("#childTypeInput").val($("#childType").find("option:selected").text());
    $("#fileTypeInput").val($("#fileType").val());
}