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
        
        $(doc.body).on("mouseover",function(e){
            if(self._active){
                dyer.dye(e.target,doc);
            }
        }).on("mouseout",function(){
            if(self._active){
                dyer.clear();
            }
        }).on("click",function(e){
            e.preventDefault()
            if(self._active){
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
        this.showToggle();
    }

    Inspector.prototype.showToggle = function(){
        this.toggle.val(this._active?"好了":"添加");
    }

    module.exports = Inspector;

});