angular.module('vamp-ui')
.controller('DeploymentConfirmationController', DeploymentConfirmationController);

/** @ngInject */
function DeploymentConfirmationController($scope, $uibModal, deployment, editor, $uibModalInstance) {
  $scope.title = "Deploy confirmation";
  $scope.text = "Please confirm deploying of the following:";
  $scope.deployment = deployment;
  $scope.editorTemplate = editor;

  $scope.ok = function () {
    $uibModalInstance.close('save');
  };

  $scope.cancel = function () {
    $uibModalInstance.close('cancel');
  };
  $scope.back = function () {
    $uibModalInstance.dismiss();
  };
}
