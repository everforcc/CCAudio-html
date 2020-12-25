// 做完后删除所有注释，改为英文
$(function(){
    $.ajax({
        //url: "/audio/login/token?token=" + localStorage.getItem("token"),
        url: "/audio/login/token",
        type: "GET",
        async: false,
        data:{token:localStorage.getItem("token")},
        dataType: "json",
        success: function (objReturn) {
            //localStorage.setItem("token",objReturn.data.token);
            if(objReturn.code!="200"){
                alert("登录过期，请重新登录");
                localStorage.setItem("token",null);
                window.location.href = "/login.html";
            }else{
                // alert(objReturn.value);
                // 登录成功的话我们就存公共信息，这里可以取出来用
            }
        },
        error: function (objReturn) {
            //alert("系统故障");
        }
    });

});