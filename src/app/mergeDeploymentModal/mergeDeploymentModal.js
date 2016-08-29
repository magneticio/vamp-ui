function mergeDeploymentModal($scope, $uibModalInstance, blueprint, deployments, title, text, buttonText) {
  $scope.blueprint = blueprint;
  $scope.title = title;
  $scope.text = text;
  $scope.buttonText = buttonText;
  $scope.deployments = deployments;
  $scope.chosenDeployment = undefined;

  $scope.deploymentChosen = function (deployment) {
    $scope.chosenDeployment = deployment;
  };

  $scope.ok = function () {
    $uibModalInstance.close({deployment: $scope.chosenDeployment, blueprint: $scope.blueprint});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('mergeDeploymentModal', mergeDeploymentModal);

