define(function(require,exports,module){

    var event = require("event");


    var Drag = function (opt) {
        var self = this,
            elem = self.elem = opt.elem,
            handler = self.handler = opt.handler || opt.elem,
            body = $("body"),
            bodysize = {
                width:$(body).width(),
                height:$(body).height()
            };

        self._dragging = false;
        self._events = {};

        self._events.mousedown = function(e){
            self.start(e);
        }
        self._events.mousemove = function(e,innerE){
            var event = e.clientX ? e : innerE;
            self.drag(event);
        }
        self._events.mouseup = function(e){
            self.end(e);
        }

        handler.on("mousedown", self._events.mousedown);
        body.on("mousemove", self._events.mousemove);
        body.on("mouseup", self._events.mouseup);
        return this;
    }

    Drag.prototype = {
        start: function (e) {
            var self = this;

            self._dragging = true;

            self._lastposition = {
                x: e.clientX,
                y: e.clientY
            };

            self.fire("dragstart", e);
        },
        drag: function (e) {
            var self = this,
                elem = self.elem,
                lastposition = self._lastposition,
                offsetparent, offset, parentOffset,
                left, top, x, y, nextx, nexty;

            if (self._dragging) {
                offsetparent = elem.parent();
                offset = elem.offset();
                parentOffset = offsetparent.offset();
                top = parseFloat(elem.css("top")) || 0;
                left = parseFloat(elem.css("left")) || 0;
                x = e.clientX;
                y = e.clientY;
                nexty = top + y - lastposition.y;
                nextx = left + x - lastposition.x;

                elem.css("left", nextx);
                elem.css("top", nexty);

                self._lastposition = {
                    x: x,
                    y: y
                }

                self.fire("drag", e);
            }
        },
        end: function (e) {
            var self = this;

            self._dragging = false;
            self.fire("dragend", e);
        },
        destruct: function () {
            var self = this,
                handler = self.handler,
                body = $("body"),
                events = self._events;

            // handler.off("mousedown", self._events.mousedown);
            body.off("mousemove", self._events.mousemove);
            body.off("mouseup", self._events.mouseup);
            delete events.mouseup;
            delete events.mousedown;
            delete events.mousemove;
        }
    }
    event.mixin(Drag);
        
    module.exports = Drag;
});