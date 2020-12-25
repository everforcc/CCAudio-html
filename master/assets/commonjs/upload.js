// load menu html
$("#sidebar").load("commonhtml/menu.html");
$("#navbar").load("commonhtml/header.html");
// del
$("#ace-settings-container").load("commonhtml/page-content.html");

var uploadUrl = "/audio/cc/upload?token=" + localStorage.getItem("token") + "&fileType=";

var myAvatarzone = new Dropzone("#dropzone", {
    url: uploadUrl + $("#fileType").val(),//文件提交地址 + token fileType=" + $("#fileType").val()
    method: "post",  //也可用put
    paramName: "fileList", //默认为file
    maxFiles: 10,//一次性上传的文件数量上限
    maxFilesize: 20, //文件大小，单位：MB
    acceptedFiles: ".jpg,.gif,.png,.jpeg,.txt,.mp3", //上传的类型
    addRemoveLinks: true,
    parallelUploads: 1,//一次上传的文件数量
    //previewsContainer:"#preview",//上传图片的预览窗口
    dictDefaultMessage: '拖动文件至此或者点击上传',
    dictMaxFilesExceeded: "您最多只能上传10个文件！",
    dictResponseError: '文件上传失败!',
    dictInvalidFileType: "文件类型只能是*.jpg,*.gif,*.png,*.jpeg,*.txt,*.mp3。",
    dictFallbackMessage: "浏览器不受支持",
    dictFileTooBig: "文件过大上传文件最大支持20MB.",
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
            $("#errmsg").append(data.data)
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

//  切换分区
$("#fileType").click(function () {
    if($("#fileType").val() == "1"){
        $("#fileType").val("2");
        $("#fileType").html("家长区");
    }else {
        $("#fileType").val("1");
        $("#fileType").html("儿童区");
    }
    myAvatarzone.options.url = uploadUrl + $("#fileType").val();
});