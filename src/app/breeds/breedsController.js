function breedsController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp, namifyFilter) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  $ctrl.breeds = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/breeds';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (breed) {
    $state.go('.one', {
      name: breed.name
    });
  };

  $ctrl.delete = function (breed) {
    return $vamp.delete($ctrl.path + '/' + breed.name, angular.toJson(breed));
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.breeds);
    angular.forEach($ctrl.breeds, function (ar) {
      ar.ports = namifyFilter(ar.ports);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'breeds')) {
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();
}

breedsController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', 'namifyFilter'];
angular.module('vamp-ui').controller('breedsController', breedsController);
