// load menu html
$("#sidebar").load("commonhtml/menu.html");
$("#navbar").load("commonhtml/header.html");
// del
$("#ace-settings-container").load("commonhtml/page-content.html");

// 做完后删除所有注释，改为英文
$("#create").click(function () {
    var name = $("#name").val();
    var userName = $("#username").val();
    var passWord = $("#password").val();
    var remark = $("#remark").val();
    if(name == ""){
        alert("用户名不许为空");
        return;
    }
    if(userName == ""){
        alert("手机号不许为空");
        return;
    }
    if(passWord == ""){
        alert("密码不许为空");
        return;
    }

    $.ajax({
        url: "/audio/user/addUser",
        type: "GET",
        async: false,
        data:{
            token:localStorage.getItem("token"),
            name: $("#name").val(),
            userName: $("#username").val(),
            passWord: $("#password").val(),
            remark: $("#remark").val()
        },
        dataType: "json",
        success: function (objReturn) {
            if(objReturn.code!="200"){
                $("#result").html(objReturn.value);
            }else{
                $("#result").html("用户 " + name + " 添加: " + objReturn.value);
                $("#name").val("");
                $("#username").val("");
                $("#password").val("");
                $("#remark").val("");
            }
        },
        error: function (objReturn) {
            //alert("系统故障");
        }
    });

});