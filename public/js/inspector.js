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
            color:"rgb(161, 209, 228)"
        });

        $(doc.body).on("mouseover",function(e){
            if(self._active){
                dyer.dyne(e.target,doc);
            }
        }).on("mouseout",function(){
            dyer.clear();
        }).on("click",function(e){
            self.fire("pick",e.target);
        });
    }

    Event.mixin(Inspector);

    Inspector.prototype.active = function(active){
        this._active = active;
    }

    module.exports = Inspector;

});