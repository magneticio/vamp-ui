function scalesController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  $ctrl.scales = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/scales';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (scale) {
    $state.go('.one', {
      name: scale.name
    });
  };

  $ctrl.delete = function (scale) {
    return $vamp.delete($ctrl.path + '/' + scale.name, angular.toJson(scale));
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.scales);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'scales')) {
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();
}

scalesController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('scalesController', scalesController);
