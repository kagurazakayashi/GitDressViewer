var name = null;
var isreadme = false;
var nowpage = 1;
var total = 0;
var scling = false;
$(document).ready(function() {
    loaddata();
    resize();
});
$(window).resize(function() {
    formatallimage();
});
$(document).keydown(function(e) {
    const key = e.which;
    if (key == 34 || key == 32 || key == 68 || key == 83 || key == 40 || key == 39) {
        btnnext();
    } else if (key == 33 || key == 87 || key == 65 || key == 37 || key == 38) {
        btnprev();
    }
});
$(document).on("mousewheel DOMMouseScroll", function (e) {
});
function loaddata() {
    name = GetQueryString("name");
    if (name == null || name == "null") {
        window.location.replace("album.html");
    } else {
        $("#subtitle").text(name);
        $.ajax({
            type: "get",
            dataType: "text",
            url: 'album/'+name+'/README.md.html',
            success: function (data) {
                if (data && data.length > 1) {
                    $("#readme").html(data+"<p>&emsp;</p>");
                    $("#readme a").attr("target","_blank");
                    isreadme = true;
                }
            },
            error:function (err) {
                loadfail("错误：获取自述文件没有成功。");
            }
        });
        $.ajax({
            type: "get",
            dataType: "text",
            url: 'album/'+name+'/info.json',
            success: function (data) {
                loadpictures(formatjson(data));
            },
            error:function (err) {
                loadfail("错误：获取相册数据没有成功。");
            }
        });
    }
}
function loadpictures(imgjson) {
    const albumboxlayerbox = $("#albumboxlayerbox");
    albumboxlayerbox.animate({"left":0},1000,function(){
        if (!isreadme) btnnext();
    });
    total = imgjson.length;
    for (i in imgjson) {
        const ii = total - parseInt(i) + 1;
        const imgconnttxt = ii+'/'+total;
        var url = 'album/'+name+'/'+(ii-1)+'-m.'+imgformat;
        if (debug) url = "img/default.gif";
        var imghtml = '<div id="albumboxpage'+ii+'" class="albumboxpage albumboxlayer touchdiv"><img class="pageimage" src="'+url+'" alt="'+imgconnttxt+'" onload="formatimage(this);setprogress();" /><div class="pagenum">'+ii+' / '+(total+1)+'</div></div>';
        albumboxlayerbox.append(imghtml);
    }
    $(".touchdiv").on("touchstart", function(e) {
        if (e.cancelable) {
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }   
        startX = e.originalEvent.changedTouches[0].pageX,
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $(".touchdiv").on("touchend", function(e) {
        if (e.cancelable) {
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
        moveEndX = e.originalEvent.changedTouches[0].pageX,
        moveEndY = e.originalEvent.changedTouches[0].pageY,
        X = moveEndX - startX,
        Y = moveEndY - startY;
        if ( X > 0 ) {
            btnprev();         
        }
        else if ( X < 0 ) {
            btnnext();
        }
    });
}
function formatallimage() {
    $(".pageimage").each(function (i){
        formatimage(this);
    });
}
function formatimage(imagevobj) {
    const imageo = $(imagevobj);
    const imagev = $("#albumboxpage0");
    const imagevh = imagev.height();
    const imageoh = imageo.height();
    const imagevw = imagev.width();
    const imageow = imageo.width();
    const imagevtop = (imagevh * 0.5 - imageoh * 0.5) + "px";
    const imagevleft = (imagevw * 0.5 - imageow * 0.5) + "px";
    imageo.css({"top":imagevtop,"left":imagevleft});
}
function resize() {
    resizetitle();
}
function btnprev() {
    if (nowpage > 1 && !scling) {
        scling = true;
        const nowpageobj = $("#albumboxpage"+(nowpage-1));
        const pagectlshadow = $("#pagectlshadow");
        nowpageobj.css("display","block");
        nowpageobj.animate({"left":0,"right":"20px"},500,function() {
        });
        pagectlshadow.css({"display":"block","right":"100%","opacity":1});
        pagectlshadow.animate({"left":0,"right":"20px","opacity":0},500,function() {
            pagectlshadow.css("display","none");
            scling = false;
        });
        nowpage--;
        const pagestr = nowpage + "/" + (total + 1);
    }
}
function btnnext() {
    if (nowpage <= total && !scling) {
        scling = true;
        const nowpageobj = $("#albumboxpage"+nowpage);
        const pagectlshadow = $("#pagectlshadow");
        nowpageobj.animate({"left":"-100%","right":"100%"},500,function() {
            nowpageobj.css("display","none");
        });
        pagectlshadow.css({"display":"block","right":"20px","opacity":0});
        pagectlshadow.animate({"left":0,"right":"100%","opacity":1},500,function() {
            pagectlshadow.css("display","none");
            scling = false;
        });
        nowpage++;
        const pagestr = nowpage + "/" + (total + 1);
    }
}
function btnclose() {
    if (scling) return;
    scling = true;
    const albumboxlayerbox = $("#albumboxlayerbox");
    const albumboxlayerboxw = (0-albumboxlayerbox.width())+"px";
    var url = "album.html";
    scroll = GetQueryString("scroll");
    if (scroll != null && scroll != "null") {
        url = url + "?scroll=" + scroll;
    }
    albumboxlayerbox.animate({"left":albumboxlayerboxw},500,function() {
        window.location.replace(url);
    });
}