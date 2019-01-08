const albumlist = $("#albumlist");
var albumhtml = null;
var debug = true;
var scroll = 0;
$(document).ready(function() {
    loaddata();
    gotopage();
});
$(window).resize(function() {
    resize();
    albumbox();
});
$(document).keydown(function(e) {
    const key = e.which;
    const left = albumlist.scrollLeft();
    const windowheight = $(window).width();
    if (key == 34 || key == 32 || key == 68 || key == 83 || key == 40 || key == 39) {
        albumlist.stop();
        albumlist.animate({scrollLeft:(left + windowheight)},500);
    } else if (key == 33 || key == 87 || key == 65 || key == 37 || key == 38) {
        albumlist.stop();
        albumlist.animate({scrollLeft:(left - windowheight)},500);
    }
});
$(document).on("mousewheel DOMMouseScroll", function (e) {
    var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
    albumlist.scrollLeft(albumlist.scrollLeft() - delta * 50);
});
var toucholdx = 0;
$(window).on('touchstart',function(e) {
    const touch = e.originalEvent.targetTouches[0];
    toucholdx = touch.pageX;
});
$(albumlist).on('touchmove',function(e) {
    const touch = e.originalEvent.targetTouches[0];
    const pagex = touch.pageX;
    const msx = toucholdx - pagex;
    toucholdx = pagex;
    albumlist.scrollLeft(albumlist.scrollLeft() + msx);
    e.preventDefault();
});

function albumbox(windowheight) {
    const albumboxh = $("#albumlist").height() * 0.5;
    $(".albumbox").css({"width":albumboxh,"height":albumboxh});
}
function resize() {
    const title = $("#title");
    const windowheight = $(window).height();
    const top = (windowheight*0.5-title.height()*0.5)+"px";
    title.stop();
    title.animate({"top":top},500);

    const albumboxh = $("#albumlist").height() * 0.5;
    var line = 0;
    var row = 0;
    $(".albumbox").each(function(){
        $(this).css({"top":(albumboxh*line),"left":(albumboxh*row)});
        line++;
        if (line > 1) {
            line = 0;
            row++;
        }
    });

    const coverbox = $(".coverbox");
    const albumwidth = $(".album").width();
    const coverboxwh = 330;
    const coverscale = albumwidth / coverboxwh;
    const coverpos = 0 - ((coverbox.width() - albumwidth) / 2);
    coverbox.css({"transform":"scale("+coverscale+")","left":coverpos,"top":coverpos});
}
function loaddata() {
    $.ajax({
        type: "get",
        dataType: "text",
        url: 'album/list.json',
        success: function (data) {
            $("#albumlistsub1").html(createlist(formatjson(data)));
            albumbox();
            resize();
        },
        error:function (err) {
            console.log("取得数据失败：",err);
        }
    });
}
function gotopage() {
    var scroll = GetQueryString("scroll");
    if (scroll != null && scroll != "null") {
        albumlist.animate({scrollLeft:scroll},500);
    }
}
function formatjson(json) {
    json = replaceall("\n","",json);
    json = replaceall(",]","]",json);
    return $.parseJSON(json);
}
function openalbum(albumid,name) {
    $("#subtitle").text("L o a d i n g ...");
    const album = $("#album_"+albumid);
    const top = 0 - album.height();
    const url = "index.html?id="+albumid+"&name="+encodeURIComponent(name)+"&scroll="+albumlist.scrollLeft();
    album.animate({"top":top+"px"},500,function () {
        albumlist.animate({scrollLeft:0},500,function () {
            $("#albumlistsub1").remove();
            window.location.replace(url);
        });
    });
}
function replaceall(replaceThis, withThis, inThis) {
    withThis = withThis.replace(/\$/g,"$$$$");
    return inThis.replace(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g,"\\$&"),"g"), withThis);
}
function createlist(jsonarr) {
    var allhtml = "";
    const albumlistsub1 = $("#albumlistsub1");
    if (albumhtml == null) {
        albumhtml = albumlistsub1.html();
        albumlistsub1.empty();
    }
    for (i in jsonarr)
    {
        var nowalbumname = jsonarr[i];
        var newalbumhtml = albumhtml;
        var albumcoverimg = "album/"+encodeURIComponent(nowalbumname)+"/1-s.webp";
        if (debug) albumcoverimg = "img/default.gif";
        newalbumhtml = replaceall("#albumid#",i,newalbumhtml);
        newalbumhtml = replaceall("#albumname#",nowalbumname,newalbumhtml);
        newalbumhtml = newalbumhtml.replace("#albumcoverimg#",albumcoverimg);
        allhtml += newalbumhtml;
    }
    return allhtml;
}
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) return unescape(r[2]); return null;
}