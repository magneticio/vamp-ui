function conditionBuilderController($scope, $uibModalInstance, $sce, url) {
  $scope.url = $sce.trustAsResourceUrl(url);

  $scope.ok = function () {
    var bs = window.document.getElementById('builder').contentWindow.builderSource;
    $uibModalInstance.close(bs);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

conditionBuilderController.$inject = ['$scope', '$uibModalInstance', '$sce', 'url'];
angular.module('vamp-ui').controller('conditionBuilderController', conditionBuilderController);
