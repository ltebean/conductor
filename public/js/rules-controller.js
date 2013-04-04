define(function(require,exports,module){

    var Rules = function($scope){
        this.scope = $scope;
        var rules = $scope.rules = window.rules;
        $scope.on = true;
        
        $scope.add = function(data){
            rules.push(data);
            $scope.$apply();
        }

        $scope.remove = function(){
            rules.splice(this.$index,1);
        }

        $scope.toggle = function(){
            this.on = !this.on;
        }
    }


    module.exports = Rules
});