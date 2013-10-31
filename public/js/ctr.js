define(function(require,exports,module){

    var PageKey = location.href.match(/\/ctr\/([\w-]+)/)[1];

    
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

    app.controller('Rules', require("ctr-rules-controller"));

    app.controller('MainCtrl', function($scope,$http){
        var config;
        var hippo_data;
        var iframe_doc;
        var rules = [];

        $("#frm").on("load",function(){
            var win = $(this).get(0).contentWindow;
            var doc = win.document;
            // important! give the doc of iframe to the scope
            rules_scope.doc = iframe_doc = doc;
            parseDocClicks();
            parseConductor();
            paint()
        });

        function yesterDay(){
            var date = new Date();
            date.setDate(date.getDate() - 1);
            return[date.getFullYear(), (date.getMonth() + 1), date.getDate()].join("-");
        }

        function parseDocClicks(){
            var els = $(iframe_doc)
            .find("[onclick]")
            .filter(function(i,el){
                return $(el).attr("onclick").match("document.hippo|_hip");
            });


            els.each(function(i,el){
                var onclick = $(el).attr("onclick");
                var hippo_key = onclick.match(/mv\(\'module\'\,\'([\w\d_]+)\'\)/);
                if(!hippo_key){
                    hippo_key = onclick.match(/module:\s*'([\w\d_]+)'/);
                    hippo_key = hippo_key && hippo_key[1];
                }else{
                    hippo_key = hippo_key[1];
                }

                var hip = hippo_data.filter(function(item){
                    return item.module == hippo_key;
                })[0];
                if(hip){
                    var exist_rule = rules.filter(function(rule){
                        return rule.key == hip.module
                    })[0];
                    if(exist_rule){
                        exist_rule.elem.push(el);
                    }else{
                        rules.push({
                            elem:[el],
                            key:hip.module,
                            ctr:hip.ratio*100
                        });
                    }
                }
            });
        }

        function parseConductor(){
            config && config.rules.forEach(function(rule){
                if(rule.cb !== "hippo"){return;}
                var hip = hippo_data.filter(function(item){
                    return item.module == rule.key;
                })[0];
                if(hip){
                    console.log(hip.ratio,hip);
                    rules.push({
                        elem:$(iframe_doc).find([rule.parent,rule.selector].join(" ")),
                        key:hip.module,
                        ctr:hip.ratio
                    });
                }
            });
        }

        function paint(){
            rules.sort(function(a,b){
                return b.ctr - a.ctr;
            }).forEach(function(item){
                item.label = item.ctr;
                rules_scope.add(item);
            });
        }

        $http.get("/api/page/"+PageKey)
        .success(function(data){
            var url = data.url;
            console.log(url);
            try{
                config = JSON.parse(data.config);
            }catch(e){
                config = null;
            }

            $http.post("/api/ctrproxy", {
                url: url.split("http://")[1],
                database: "dw57",
                date: yesterDay(),
                dateRange: 3
            })
            .success(function(data){
                hippo_data = data.msg;
                $("#frm").attr("src","/proxy?url="+url);
            })
            .error(function(data){
                console.log("fail to get data from ctr server")
            });
        });

    })
    angular.bootstrap(document,['app']);

    var rules_scope = angular.element($("#pane")).scope();

    /**
     * Rules in config
     */
    

    $("#frm").css("width",$(window).width()-244);
});