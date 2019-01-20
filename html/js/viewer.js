var name = null;
var isreadme = false;
var nowpage = 1;
var allpage = 0;
var scling = false;
$(document).ready(function() {
    loaddata();
    resize();
});
$(window).resize(function() {
    formatallimage();
});
$(document).keydown(function(e) {
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
                console.log("取得数据失败：",err);
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
                console.log("取得数据失败：",err);
            }
        });
    }
}
function loadpictures(imgjson) {
    const albumboxlayerbox = $("#albumboxlayerbox");
    albumboxlayerbox.animate({"left":0},1000,function(){
        if (!isreadme) btnnext();
    });
    allpage = imgjson.length;
    for (i in imgjson) {
        const ii = allpage - parseInt(i) + 1;
        const imgconnttxt = ii+'/'+allpage;
        var url = 'album/'+name+'/'+(ii-1)+'-m.webp';
        if (debug) url = "img/default.gif";
        var imghtml = '<div id="albumboxpage'+ii+'" class="albumboxpage albumboxlayer"><img class="pageimage" src="'+url+'" alt="'+imgconnttxt+'" onload="formatimage(this);" /></div>';
        albumboxlayerbox.append(imghtml);
    }
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
        const pagestr = nowpage + "/" + (allpage + 1);
    }
}
function btnnext() {
    if (nowpage <= allpage && !scling) {
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
        const pagestr = nowpage + "/" + (allpage + 1);
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