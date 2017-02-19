/* global Environment */
angular.module('app')
  .controller('WorkflowsController', WorkflowsController);

/** @ngInject */
function WorkflowsController(uiStatesFactory, $scope, $controller) {
  var $ctrl = this;

  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope});

  $ctrl.onStreamEvent = function (response) {
    if (_.includes(response.data.tags, 'workflows')) {
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
      uiStatesFactory.setProxyPanelViewState(path);
      uiStatesFactory.setInfoPanelViewState(false);
      uiStatesFactory.setHelpPanelViewState(false);
    }
    return path;
  };
}
