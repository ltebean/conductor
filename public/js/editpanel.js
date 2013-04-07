define(function(require,exports,module){
    var Event = require("event");
    var Identifier = require("identifier");
    var Dyer = require("dyer");

    var EditPanel = function($scope){
        var self = this;

        Event.mixin($scope);

        function apply(){
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }

        var single_selector = null;

        $scope.changemulti = function(){
            var identifier = Identifier.instance
            if($scope.multi){
                $scope.cases = identifier.identify($scope.selector,{
                    mode:"multi"
                });
                single_selector = $scope.selector;
                $scope.pickmulti(0);
                $scope.dye(0);
                apply();
            }else{
                $scope.selector = single_selector;
                $scope.parent = "body";
                $scope.dyneSingle();
                single_selector = null;
            }
        }

        $scope.dyneSingle = function(){
            var dyer = Dyer.activeInstance;
            dyer.clear();
            dyer.dye(single_selector);
        }

        $scope.dye = function(i){
            var index = i==undefined ? this.$index : i;
            var dyer = Dyer.activeInstance;
            dyer.clear();
            this.cases[index].elems.each(function(i,elem){
                dyer.dye(elem);  
            });
            console.log(this.cases[index]);
        }

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
            $scope.type = "Edit";
            $scope.multi = false;
            $scope.display = "none";
            $scope.left = 0;
            $scope.top = 0;
            $scope.action = data.action || "click";
            $scope.key = data.key || "";
            $scope.selector = data.selector || "";
            $scope.parent = data.parent || "body";
            $scope.cases = data.cases || [];
        };

        $scope.pos = function(e){
            $scope.left = e.clientX + 50;
            $scope.top = e.clientY - 25;

            apply();
        }

        $scope.pop = function(){
            $scope.display = "block";
            apply();
        }

        $scope.close = function(){
            $scope.display = "none";
            apply();
        }


        $scope.ok = function(){
            $scope.display = "none";
            $scope.fire("done");
        }
    }


    module.exports = EditPanel;

});