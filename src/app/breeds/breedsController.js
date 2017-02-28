BreedsController.$inject = ['$scope', 'artifactsMetadata', 'namifyFilter', '$controller'];
function BreedsController(
  $scope, artifactsMetadata, namifyFilter, $controller) {
  var $ctrl = this;
  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope, artifactsMetadata: artifactsMetadata});

  $ctrl.onDataResponse = function () {
    angular.forEach($ctrl.artifacts, function (ar) {
      ar.ports = namifyFilter(ar.ports);
    });
  };
}

angular.module('app').controller('BreedsController', BreedsController);
