define(function(require,exports,module){

    var Identifier = require("identifier");
    var Inspector = require("inspector");
    var PageKey = location.href.match(/\/hippoStat\/([\w-]+)/)[1];
    var PageUrl = null;

    var parent_body = $(document.body);
    var storage = {};
    var loaded = false;
    var active = false;
    var inspector;
    
    function hasNthChild(str){
        if(!str){str = "";}
        return str.indexOf("nth-child")!=-1
    }

    window.hint = function hint(str){
        var elem;

        if(!hint.elem){
            elem = hint.elem = $("<div />").addClass("hint");
            elem.appendTo($("body"));
        }else{
            elem = hint.elem;
        }

        elem.html(str);

        elem.css("display","block");
        elem.css("opacity",0);
        elem.css("left",($(window).width() - elem.width()) / 2)

        elem.animate({
            opacity:100
        },500,function(){
            setTimeout(function(){
                elem.animate({
                    "opacity":0
                },500,function(){
                    elem.css("display","none")
                })
            },4000)
        })

    }

    function toggle(){
        if(!loaded){
            active = true;
            $(this).val("waiting for iframe loaded");
        }else{
            inspector.toggleActive();
        }
    }

    function keyboardEvents(e){
        // space
        if(e.keyCode == 32){
            toggle()
        }
        // esc
        if(e.keyCode == 27){
            edit_scope.close();
        }
    }

    $("#go").tooltip();
    $("#go").on("click",toggle);
    $(document).on("keyup",keyboardEvents);

    /**
     * 页面加载完毕后
     */
    $("#frm").on("load",function(){
        loaded = true;
        var win = $(this).get(0).contentWindow;
        var doc = win.document;
        var identifier = new Identifier(doc);
        $(doc).on("mousemove",function(e){
            parent_body.trigger("mousemove",[e]);
        });
        $(doc).on("keyup",keyboardEvents);
        $(doc).on("click",function(){
            edit_scope.close();
        });
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
                y:e.clientY - 75
            });
            edit_scope.off();
            edit_scope.on("close",function(){
                inspector.setActive(true);
            })
            edit_scope.on("done",function(){
                if(hasNthChild(this.parent) || hasNthChild(this.selector)){
                    hint("选择器中包含nth-child可能造成不同页面对应元素的不一致，建议后端同学加上class或id以获得更好的效果。")
                }
                rules_scope.add({
                    key:this.key || "hey_name_me",
                    selector:this.selector,
                    parent:this.parent,
                    multi:this.multi,
                    delegate:this.delegate,
                    action:this.action,
                    cb:this.cb,
                    cases:this.cases
                });
                rules_scope.save();
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

    app.directive('ngBlur', function() {
      return function( scope, elem, attrs ) {
        elem.bind('blur', function() {
          scope.$apply(attrs.ngBlur);
        });
      };
    });

    app.directive('ngEnter', function() {
      return function( scope, elem, attrs ) {
        elem.bind('keyup', function(e) {
            if(e.keyCode==13){
                scope.$apply(attrs.ngEnter);
            }
        });
      };
    });

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
            if(hasNthChild(this.parent) || hasNthChild(this.selector)){
                hint("选择器中包含nth-child可能造成不同页面对应元素的不一致，建议后端同学加上class或id以获得更好的效果。")
            }
            rules_scope.updateRule(row,this);
        });
    });

    function mergeConfig(mine,server){
        mine = JSON.parse(mine);
        server = JSON.parse(server);

        server.rules = server.rules || [];

        server.rules.forEach(function(server_item){
            if(!mine.rules.some(function(item){
                return item.key == server_item.key
            })){
                mine.rules.push(server_item);
            }
        });
        return JSON.stringify(mine);
    }

    rules_scope.on("save",function(data){

        var myconfig = JSON.stringify(data);

        $.get("/api/page/"+PageKey,function(serverdata){
            // 如果期间有过其他人做改动
            if(serverdata.config != storage.config){
                myconfig = mergeConfig(myconfig,serverdata.config);
            }

            storage.config = myconfig;

            $.post("/api/page/"+PageKey+"/config",{
                config:myconfig,
                url:PageUrl
            });
        });
    });

    /**
     * Rules in config
     */
    $.get("/api/page/"+PageKey,function(data){
        var config = data.config;
        var callbacks;

        storage.config = config;

        if(config){
            try{
                config = JSON.parse(config);
                config.rules.forEach(function(rule,index){
                    rule.index=index;
                    rules_scope.add(rule);
                });
                rules_scope.setPv(config.pv);
            }catch(e){}
        }
        PageUrl = data.url;

        try{
            callbacks = Object.keys(JSON.parse(data.callback));
        }catch(e){
            callbacks = ["ga"];
        }

        rules_scope.callbacks = callbacks;
        edit_scope.callbacks = callbacks;

        rules_scope.safeapply();
        edit_scope.cb = callbacks[0];
        $("#frm").attr("src","/proxy?url="+data.url);
    });

    $("#frm").css("width",$(window).width()-244);

});