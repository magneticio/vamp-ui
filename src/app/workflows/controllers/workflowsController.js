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
    $vamp.remove(path + '/' + workflow.name, angular.toJson(workflow));
  };

  // $scope event listenters

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      peek();
    }
  });

  $scope.$on(path, function (e, response) {
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.workflows);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'workflows') || _.includes(response.data.tags, 'workflow-statuses')) {
      peek();
    }
  });

  function peek() {
    $vamp.peek(path);
  }

  peek();
}

workflowsController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('workflowsController', workflowsController);
