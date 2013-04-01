define(function(require,exports,module){

    var Inspector = require("inspector");
    var frame = $("#frm");
    var go = $("#go")
    var inspect_start = false;
    var inspector;

    frame.on("load",function(){

        inspector = new Inspector({
            doc:frame.get(0).contentWindow.document
        });

        go.on("click",function(){
            inspect_start = !inspect_start;
            inspector.active(inspect_start);
        });

    });
});