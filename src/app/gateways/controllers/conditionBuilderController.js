function conditionBuilderController($scope, $uibModalInstance, $sce, url) {
  $scope.url = $sce.trustAsResourceUrl(url);

  $scope.ok = function () {
    $uibModalInstance.close({});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

conditionBuilderController.$inject = ['$scope', '$uibModalInstance', '$sce', 'url'];
angular.module('vamp-ui').controller('conditionBuilderController', conditionBuilderController);
