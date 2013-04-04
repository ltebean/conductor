/**
 * 元素染色器
 */
define(function(require,exports,module){

    /**
     * 构造器
     * @param {Object} opt {context:HTMLDocument,color:String}
     */
    function Dyer(opt){
        this.doc = opt.doc || document;
        this.color = opt.color;
    }

    /**
     * 渲染单个元素 覆盖层于元素上
     * @param  {Element} elem    [description]
     * @param  {} context [description]
     * @return {[type]}         [description]
     */
    Dyer.prototype.dyne = function(elem){
        elem = $(elem);
        var doc = this.doc;
        var offset = elem.offset();
        var film = $("<div />").css({
            "position":"absolute",
            "background-color":this.color,
            "opacity":.8,
            "width":elem.width() + parseInt(elem.css("paddingLeft")) + parseInt(elem.css("paddingRight")),
            "height":elem.height() + parseInt(elem.css("paddingTop")) + parseInt(elem.css("paddingBottom")),
            "top":offset.top,
            "left":offset.left,
            "pointer-events":"none",
            "z-index":9999
        });
        this.current = film;
        film.appendTo(doc.body);
    }

    Dyer.prototype.clear = function(){
        var current = this.current
        current && current.remove();
        current = null;
    }

    module.exports = Dyer;

});