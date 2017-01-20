angular.module('app')
  .controller('WorkflowsController', WorkflowsController);

/** @ngInject */
function WorkflowsController($scope, $vamp, toastr, $controller) {
  var $ctrl = this;

  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope});

  $ctrl.onStreamEvent = function (response) {
    if (_.includes(response.data.tags, 'workflows')) {
      $ctrl.peek();
    }
  };
}
