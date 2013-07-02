/**
 * 元素检查器
 */
define(function(require,exports,module){

    var Dyer = require("dyer");
    var Event = require("event");


    function Inspector(opt){
        var doc = this.doc = opt.doc;
        var self = this;
        
        var dyer = this.dyer =  new Dyer({
            doc:doc,
            color:"rgb(161, 209, 228)",
            active:true
        });

        this._active = opt.active || false;
        this.toggle = opt.toggle;
        this.showToggle();
        
        $(doc.querySelectorAll("*")).on("mouseover",function(e){
            if(self._active && e.target != doc.body){
                dyer.clear();
                dyer.dye(e.target);
            }
        }).on("click",function(e){
            e.preventDefault();

            var href = $(this).attr("href");
            var url = document.createElement("a");
            var host;
            url.href = doc.location.href.match(/url=(.*)/)[1];
            host = url.host;
            if(href && (e.ctrlKey || e.metaKey)){
                url.href = href;
                if(!host.match(".dianping.com")){
                    host = prompt("where'd you go?");   
                }
                doc.location.href = "/proxy?url=" + ("http://" + host + url.pathname);
            }
            if(self._active){
                e.stopPropagation();
                self.fire("pick",e);
            }
        });
    }

    Event.mixin(Inspector);

    Inspector.prototype.setActive = function(active){
        this._active = active
    }


    Inspector.prototype.toggleActive = function(){
        this._active = !this._active;
        if(!this._active){
            this.dyer.clear();
        }
        this.showToggle();
    }

    Inspector.prototype.showToggle = function(){
        this.toggle[this._active?"addClass":"removeClass"]("active");
    }

    module.exports = Inspector;

});