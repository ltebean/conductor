define(function(require,exports,module){

    var Events = require("event");

    var Rules = function($scope){
        Events.mixin($scope);
        $scope.open = true;
        $scope.rules = [];

        function apply(){
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }

        $scope.add = function(data){
            if($scope.rules.indexOf(data) == -1){
                $scope.rules.push(data);
                // ref: http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                apply();
            }
        }

        $scope.remove = function(){
            $scope.rules.splice(this.$index,1);
        }

        $scope.toggle = function(){
            this.open = !this.open;
        }
    }


    module.exports = Rules
});