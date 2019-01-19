var name = null;
var isreadme = false;
var nowpage = 1;
var allpage = 0;
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
                // $("#albumlistsub1").html(createlist());
                // albumbox();
                // resize();
            },
            error:function (err) {
                console.log("取得数据失败：",err);
            }
        });
    }
}
function loadpictures(imgjson) {
    const albumboxlayerbox = $("#albumboxlayerbox");
    albumboxlayerbox.animate({"left":0},1000);
    const boxh = albumboxlayerbox.height();
    const boxw = albumboxlayerbox.width();
    allpage = imgjson.length;
    for (i in imgjson) {
        const nowimgsize = imgjson[i];
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
    if (nowpage > 1) {
        const nowpageobj = $("#albumboxpage"+(nowpage-1));
        nowpageobj.css("display","block");
        nowpage--;
        const pagestr = nowpage + "/" + (allpage + 1);
    }
}
function btnnext() {
    if (nowpage <= allpage) {
        const nowpageobj = $("#albumboxpage"+nowpage);
        nowpageobj.css("display","none");
        nowpage++;
        const pagestr = nowpage + "/" + (allpage + 1);
    }
}
function btnclose() {
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