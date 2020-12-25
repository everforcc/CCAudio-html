/*
*  1. load list
*  2. type page
*  3. paly
*  4. auto next
* */


var mapPlayList = {};
// 1.页面加载完毕后开始加载音乐
$(document).ready(function(data){
    // load list
    loadList();
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
    $("#currentPage").val(currentPage);
    $("#showPage").val(currentPage/totalPage);
    loadList();


}

// change type
function aduioType(type) {
    $("#aduioType").val(type);
    // if changetype currentPage modify 1
    $("#currentPage").val(1);
    loadList();
}

// setting type and page for list
function loadList() {

    var aduioType = $("#aduioType").val();
    var currentPage = $("#currentPage").val();
    var search = $("#nav-search-input").val();

    var recursion = 'firstAudio';
    $.ajax({
        url: "/audio/file/getFileList",
        type: "GET",
        async: false,
        data:{
            token:localStorage.getItem("token"),
            fileName:search,
            aduioType:aduioType,
            currentPage:currentPage,
            userName:localStorage.getItem("name")
        },
        /*dataType: "text",*/
        success: function (objReturn) {
            //alert(objReturn);
            // 组织页面数据 id="message-list"
            $("#message-list").html("");
            var child = "";
            var json = JSON.parse(objReturn);
            var marki = 1-1;
            for(var i=0;i<json.data.obj.length;i++){
                marki++;
                var realName = json.data.obj[i].realName;
                // 方法用"" 参数用'' 包括 规定写法...
                //child += "<div class=\"message-item message-unread\" id=\"" + json.data.obj[i].name + "\" onclick=\"playAudio('" + json.data.obj[i].realName + "')\">";
                child += "<div class=\"message-item message-unread\">";
                if(json.data.obj[i].mark==1) {
                    // 带上是否标记，做个判断给不同的值
                    child += "<span class=\"sender\"  onclick=\"markAudio('" + realName + "'," + marki + ")\" > <i value='1' id=\"i" + marki + "\" class=\"message-star ace-icon fa fa-star-o light-grey\"></i> </span>";
                }else{
                    child += "<span class=\"sender\"  onclick=\"markAudio('" + realName + "'," + marki + ")\" > <i value='0' id=\"i" + marki + "\" class=\"message-star ace-icon fa fa-star orange2\"></i> </span>";
                }
                child += "<span class=\"time\">" + json.data.obj[i].size + "</span>";
                child += "<span class=\"summary\" onclick=\"playAudio('" + json.data.obj[i].realName + "')\" ><span class=\"text\">" + json.data.obj[i].realName + "</span></span>";
                child += "</div>";
                // play order
                mapPlayList[recursion] = json.data.obj[i].realName;
                recursion = json.data.obj[i].realName;
            }
            $("#message-list").append(child);
            $("#totalNum").html("共" + json.data.totalNum + "个");
            $("#showPage").html(currentPage/json.data.totalPage);
            // 查询回来后给page赋值 、、至于隐藏上下页的按钮，最后再说
        },
        error: function (objReturn) {
            //alert("返回异常");
        }
    });
}

// play audio
function playAudio(fileName) {
    $.ajax({
        url: "/audio/file/getFilePath",
        type: "GET",
        async: false,
        data:{token:localStorage.getItem("token"),fileName:fileName,userName:localStorage.getItem("name")},
        /*dataType: "text",*/
        success: function (objReturn) {
            // $('#audioT').attr("src","data:audio/wav;base64,"+objReturn);
            var json = JSON.parse(objReturn);
            $('#audioT').attr("src","/audio/resource/" + json.data + "?token=" + localStorage.getItem("token"));
            $('#audioT').attr("onended","autoPlayNextAduio('" + fileName + "')");
        },
        error: function (objReturn) {
            //alert("返回异常");
        }
    });
    // 方式二,这种快但是不安全
    // $('#audioT').attr("src","/audio/audio/" + fileName + "?token=" + localStorage.getItem("token") );
    // 方式三，音频流 类似.m4s那种，但是暂时还不会

    $(".play-pause-btn").focus().click();
}

// play next audio
function autoPlayNextAduio(param) {
    if(param in mapPlayList){
        setTimeout( function () {playAudio(mapPlayList[param]);} , 500 );
    }else {
        alert("本页已经播放完了");
    }
}

function markAudio(fileName,marki){

    var id = "i" + marki;
    var value = $("#" + id).attr("value");
    //未标记 message-star ace-icon fa fa-star-o light-grey
    //已标记 message-star ace-icon fa fa-star orange2
    $.ajax({
        url: "/audio/file/markFile",
        type: "GET",
        async: false,
        data:{token:localStorage.getItem("token"),fileName:fileName,userName:localStorage.getItem("name"),mark:value},
        /*dataType: "text",*/
        success: function (objReturn) {
            var json = JSON.parse(objReturn);
            if(json.code==200){
                // 标记收藏的点
                if (value==1) {
                    $("#" + id).attr("class", "message-star ace-icon fa fa-star orange2");
                    $("#" + id).attr("value", "0");
                }else {
                    $("#" + id).attr("class", "message-star ace-icon fa fa-star-o light-grey");
                    $("#" + id).attr("value", "1");
                }
            }
        },
        error: function (objReturn) {
            //alert("返回异常");
        }
    });

}

// abandon
/*
function playVideo(fileName) {
    // alert("ces");
    $(".play-pause-btn").focus().click();

    //$(".play-pause-btn").onkeydown(e);
    // 替换属性。再开始
    //$(".play-pause-btn").attr("aria-label","Pause");

    $.ajax({
        url: "/audio/getBase",
        type: "GET",
        async: false,
        data:{token:localStorage.getItem("token"),fileName:"中文"},
        /!*dataType: "text",*!/
        success: function (objReturn) {
            //$('#audioT').attr("src","data:audio/wav;base64,"+objReturn);
            $('#audioT').attr("src","/audio/file/" + objReturn + "?token=" + localStorage.getItem("token") );
        },
        error: function (objReturn) {
            //alert("返回异常");
        }
    });

    $(".play-pause-btn").focus().click();

}*/
