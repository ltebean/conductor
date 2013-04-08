define(function(require,exports,module){

    var Identifier = require("identifier");
    var Inspector = require("inspector");
    var PageKey = location.href.match(/\/edit\/(\d+)/)[1];
    var PageUrl = null;

    var loaded = false;
    var active = true;
    var inspector;



    function toggle(){
        if(!loaded){
            active = true;
            $(this).val("waiting for iframe loaded");
        }else{
            inspector.toggleActive();
        }
    }
    $("#go").tooltip();
    $("#go").on("click",toggle);
    $(document).on("keyup",function(e){
        if(e.keyCode == 32){
            toggle()
        }
        if(e.keyCode == 27){
            edit_scope.close();
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
                type:"Add",
                selector:selector,
                parent:"body"
            });
            edit_scope.pop();
            inspector.setActive(false);
            edit_scope.pos({
                x:e.clientX + 50,
                y:e.clientY - 25
            });
            edit_scope.off();
            edit_scope.on("close",function(){
                inspector.setActive(true);
            })
            edit_scope.on("done",function(){
                rules_scope.add({
                    key:this.key || "hey_name_me",
                    selector:this.selector,
                    parent:this.parent,
                    multi:this.multi,
                    action:this.action,
                    cases:this.cases
                });
            });
        });

        rules_scope.doc = doc;
        rules_scope.dyeall();
    });

    /**
     * The Angular App
     * @type {[type]}
     */
    var app = angular.module("app",[]);
    app.controller('Rules', require("rules-controller"));
    app.controller('EditPanel', require("editpanel"));
    angular.bootstrap(document,['app']);


    var rules_scope = angular.element($("#pane")).scope();
    var edit_scope = angular.element($("#edit_pane")).scope();
    
    /**
     * Edit One
     */
    rules_scope.on("edit",function(row){
        row.active = true;
        edit_scope.init(row.rule);
        edit_scope.pop();
        console.log(row);
        edit_scope.pos({
            x:700,
            y:row.$index * 20
        });
        edit_scope.off();
        edit_scope.on("close",function(){
            inspector.setActive(true);
            row.active = false;
        });
        edit_scope.on("done",function(){
            rules_scope.updateRule(row,this);
        });
    });

    rules_scope.on("save",function(data){
        $.post("/ajax/ga/page/"+PageKey,{
            config:JSON.stringify(data),
            url:PageUrl
        });
    });

    /**
     * Rules in Window
     */
    $.get("/ajax/ga/page/"+PageKey,function(data){
        var config = data.config;
        if(config){
            try{
                config = JSON.parse(config);
                config.forEach(function(rule){
                    rules_scope.add(rule);
                });
            }catch(e){}
        }
        PageUrl = data.url;
        $("#frm").attr("src",data.url);
    });

});