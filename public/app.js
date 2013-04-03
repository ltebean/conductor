define(function(require,exports,module){

    var Identifier = require("identifier")
    var Inspector = require("inspector");


    var frame = $("#frm");
    var go = $("#go");
    var inspect_start = false;
    var inspector;
    
    go.on("click",function(){
        if(inspector){
            inspect_start = !inspect_start;
            inspector.active(inspect_start);
        }
    });

    frame.on("load",function(){
        var win = frame.get(0).contentWindow;
        var doc = win.document;
        var identifier = new Identifier(doc);

        /**
         * 元素检查器
         * @type {Inspector}
         */
        inspector = new Inspector({
            win:win,
            doc:doc
        });


        inspector.on("pick",function(elem){
            var selector = identifier.identify(elem,{
                doc:doc,
                mode:"single"
            });
            console.log(selector);
        });

    });
});