function deployBlueprintModal($scope, $uibModalInstance, blueprint) {
  $scope.blueprint = blueprint;
  $scope.deploymentName = angular.copy(blueprint.name);

  $scope.ok = function () {
    $uibModalInstance.close({deploymentName: $scope.deploymentName, blueprint: blueprint});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('deployBlueprintModal', deployBlueprintModal);

