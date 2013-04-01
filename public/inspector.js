define(function(require,exports,module){

    var Dyer = require("dyer");


    function Inspector(opt){
        var doc = this.doc = opt.doc;
        var self = this;
        $(doc.body).on("mouseover",function(e){
            if(self._active){
                Dyer.dyne(e.target,doc);
            }
        }).on("mouseout",function(){
            Dyer.clear();
        });
    }

    Inspector.prototype.active = function(active){
        this._active = active;
    }

    module.exports = Inspector;

});