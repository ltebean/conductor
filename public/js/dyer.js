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
        this.films = [];
        this.index=opt.index||(opt.index==0?0:"");
        if(opt.active == true){
            Dyer.activeInstance = this;
        }
    }

    /**
     * 渲染单个元素 覆盖层于元素上
     * @param  {Element} elem    [description]
     * @param  {} context [description]
     * @return {[type]}         [description]
     */
    Dyer.prototype.dye = function(elem){
        elem = $(elem,this.doc);

        if(!elem.is(":visible")){return false;}
        var offset = elem.offset();
        var film = $("<div>"+this.index+"</div>").css({
            "position":"absolute",
            "background-color":this.color,
            "opacity":.8,
            "width":elem.outerWidth(),
            "height":elem.outerHeight(),
            "top":offset.top,
            "left":offset.left,
            "pointer-events":"none",
            "z-index":9999
        });
        this.films.push(film);
        film.appendTo(this.doc.body);
    }

    Dyer.prototype.getDoc = function(){
        return this.doc;
    }

    Dyer.prototype.clear = function(){
        var film;
        while(this.films.length){
            film = this.films.pop();
            film.remove();
        }
    }

    module.exports = Dyer;

});