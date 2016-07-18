function deleteBlueprint($scope, $uibModalInstance, blueprintId) {

  $scope.blueprintName = blueprintId;
  $scope.ok = function () {
    $uibModalInstance.close(blueprintId);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('deleteBlueprint', deleteBlueprint);

