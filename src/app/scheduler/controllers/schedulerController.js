function schedulerController($scope, $state, $stateParams, artifactsMetadata, $controller, $vamp, toastr) {
  var $ctrl = this;
  var path = '/scheduler/routing';

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
    $state.go('artifacts.add', {kind: 'gateways', importData: 'name: ~ # set name\nport: 0 # optionally set port\nselector: ' + $scope.selector + '\n'});
  };

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      $vamp.get(path);
    }
  });

  $scope.$on(path, function (e, response) {
    $scope.artifactsLoaded = true;
    response.data.forEach(function (item) {
      item.name = item.namespace + '/' + item.name;
    });
    $ctrl.schedulerRouting.length = 0;
    response.data.forEach(function (item) {
      $ctrl.schedulerRouting.push(item);
    });
  });

  $vamp.get(path);

  $scope.$watch('selector', _.debounce(function (selector) {
    selector = selector || 'true';
    $vamp.get(path, {selector: selector}).catch(function () {
      toastr.error('Invalid selector: ' + selector);
    });
  }, 1000));
}

schedulerController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$controller', '$vamp', 'toastr'];
angular.module('vamp-ui').controller('schedulerController', schedulerController);
