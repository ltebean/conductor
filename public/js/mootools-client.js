(function(D){
    var JSONP = D.JSONP;
    var SCRIPT_NODE = $("ga-conductor");
    var attrs = {};

    function Live(elem,event,selector,func){
        $$(elem).addEvent(event,function(e){
            var elem = e.target;
            while(elem != document.body){
                if(elem.match(selector)){
                    func.call(e.target);
                }
                elem = elem.getParent()
            }
            
        });
    }

    ["city","channel","pagekey"].forEach(function(k){
        attrs[k] = SCRIPT_NODE.get("data-"+k);
    });

    function appendRule(rule){
        var key = rule.key.substitute(attrs);
        var action = rule.action;
        var parent = rule.parent;
        var selector = rule.selector;
        var els = $$([parent,selector].join(" "));
        if(action == "hover"){
            action = "mouseenter";
        }

        if(action == "show" && els.length){
            dpga(key);
        }else{
            Live(parent,action,selector,function(){
                var n = els.indexOf(this) + 1;
                dpga(key.substitute({n:n}));
            });
        }
    }

    new JSONP({
        url:"/api/page/"+attrs["pagekey"],
        onSuccess:function(json){
            var config;
            try{
                config = JSON.decode(json.config);
                config.pv && dpga(config.pv);
                config.rules.forEach(appendRule);
            }catch(e){}
        }
    }).send();
})(DP);