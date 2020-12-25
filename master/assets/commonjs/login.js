
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
            // alert(objReturn.data.token);
            localStorage.setItem("token",objReturn.data.token);
            localStorage.setItem("name",userName);
            window.location.href = "master/music.html";
        },
        error: function (objReturn) {
            // 跳转后台给我发邮件
            alert("系统故障,请联系管理员");
        }
    })
});

