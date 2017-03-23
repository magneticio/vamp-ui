/* global Environment */
angular.module('vamp-ui')
  .controller('WorkflowsController', WorkflowsController);

/** @ngInject */
function WorkflowsController($scope, artifactsMetadata, $controller, uiStatesFactory, workflowWebPortService) {
  var $ctrl = this;

  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope, artifactsMetadata: artifactsMetadata});

  $ctrl.onStreamEvent = function (response) {
    if (_.includes(response.data.tags, 'workflows') || _.includes(response.data.tags, 'workflow-statuses')) {
      $ctrl.peek();
    }
  };

  $scope.proxy = function (workflow, instance, port, $event) {
    var path = '/proxy/workflows/' + workflow.name + '/instances/' + instance.name + '/ports/' + port + '/';
    if (Environment.prototype.origin()) {
      path = 'http://' + Environment.prototype.origin() + path;
    }
    if ($event) {
      $event.stopPropagation();
      workflowWebPortService.selectPort(path);
      uiStatesFactory.setRightPanelViewState(true);
    }
    return path;
  };
}
