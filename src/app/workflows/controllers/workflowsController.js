function workflowsController($scope, $state, $stateParams, artifactsMetadata, $vamp) {
  var $ctrl = this;

  $ctrl.workflows = [];
  $ctrl.config = artifactsMetadata;
  var path = '/workflows';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (workflow) {
    $state.go('.one', {
      name: workflow.name
    });
  };

  $ctrl.delete = function (workflow) {
    $vamp.delete(path + '/' + workflow.name, angular.toJson(workflow)).then(function () {
      $vamp.emit(path);
    });
  };

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      $vamp.emit(path);
    }
  });

  $scope.$on(path, function (e, response) {
    $scope.artifactsLoaded = true;
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.workflows);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'workflows') || _.includes(response.data.tags, 'workflow-statuses')) {
      $vamp.emit(path);
    }
  });

  $vamp.emit(path);
}

workflowsController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('workflowsController', workflowsController);
