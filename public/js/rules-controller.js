define(function(require,exports,module){
    var Events = require("event");
    var Rule = require("rule");

    var Rules = function($scope){
        Events.mixin($scope);
        $scope.open = true;
        $scope.rules = [];


        function apply(){
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }

        $scope.dyeall = function(){
            $scope.rules.forEach(function(rule){
                rule.createDyer($scope.doc);
                rule.dyeSelf();
            });
        }

        $scope.add = function(data){
            var rule = new Rule(data);
            rule.createDyer($scope.doc);
            rule.dyeSelf();
            if($scope.rules.indexOf(rule) == -1){
                $scope.rules.push(rule);
                // ref: http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                apply();
            }
        }

        $scope.save = function(){
            var data = $scope.rules.map(function(rule){
                return rule.getData();
            });
            $scope.fire("save",data);
        }

        $scope.edit = function($event){
            $scope.fire("edit",this);
        }

        $scope.updateRule = function(row,rule){
            row.rule.update(rule);
        }

        $scope.remove = function(){
            var rule = $scope.rules[this.$index];
            rule.clear();
            $scope.rules.splice(this.$index,1);
        }

        $scope.toggle = function(){
            this.open = !this.open;
        }
    }


    module.exports = Rules
});