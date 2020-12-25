// 初始化
$(function () {
    // load menu html
    $("#sidebar").load("commonhtml/menu.html");
    $("#navbar").load("commonhtml/header.html");
    // del
    $("#ace-settings-container").load("commonhtml/page-content.html");
    query('','0');

});

// change page
function pageChange(status) {
    var currentPage = $("#currentPage").val() - 1 + 1;
    var totalPage = $("#totalPage").val();
    if(status==0){
        currentPage = 1;
    }else if(status==1){
        currentPage = currentPage-1;
    }else if(status==2){
        currentPage = currentPage+1;
    }else if(status==3){
        currentPage = totalPage;
    }else if(status==4){
        // 这里就表示按钮不能用了
        // li标签下的a标签和span标签 还有函数
        // 样式最后在改动
    }
    if(currentPage<0){
        currentPage=0
    }
    if(currentPage>totalPage){
        currentPage=totalPage;
    }

    $("#currentPage").val(currentPage);
    $("#showPage").val(currentPage/totalPage);
    query('',currentPage);

}

function query(like,page) {

    $.ajax({
        url: "/audio/user/queryUserList",
        type: "GET",
        async: false,
        data:{
            "like":like,
            "page":page,
            "token":localStorage.getItem("token")
        },
        dataType: "json",
        success: function (objReturn) {

            if(objReturn.code=="200"){

                $("#userlist").html("");
                var option = "";

                // 草，忘记写 i < 了
                var size = objReturn.data.obj.length;
                for(var i = 0; i < size;i++){

                    var obj = objReturn.data.obj[i];

                    option += " ";
                    option += "<div class=\"message-item\" >";
                    option += "<span class=\"col-sm-2 control-label no-padding-right\" id=\"name" + obj.id + "\">" + obj.name + "</span>";
                    option += "<span class=\"col-sm-2 control-label no-padding-right\" id=\"tel" + obj.id + "\">" + obj.userName + "</span>";
                    option += "<span class=\"col-sm-2 control-label no-padding-right\" id=\"pas" + obj.id + "\">" + obj.passWord + "</span>";
                    option += "<span class=\"col-sm-2 control-label no-padding-right\" id=\"remark" + obj.id + "\">" + obj.remark + "</span>";
                    option += " ";
                    option += "<span class=\"summary\">";
                    option += "<button class=\"btn btn-xs btn-info\" onclick=\"modifyUser('" + obj.id + "')\">";
                    option += "<i class=\"ace-icon fa fa-pencil bigger-120\"></i>";
                    option += "</button>";
                    option += "<button class=\"btn btn-xs btn-success\" onclick=\"submitUser('" + obj.id + "')\">";
                    option += "<i class=\"ace-icon fa fa-check bigger-120\"></i>";
                    option += "</button>";
                    option += "</span>";
                    option += " ";
                    option += "</div>";
                }
                //alert("总页数:" + objReturn.data.pageNum + ",总数:" + objReturn.data.totalNum);
                $("#userlist").append(option);
                $("#totalNum").html("共" + objReturn.data.totalNum + "个用户");
                page++;
                $("#showPage").html( page + "/" + objReturn.data.pageNum);
            }
        },
        error: function (objReturn) {
            // 跳转后台给我发邮件
            alert("系统故障,请联系管理员");
        }
    })
}

//
function modifyUser(id) {

    // 1.屏蔽当前按钮

    var id1 = "pas" + id;
    var id2 = "remark" + id;

    // 取出span的值
    var passWord = $("#" + id1).html();
    var remark = $("#" + id2).html();



    // 修改input的值
    // <input type="text" class="col-sm-1 control-label no-padding-right" class="sender"  id=""  value="用户名"/>
    $("#" + id1).replaceWith("<input type=\"text\" class=\"col-sm-2 control-label no-padding-right\" class=\"sender\"  id=\"" + id1 + "\"  value=\"" + passWord + "\"/>");
    $("#" + id2 ).replaceWith("<input type=\"text\" class=\"col-sm-2 control-label no-padding-right\" class=\"sender\"  id=\"" + id2 + "\"  value=\"" + remark + "\"/>");

}

function submitUser(id) {
    // 取出两个值，提交
    // 然后再修改为span
    // <span class="col-sm-2 control-label no-padding-right" id="pas1">pas </span>
    // <span class="col-sm-2 control-label no-padding-right" id=""></span>

    var id1 = "pas" + id;
    var id2 = "remark" + id;

    // 取出input的值
    var passWord = $("#" + id1).val();
    var remark = $("#" + id2).val();

    // 将结果发送到后台

    $.ajax({
        url: "/audio/user/modifyUser",
        type: "GET",
        async: false,
        data:{
            "id":id,
            "passWord":passWord,
            "remark":remark,
            "token":localStorage.getItem("token")
        },
        dataType: "json",
        success: function (objReturn) {
            if(objReturn.code == "200"){
                // 修改span的值
                // <input type="text" class="col-sm-1 control-label no-padding-right" class="sender"  id=""  value="用户名"/>
                $("#" + id1).replaceWith("<span class=\"col-sm-2 control-label no-padding-right\" id=\"" + id1 + "\">" + passWord + "</span>");
                $("#" + id2 ).replaceWith("<span class=\"col-sm-2 control-label no-padding-right\" id=\"" + id2 + "\">" + remark + "</span>");
            }
        },
        error: function (objReturn) {
            // 跳转后台给我发邮件
            alert("系统故障,请联系管理员");
        }
    });



}