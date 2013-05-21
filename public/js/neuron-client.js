/**
 * Neuron Client for GA Conductor
 */
DP.provide(["io/jsonp","event/live","util/json"],function(D,JSONP,Live,JSON){
    var $ = D.DOM;
    var SCRIPT_NODE = $("#ga-conductor");
    var attrs = {};
    var funcs = {};
    var dataset = [],attr;
    for (var i=0, node_attrs=SCRIPT_NODE.el(0).attributes, l=node_attrs.length; i<l; i++){
        attr = node_attrs.item(i).nodeName;
        if(attr.indexOf("data-") == 0){
            dataset.push(attr);
        }
    }

    dataset.forEach(function(k){
        attrs[k.split("data-")[1]] = SCRIPT_NODE.attr(k);
    });

    function appendRule(rule){
        var key = D.sub(rule.key,attrs);
        var action = rule.action;
        var cb = rule.cb;
        var parent = rule.parent;
        var selector = rule.selector;
        var els = $.all([parent,selector].join(" "));

        function logCurrent(){
            var n = els.el().indexOf(this) + 1;
            var func = funcs[cb] || dpga;
            func(D.sub(key,{n:n}),action);
        }

        if(action == "hover"){
            action = "mouseenter";
        }

        if(action == "show" && els.count()){
            els.forEach(logCurrent);
        }else{
            Live.on(parent,action,selector,logCurrent);
        }
    }

    new JSONP({
        url:"http://localhost:3000/api/page/"+attrs["pagekey"]
    }).on("success",function(json){
        var config,callback;
        try{
            config = JSON.parse(json.config);
            config.pv && dpga(config.pv);
            config.rules.forEach(appendRule);
        }catch(e){}

        try{
            callback = JSON.parse(json.callback);
            for(var cb in callback){
                funcs[cb] = new Function("key,action",callback[cb]);
            }
            console.log(funcs);
        }catch(e){}
    }).send();
});
