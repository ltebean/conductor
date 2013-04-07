define(function(require,exports,module){

    var Identifier = require("identifier");
    var Inspector = require("inspector");


    var loaded = false;
    var active = false;
    var inspector;


    $("#go").on("click",function(){
        if(!loaded){
            active = true;
            $(this).val("载好就能用了");
        }else{
            inspector.toggleActive();
        }
    });

    /**
     * 页面加载完毕后
     */
    $("#frm").on("load",function(){
        loaded = true;
        var win = $(this).get(0).contentWindow;
        var doc = win.document;
        var identifier = new Identifier(doc);


        /**
         * 元素检查器
         * @type {Inspector}
         */
        inspector = new Inspector({
            toggle:$("#go"),
            active:active,
            win:win,
            doc:doc
        });

        /**
         * 选定元素
         */
        inspector.on("pick",function(e){
            var selector = identifier.identify(e.target,{
                mode:"single"
            });
            edit_scope.init({
                selector:selector,
                parent:""
            });
            edit_scope.pop();
            inspector.setActive(false);
            $("#edit_pane").find("#ga-key").get(0).focus()
            edit_scope.pos(e);
            edit_scope.off("done");
            edit_scope.on("done",function(){
                console.log(this);
                inspector.setActive(true);
                pane_scope.add({
                    a:this.key
                });
            });
        });
    });

    /**
     * The Angular App
     * @type {[type]}
     */
    var app = angular.module("app",[]);
    app.controller('Rules', require("rules-controller"));
    app.controller('EditPanel', require("editpanel"));
    angular.bootstrap(document,['app']);


    var pane_scope = angular.element($("#pane")).scope();
    var edit_scope = angular.element($("#edit_pane")).scope();
    
    /**
     * Rules in Window
     */
    window.rules.forEach(function(rule){
        pane_scope.add(rule)
    });

});