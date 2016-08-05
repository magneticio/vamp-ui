function deployBlueprintModal($scope, toastr, $uibModalInstance, blueprint, Api, $state) {
  $scope.blueprint = blueprint;
  $scope.deploymentName = angular.copy(blueprint.name);
  $scope.deployingBlueprint = false;

  $scope.ok = function () {
    $scope.deployingBlueprint = true;
    Api.update('deployments', $scope.deploymentName, blueprint).then(blueprintDeployed, blueprintNotDeployed);

    function blueprintDeployed() {
      toastr.success('New deployment create with name ' + $scope.deploymentName, 'Blueprint deployed');
      $scope.deployingBlueprint = false;
      $state.go('readAllDeployments');
      $uibModalInstance.close();
    }

    function blueprintNotDeployed(error) {
      toastr.error(error, 'Blueprint could not be deployed');
      $scope.deployingBlueprint = false;
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('deployBlueprintModal', deployBlueprintModal);

