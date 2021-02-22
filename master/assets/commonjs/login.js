// 初始化
$(document).ready(function(data){
    init();
});

function init() {
    // 图片
    $.ajax({
        url: "/audio/cover/getCover",
        type: "GET",
        data:{},
        dataType: "json",
        success: function (objReturn) {

            if (objReturn.code==200) {
                $("#cover").attr("src","/audio/resource/" + objReturn.data.path + "/" + objReturn.data.name );
            }else {
                $("#result").html(objReturn.value);
            }

        },
        error: function (objReturn) {
            // 跳转后台给我发邮件
            alert("系统故障,请联系管理员");
        }
    });
}

// 登录密码加密
$("#login").click(function () {
    /*var userName = $("#userName").val();
    var passWord = $("#passWord").val();*/
    //alert($("#userName").val()+ " >>> " + $("#passWord").val() );
    $.ajax({
        url: "/audio/login/submit",
        type: "GET",
        data:{
            "userName":$("#userName").val(),
            "passWord":$("#passWord").val()
        },
        async: false,
        dataType: "json",
        success: function (objReturn) {

            if (objReturn.code==200) {
                localStorage.setItem("token", objReturn.data.token);
                localStorage.setItem("name", objReturn.data.name);
                window.location.href = "master/music.html";
            }else {
                $("#result").html(objReturn.value);
            }

        },
        error: function (objReturn) {
            // 跳转后台给我发邮件
            alert("系统故障,请联系管理员");
        }
    })
});

