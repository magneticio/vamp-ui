function gatewaysController($scope, $state, $stateParams, artifactsMetadata, $vamp, namifyFilter) {
  var $ctrl = this;

  $ctrl.gateways = [];
  $ctrl.config = artifactsMetadata;
  var path = '/gateways';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (gateway) {
    $state.go('.one', {
      name: gateway.name
    });
  };

  $ctrl.delete = function (gateway) {
    $vamp.delete(path + '/' + gateway.name, angular.toJson(gateway)).then(get);
  };

  // $scope event listenters

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      get();
    }
  });

  $scope.$on(path, function (e, response) {
    $scope.artifactsLoaded = true;
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.gateways);
    angular.forEach($ctrl.gateways, function (a) {
      a.routes = namifyFilter(a.routes);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'synchronization') ||
      (_.includes(response.data.tags, 'gateways:') && (_.includes(response.data.tags, 'deployed') || _.includes(response.data.tags, 'undeployed')))) {
      get();
    }
  });

  function get() {
    $vamp.get(path);
  }

  get();
}

gatewaysController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp', 'namifyFilter'];
angular.module('vamp-ui').controller('gatewaysController', gatewaysController);
