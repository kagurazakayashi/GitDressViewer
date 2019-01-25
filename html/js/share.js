var debug = false;
function loadfail(errinfo) {
    $("body").append('<div class="error">'+errinfo+'<div>网页已停止运行，请后退或刷新后再试。</div></div>');
}
function resizetitle() {
    const title = $("#title");
    const windowheight = $(window).height();
    const top = (windowheight*0.5-title.height()*0.5)+"px";
    title.stop();
    title.animate({"top":top},500);
}
function formatjson(json) {
    json = replaceall("\n","",json);
    json = replaceall(",]","]",json);
    return $.parseJSON(json);
}
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) return unescape(r[2]); return null;
}
function replaceall(replaceThis, withThis, inThis) {
    withThis = withThis.replace(/\$/g,"$$$$");
    return inThis.replace(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g,"\\$&"),"g"), withThis);
}