define(function(require,exports,module){
    var Rule = require("ctr-rule");

    var Rules = function($scope,$element,$filter){
        $scope.doc = null;
        $scope.rules = [];


        function apply(){
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }


        $scope.dyeall = function(filter){
            filter = filter || function(){return true;}
            $scope.rules.filter(filter).forEach(function(rule,index){
                rule.createDyer($scope.doc);
                rule.dyeSelf();
            });
        }

        $scope.add = function(data){
            var rule = new Rule(data);
            rule.list = $scope.rules;
            rule.createDyer($scope.doc);
            if($scope.rules.indexOf(rule) == -1){
                $scope.rules.push(rule);
                apply();
            }
            rule.dyeSelf();
        }
    }


    module.exports = Rules;
});