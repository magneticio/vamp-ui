/* global _*/
function editWeightsModal($scope, $uibModalInstance, weightValues) {
  $scope.sliderOptions = {
    floor: 0,
    ceil: 100
  };
  $scope.newWeightValues = angular.copy(weightValues);

  function toArray(weightValues) {
    var theArray = _.map(weightValues, function (value, prop) {
      return {name: prop, value: value};
    });

    return theArray;
  }

  // This function seems to complicated. Might have to refactor in the future.
  if (_.size($scope.newWeightValues) === 2) {
    $scope.$watch('newWeightValues', function (newValue, oldValue) {
      var newValueArray = toArray(newValue);
      var oldValueArray = toArray(oldValue);
      if (newValueArray[0].value !== oldValueArray[0].value) {
        $scope.newWeightValues[newValueArray[1].name] = 100 - newValueArray[0].value;
      }

      if (newValueArray[1].value !== oldValueArray[1].value) {
        $scope.newWeightValues[newValueArray[0].name] = 100 - newValueArray[1].value;
      }
    }, true);
  }

  $scope.ok = function () {
    $uibModalInstance.close($scope.newWeightValues);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.getTotal = function () {
    var totalValue = 0;

    for (var routeName in $scope.newWeightValues) {
      if (routeName) {
        var value = $scope.newWeightValues[routeName];
        totalValue += value;
      }
    }

    return totalValue;
  };
}

angular
  .module('app')
  .controller('editWeightsModal', editWeightsModal);

