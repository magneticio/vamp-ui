function gatewaysController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp, namifyFilter, $authorization) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  $ctrl.gateways = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/gateways';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (gateway) {
    $state.go('.one', {
      name: gateway.name
    });
  };

  $ctrl.delete = function (gateway) {
    return $vamp.delete($ctrl.path + '/' + gateway.name, angular.toJson(gateway));
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.gateways);
    angular.forEach($ctrl.gateways, function (a) {
      a.routes = namifyFilter(a.routes);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization') ||
      (_.includes(response.data.tags, 'gateways:') && (_.includes(response.data.tags, 'deployed') || _.includes(response.data.tags, 'undeployed')))) {
      $ctrl.refresh();
    }
  });

  var authorized = $authorization.authorized(artifactsMetadata.kind, $authorization.action.read);
  if (authorized) {
    $ctrl.refresh();
  } else {
    $state.go('artifacts', {
      kind: 'workflows'
    });
  }
}

gatewaysController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', 'namifyFilter', '$authorization'];
angular.module('vamp-ui').controller('gatewaysController', gatewaysController);
