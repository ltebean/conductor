define(function(require,exports,module){
    var Event = require("event");
    var Identifier = require("identifier");
    var Dyer = require("dyer");

    var EditPanel = function($scope,$element){
        var self = this;

        Event.mixin($scope);

        function apply(){
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }

        var single_selector = null;

        $scope.changemulti = function(){
            var identifier = Identifier.instance;
            var rule;
            if($scope.multi){
                $scope.cases = identifier.identify($scope.selector,{
                    mode:"multi"
                });
                rule = $scope.cases[0];
                single_selector = $scope.selector;
                $scope.pickmulti(0);
                $scope.dye(0);
                apply();
            }else{
                $scope.selector = single_selector;
                $scope.parent = "body";
                $scope.dyeSingle();
                single_selector = null;
            }
        }

        $scope.dyeSingle = function(){
            var dyer = Dyer.activeInstance;
            dyer.clear();
            dyer.dye(single_selector);
        }

        $scope.dye = function(i){
            var rule;
            var index = i==undefined ? this.$index : i;
            var dyer = Dyer.activeInstance;

            rule = this.cases[index];
            if(rule){
                dyer.clear();  
                this.cases[index].elems.each(function(i,elem){
                    dyer.dye(elem);
                });              
            }
        }

        /**
         * pickmulti(1)
         * pickmulti({elems,parent,selected})
         */
        $scope.pickmulti = function(i){
            var index = i==undefined ? this.$index : i;
            $scope.cases.forEach(function(kase,j){
               kase.selected = j == index;
            });


            $scope.selector = $scope.cases[index].selector;
            $scope.parent = $scope.cases[index].parent;
            // $scope.fire("pick");
        }

        $scope.init = function(data){
            data = data || {};
            var rule;
            $scope.type = data.type || "Edit";
            $scope.multi = data.multi || false;
            $scope.display = "none";
            $scope.left = 0;
            $scope.top = 0;
            $scope.action = data.action || "click";
            $scope.key = data.key || "";
            $scope.selector = data.selector || "";
            $scope.parent = data.parent || "body";
            $scope.cases = data.cases || [];
            if($scope.multi){
                rule = $scope.cases.filter(function(kase){return kase.selected})[0] 
            }else{
                rule = $scope;
            }
            $scope.dye(rule);
        };

        $scope.pos = function(pos){
            $scope.left = pos.x;
            $scope.top = pos.y;

            apply();
        }

        $scope.pop = function(){
            $scope.display = "block";
            apply();
            $($element[0]).find("#ga-key").get(0).focus();
            
        }

        $scope.close = function(){
            $scope.display = "none";
            $scope.fire("close");
            apply();
        }


        $scope.ok = function(){
            $scope.display = "none";
            $scope.fire("close");
            $scope.fire("done");
        }
    }


    module.exports = EditPanel;

});