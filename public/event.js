define(function(require,exports,module){

    function on(name,func){
        var events = this.events = this.events || {};
        var thisEvent = events[name] = events[name] || [];
        thisEvent.push(func);
    }

    function off(name){
        delete this.events[name];
    }

    function fire(name,eventArgs){
        var self = this;
        var events = this.events[name] || [];
        events.forEach(function(func){
            func.call(self,eventArgs);
        });
    }



    function mixin(target){
        if(typeof target == "function"){
            target.prototype.on = on;
            target.prototype.off = off;
            target.prototype.fire = fire;
        }
    }

    module.exports = {
        fire:fire,
        mixin:mixin,
        on:on,
        off:off
    }
});