define(function(require,exports,module){

    var Identifier = require("identifier")
    var Inspector = require("inspector");

    var frame = $("#frm");
    var go = $("#go");
    var inspect_start = false;
    var loaded = false;
    var inspector;

    var global_scope = angular.element(document).scope();


    go.on("click",function(){
        if(inspector && loaded){
            inspect_start = !inspect_start;
            inspector.active(inspect_start);
        }
    });


    frame.on("load",function(){
        loaded = true;
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
            var scope = angular.element($(".nav")).scope();
            scope.add({a:selector});
        });
    });

    /**
     * The Angular App
     * @type {[type]}
     */
    var RulesController = require("rules-controller");
    var app = angular.module("app",[]);
    app.controller('Rules', RulesController);
    angular.bootstrap(document,['app']);

});