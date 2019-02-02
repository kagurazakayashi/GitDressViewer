console.log(window.name);
$(document).ready(function() {
    setTimeout(function(){animatestart();},500);
});
function animatestart() {
    const menuitem1 = $("#menuitem1");
    const menuitem2 = $("#menuitem2");
    const speeds = 2000;
    menuitem1.animate({"left":0},speeds,function(){
        menuitem1.css({
            "top":"-500%",
            "height":"550%",
            "left":"-500%",
            "width":"1100%"
        });
        $("#icobl").css("display","inline");
        $("#menubox").css("animation","menuboxrotate 1s linear forwards");
    });
    $("#triangle-facing-right").animate({"left":0},speeds);
    menuitem2.animate({"left":0},speeds,function(){
        menuitem2.css({
            "top":"50%",
            "height":"550%",
            "left":"-500%",
            "width":"1100%"
        });
        $("#icotr").css("display","inline");
    });
}