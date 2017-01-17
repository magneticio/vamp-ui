angular.module('app')
  .controller('WorkflowController', WorkflowController);

/** @ngInject */
function WorkflowController($scope, $vamp, toastr) {
  var $ctrl = this;

  var path = '/workflows/' + $scope.artifact.name;

  $ctrl.updating = function () {
    return $scope.artifact.status === 'starting' ||
      $scope.artifact.status === 'stopping' ||
      $scope.artifact.status === 'restarting' ||
      $scope.artifact.status === 'suspending';
  };

  $ctrl.start = function ($event) {
    $ctrl.update($event, 'starting');
  };

  $ctrl.suspend = function ($event) {
    $ctrl.update($event, 'suspending');
  };

  $ctrl.restart = function ($event) {
    $ctrl.update($event, 'restarting');
  };

  $ctrl.update = function ($event, status) {
    $event.stopPropagation();
    var operation = status.charAt(0).toUpperCase() + status.substr(1).toLowerCase();

    $vamp.await(function () {
      var workflow = angular.copy($ctrl.workflow);
      workflow.status = status;
      $vamp.put(path, JSON.stringify(workflow), {}, 'JSON');
    }).then(function () {
      toastr.success(operation + ' initiated.');
    }).catch(function (response) {
      if (response) {
        toastr.error(response.data.message, operation + ' failed.');
      } else {
        toastr.error('Server timeout.', operation + ' failed.');
      }
    });
  };
}
