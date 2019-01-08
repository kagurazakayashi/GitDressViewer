var name = null;
$(document).ready(function() {
    loaddata();
    resize();
});
$(window).resize(function() {
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
    }
}
function resize() {
    const title = $("#title");
    const windowheight = $(window).height();
    const top = (windowheight*0.5-title.height()*0.5)+"px";
    title.stop();
    title.animate({"top":top},500);
}
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) return unescape(r[2]); return null;
}