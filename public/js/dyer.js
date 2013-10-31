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
        if(opt.active == true){
            Dyer.activeInstance = this;
        }
    }

    /**
     * 渲染单个元素 覆盖层于元素上
     * @param  {Element} elem    [description]
     * @param  {Number} index [description]
     * @return {[type]}         [description]
     */
    Dyer.prototype.dye = function(elem,opt){
        elem = $(elem,this.doc);

        if(!elem.is(":visible")){return false;}
        var offset = elem.offset();
        var film = $("<div />").css({
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

        if(opt && opt.label){
            var tip = film.find(".tip");
            if(!tip.length){
                tip = $("<div />").css({
                    "height":14,
                    "line-height":"14px",
                    "text-align":"center",
                    "background-color": opt.label_color || "#111111",
                    "opacity":"0.7",
                    "position":"absolute",
                    "top":0,
                    "left":0,
                    "color":"#fff"
                }).addClass("tip");
                tip.appendTo(film);
            }
            tip.html(opt.label);
        }
        
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