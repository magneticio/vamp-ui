function blueprintNameExistsModal($scope, $uibModalInstance, name) {
  $scope.name = name;

  $scope.ok = function () {
    $uibModalInstance.close($scope.name);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('blueprintNameExistsModal', blueprintNameExistsModal);

