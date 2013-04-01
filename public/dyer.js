define(function(require,exports,module){


    var current;

    function dyne(elem,context){
        elem = $(elem);

        var doc = context || document;
        var offset = elem.offset();
        var film = $("<div />").css({
            "position":"absolute",
            "background-color":"rgb(161, 209, 228)",
            "opacity":.8,
            "width":elem.width(),
            "height":elem.height(),
            "top":offset.top,
            "left":offset.left,
            "pointer-events":"none",
            "z-index":9999
        });
        current = film;
        film.appendTo(doc.body);
    }

    function clear(){
        current && current.remove();
        current = null;
    }

    module.exports = {
        dyne:dyne,
        clear:clear
    };

});