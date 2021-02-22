/*
*  1. load list
*  2. type page
*  3. paly
*  4. auto next
* */


var mapPlayList = {};
var listPlayList = [];
var listPlayListSize = 0 ;
var parentTypeFileType = "";
var nowPlayName = ""; // 当前播放的音乐

// 首页,分类
var header_index = "";
var header_dir = "";


// 1.页面加载完毕后开始加载音乐
$(document).ready(function(data){
    // load list
    // loadList();
});

// 1. 选择类型
function parentType(type) {
    // 去后台查询类型
    // 这种返回一个目录
    $.ajax({
        url: "/audio/file/getFileDir",
        type: "GET",
        async: false,
        data:{
            type:type,
            token:localStorage.getItem("token"),
            userName:localStorage.getItem("name"),
            currentPage:$("#currentPage").val()
        },
        dataType: "json",
        success: function (objReturn) {

            if(objReturn.code==200){

                // 组织页面数据 id="message-list"
                $("#message-list").html("");
                var child = "";
                var marki = 1-1;
                var length = objReturn.data.obj.length;

                for(var i=0;i<length;i++){
                    marki++;

                    // 方法用"" 参数用'' 包括 规定写法...
                    //child += "<div class=\"message-item message-unread\" id=\"" + objReturn.data.obj[i].name + "\" onclick=\"playAudio('" + objReturn.data.obj[i].realName + "')\">";
                    child += "<div class=\"message-item message-unread\">";
                    /*if(objReturn.data.obj[i].mark==1) {
                        // 带上是否标记，做个判断给不同的值
                        child += "<span class=\"sender\"  onclick=\"markAudio('" + realName + "'," + marki + ")\" > <i value='1' id=\"i" + marki + "\" class=\"message-star ace-icon fa fa-star-o light-grey\"></i> </span>";
                    }else{
                        child += "<span class=\"sender\"  onclick=\"markAudio('" + realName + "'," + marki + ")\" > <i value='0' id=\"i" + marki + "\" class=\"message-star ace-icon fa fa-star orange2\"></i> </span>";
                    }
                    child += "<span class=\"time\">" + objReturn.data.obj[i].size + "</span>";*/
                    child += "<span class=\"summary\" onclick=\"cdDir('" + objReturn.data.obj[i].parentType + objReturn.data.obj[i].fileType + "')\" ><span class=\"text\">" + objReturn.data.obj[i].fileType + "</span></span>";
                    child += "</div>";
                    // play order
                    //mapPlayList[recursion] = objReturn.data.obj[i].realName;
                    //recursion = objReturn.data.obj[i].realName;
                }
                $("#message-list").append(child);
                $("#totalNum").html("共" + objReturn.data.totalNum + "个");
                $("#showPage").html(currentPage/objReturn.data.totalPage);
                // 查询回来后给page赋值 、、至于隐藏上下页的按钮，最后再说

                if("parent"==type){
                    header_index = "家长听";
                }else {
                    header_dir = "儿童听";
                }

                showType("cc-dir");

            }
        },
        error: function (objReturn) {
            //alert("返回异常");
        }
    });
}

// 进入目录
function cdDir(dir) {
    parentTypeFileType = dir;
    // alert("dir:" + parentTypeFileType);
    if(dir.startsWith("parent")){
        header_dir = dir.substring(6);
    }else { // child
        header_dir = dir.substring(5);
    }

    loadList();
}


// 搜索 监听回车
$(document).keyup(function(event){
    loadList();
});

// 分页
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

// 改变类型，暂时不用
// change type
function aduioType(type) {
    $("#aduioType").val(type);
    // if changetype currentPage modify 1
    $("#currentPage").val(1);
    loadList();
}

// 加载音频列表
// setting type and page for list
function loadList() {

    var aduioType = $("#aduioType").val(); // 音频类型
    var currentPage = $("#currentPage").val(); // 当前页
    var search = $("#search").val(); // 搜索值

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
            userName:localStorage.getItem("name"),
            parentTypeFileType : parentTypeFileType
        },
        dataType: "json",
        success: function (objReturn) {

            // 组织页面数据 id="message-list"
            $("#message-list").html("");
            var child = "";
            var marki = 1-1;

            for(var i=0;i<objReturn.data.obj.length;i++){
                marki++;
                var realName = objReturn.data.obj[i].realName;
                // 方法用"" 参数用'' 包括 规定写法...
                //child += "<div class=\"message-item message-unread\" id=\"" + objReturn.data.obj[i].name + "\" onclick=\"playAudio('" + objReturn.data.obj[i].realName + "')\">";
                child += "<div class=\"message-item message-unread\">";
                if(objReturn.data.obj[i].mark==1) {
                    // 带上是否标记，做个判断给不同的值
                    child += "<span class=\"sender\"  onclick=\"markAudio('" + realName + "'," + marki + ")\" > <i value='1' id=\"i" + marki + "\" class=\"message-star ace-icon fa fa-star-o light-grey\"></i> </span>";
                }else{
                    child += "<span class=\"sender\"  onclick=\"markAudio('" + realName + "'," + marki + ")\" > <i value='0' id=\"i" + marki + "\" class=\"message-star ace-icon fa fa-star orange2\"></i> </span>";
                }
                child += "<span class=\"time\">" + objReturn.data.obj[i].length + "</span>";
                child += "<span class=\"summary\" onclick=\"playAudio('" + objReturn.data.obj[i].realName + "')\" ><span class=\"text\">" + objReturn.data.obj[i].realName + "</span></span>";
                child += "</div>";
                // play order
                mapPlayList[recursion] = objReturn.data.obj[i].realName;
                recursion = objReturn.data.obj[i].realName;
                listPlayList[listPlayListSize] = objReturn.data.obj[i].realName;
                listPlayListSize++ ;
            }
            $("#message-list").append(child);
            $("#totalNum").html("共" + objReturn.data.totalNum + "个");
            $("#showPage").html(currentPage/objReturn.data.totalPage);

            // 查询回来后给page赋值 、、至于隐藏上下页的按钮，最后再说


        },
        error: function (objReturn) {
            //alert("返回异常");
        }
    });
}

