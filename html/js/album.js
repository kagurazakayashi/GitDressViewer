const albumlist = $("#albumlist");
$(document).ready(function() {
    albumbox();
    resize();
});
$(window).resize(function() {
    resize();
});
$(document).keydown(function(e)  {
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
    title.css("top",(windowheight*0.5-title.height()*0.5)+"px");

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
}