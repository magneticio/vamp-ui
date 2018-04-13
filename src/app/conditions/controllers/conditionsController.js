function conditionsController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  $ctrl.conditions = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/conditions';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (condition) {
    $state.go('.one', {
      name: condition.name
    });
  };

  $ctrl.delete = function (condition) {
    return $vamp.delete($ctrl.path + '/' + condition.name, angular.toJson(condition));
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.conditions);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'conditions')) {
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();
}

conditionsController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('conditionsController', conditionsController);
