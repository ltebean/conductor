DP.provide(["io/jsonp","event/live","util/json"],function(D,JSONP,Live,JSON){
    var $ = D.DOM;
    var SCRIPT_NODE = $("#ga-conductor");
    var attrs = {};

    ["city","channel","pagekey"].forEach(function(k){
        attrs[k] = SCRIPT_NODE.attr("data-"+k);
    });

    function appendRule(rule){
        var key = D.sub(rule.key,attrs);
        var action = rule.action;
        var parent = rule.parent;
        var selector = rule.selector;
        var els = $.all([parent,selector].join(" "));
        if(action == "hover"){
            action = "mouseenter";
        }

        if(action == "show" && els.count()){
            dpga(key);
        }else{
            Live.on(parent,action,selector,function(){
                var n = els.el().indexOf(this) + 1;
                dpga(D.sub(key,{n:n}));
            });
        }
    }

    new JSONP({
        url:"/api/page/"+attrs["pagekey"],
    }).on("success",function(json){
        var config;
        try{
            config = JSON.parse(json.config);
            config.pv && dpga(config.pv);
            config.rules.forEach(appendRule);
        }catch(e){}
    }).send();
});