BreedsController.$inject = ['$scope', 'namifyFilter', '$controller'];
function BreedsController(
  $scope, namifyFilter, $controller) {
  var $ctrl = this;
  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope});

  $ctrl.onDataResponse = function () {
    angular.forEach($ctrl.artifacts, function (ar) {
      ar.ports = namifyFilter(ar.ports);
    });
  };
}

angular.module('app').controller('BreedsController', BreedsController);
