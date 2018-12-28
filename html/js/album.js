const albumlist = $("#albumlist");
$(document).ready(function() {
    albumbox();
    reposalbumbox();
});
$(window).resize(function() {
    reposalbumbox();
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
function reposalbumbox() {
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