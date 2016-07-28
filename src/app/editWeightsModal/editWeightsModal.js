function editWeightsModal($scope, $uibModalInstance, weightValues) {

  $scope.sliderOptions = {
    floor: 0,
    ceil: 100
  }

  $scope.newWeightValues = angular.copy(weightValues);

  $scope.ok = function () {
    $uibModalInstance.close($scope.newWeightValues);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.getTotal = function() {
    var totalValue = 0;

    for(var routeName in $scope.newWeightValues) {
      var value = $scope.newWeightValues[routeName];
      totalValue += value;
    }

    return totalValue;
  }
}

angular
  .module('app')
  .controller('editWeightsModal', editWeightsModal);