// 播放音频
// play audio
function playAudio(fileName) {
    $.ajax({
        url: "/audio/file/getFilePath",
        type: "GET",
        async: false,
        data:{fileName:fileName,token:localStorage.getItem("token"),userName:localStorage.getItem("name")},
        dataType: "json",
        success: function (objReturn) {
            // $('#audioT').attr("src","data:audio/wav;base64,"+objReturn);

            $('#audioT').attr("src","/audio/resource/" + objReturn.data + "?token=" + localStorage.getItem("token"));
            $('#audioT').attr("onended","autoPlayNextAduio('" + fileName + "')");
            nowPlayName = fileName;
            $("#nowPlay").html(fileName);
            showType("cc-play");
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

// 自动播放下一曲
// play next audio
function autoPlayNextAduio(param) {
    if(param in mapPlayList){
        setTimeout( function () {playAudio(mapPlayList[param]);} , 500 );
    }else {
        alert("本页已经播放完了");
    }
}

function controlPlay(type) {
    // 上一曲,下一曲,播放,暂停
    if("pause"==type){
        // 播放或者暂停
        $(".play-pause-btn").focus().click();
    }else if("previous"==type){
        var size = listPlayListSize.length;
        for(var i=0;i < size;i++){
            if(listPlayListSize[i]==nowPlayName){
                if(i==0){
                    alert("已经是第一首了");
                }else {
                    setTimeout( function () {playAudio(listPlayListSize[i-1])} , 500 );
                }
            }
        }

    }else if("next"==type){
        autoPlayNextAduio(nowPlayName);
    }
}

// 标记音频收藏
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
        dataType: "json",
        success: function (objReturn) {
            if(objReturn.code==200){
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

/*****************************************************/
/* 显示控制 */

/* 控制页面显示隐藏 */
/*  1.选择类型 2.目录 3.音频播放 */
/* 点击菜单用，最上面的目录用 */
function showType(type) {

    $("#header-index").html(header_index);
    $("#header-dir").html(header_dir);

    if(type=='cc-parent'){
    // 展示目录,隐藏 类型和音频
        $("#cc-parent").attr("style","");
        $("#cc-dir").attr("style","display: none;");
        $("#cc-play").attr("style","display: none;");

        //header
        $("#header-index").attr("style","display: none;");
        $("#header-dir").attr("style","display: none;");

    }else if(type=='cc-dir'){
    // 展示音频,隐藏 目录和类型
        $("#cc-dir").attr("style","");
        $("#cc-parent").attr("style","display: none;");
        $("#cc-play").attr("style","display: none;");

        //header
        $("#header-index").attr("style","");
        $("#header-dir").attr("style","display: none;");
    }else if(type=='cc-play'){
    // 展示音频,隐藏 类型和目录
        $("#cc-play").attr("style","");
        $("#cc-parent").attr("style","display: none;");
        $("#cc-dir").attr("style","display: none;");

        //header
        $("#header-index").attr("style","");
        $("#header-dir").attr("style","");
    }

}
// header 首页:无; 目录:首页 音频: 首页,目录
function showHeader(type) {
    if(type=='cc-parent'){
        // 展示目录,隐藏 类型和音频
        $("#cc-parent").attr("style","");
        $("#cc-dir").attr("style","display: none;");
        $("#cc-play").attr("style","display: none;");
    }else if(type=='cc-dir'){
        // 展示音频,隐藏 目录和类型
        $("#cc-dir").attr("style","");
        $("#cc-parent").attr("style","display: none;");
        $("#cc-play").attr("style","display: none;");
    }else if(type=='cc-play'){
        // 展示音频,隐藏 类型和目录
        $("#cc-play").attr("style","");
        $("#cc-parent").attr("style","display: none;");
        $("#cc-dir").attr("style","display: none;");
    }
}

// 定时 上传播放时间 一分钟一次
// setTimeout( function () {playAudio(mapPlayList[param]);} , 500 );

// 用户名