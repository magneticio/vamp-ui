function workflowsController($controller, $scope, $state, $stateParams, artifactsMetadata, $vamp) {
  var $ctrl = this;
  $controller('PaginationController', {$ctrl: $ctrl, $vamp: $vamp, $scope: $scope, artifactsMetadata: artifactsMetadata, $stateParams: $stateParams});

  $ctrl.workflows = [];
  $ctrl.config = artifactsMetadata;
  $ctrl.path = '/workflows';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (workflow) {
    $state.go('.one', {
      name: workflow.name
    });
  };

  $ctrl.delete = function (workflow) {
    return $vamp.delete($ctrl.path + '/' + workflow.name, angular.toJson(workflow));
  };

  $scope.$on($ctrl.path, function (e, response) {
    $scope.artifactsLoaded = true;
    $ctrl.parseHeaders(response);
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.workflows);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'workflows') || _.includes(response.data.tags, 'workflow-statuses')) {
      $ctrl.refresh();
    }
  });

  $ctrl.refresh();
}

workflowsController.$inject = ['$controller', '$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('workflowsController', workflowsController);
