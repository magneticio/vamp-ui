function schedulerController($scope, $state, $stateParams, artifactsMetadata, $controller, $vamp, toastr) {
  var $ctrl = this;
  $controller('PaginationController', {
    $ctrl: $ctrl,
    $vamp: $vamp,
    $scope: $scope,
    artifactsMetadata: artifactsMetadata,
    $stateParams: $stateParams
  });

  $ctrl.path = '/scheduler/routing';

  $scope.selector = '';
  $ctrl.schedulerRouting = [];
  $ctrl.config = artifactsMetadata;

  $ctrl.onSearch = function (text) {
    $scope.selector = text;
  };

  $ctrl.add = function () {
    if (!$scope.selector) {
      toastr.error('Selector is missing.');
      return;
    }
    $state.go('artifacts.add', {
      kind: 'gateways',
      importData: 'name: ~ # set name\nport: 0 # optionally set port\nselector: ' + $scope.selector + '\n'
    });
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    response.data.forEach(function (item) {
      item.name = item.namespace + '/' + item.name;
    });
    $ctrl.schedulerRouting.length = 0;
    response.data.forEach(function (item) {
      $ctrl.schedulerRouting.push(item);
    });
  });

  $scope.$on('/events/stream', function (e, response) {
    if ((_.includes(response.data.tags, 'deployed') || _.includes(response.data.tags, 'undeployed') ||
      _.includes(response.data.tags, 'synchronization')) || _.includes(response.data.tags, 'deployments')) {
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();

  $scope.$watch('selector', _.debounce(function (selector) {
    selector = selector || 'true';
    $vamp.get($ctrl.path, {selector: selector}).catch(function () {
      toastr.error('Invalid selector: ' + selector);
    });
  }, 1000));
}

schedulerController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$controller', '$vamp', 'toastr'];
angular.module('vamp-ui').controller('schedulerController', schedulerController);
