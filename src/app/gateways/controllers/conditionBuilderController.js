function conditionBuilderController($scope, $uibModalInstance, $sce, url, conditionBuilderObject, condition) {
  $scope.url = $sce.trustAsResourceUrl(url);

  $uibModalInstance.opened.then(function () {
    if (condition) {
      window.localStorage.setItem('builder-data', JSON.stringify({
        builder: conditionBuilderObject,
        conditionSource: condition
      }));
    } else {
      window.localStorage.setItem('builder-data', null);
    }
  });

  $scope.ok = function () {
    var builderData = window.document.getElementById('builder').contentWindow.localStorage.getItem('builder-data');
    try {
      $uibModalInstance.close(JSON.parse(builderData));
    } catch (e) {
      $uibModalInstance.close({error: e});
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

conditionBuilderController.$inject = ['$scope', '$uibModalInstance', '$sce', 'url', 'conditionBuilderObject', 'condition'];
angular.module('vamp-ui').controller('conditionBuilderController', conditionBuilderController);
