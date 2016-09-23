function deleteResourceModal($scope, $uibModalInstance, id, title, text, buttonText) {
  $scope.blueprintName = id;
  $scope.title = title;
  $scope.text = text;
  $scope.buttonText = buttonText ? buttonText : 'DELETE';

  $scope.ok = function () {
    $uibModalInstance.close(id);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('deleteResourceModal', deleteResourceModal);
