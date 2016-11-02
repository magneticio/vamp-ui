angular.module('app')
  .controller('WorkflowsController', WorkflowsController);

/** @ngInject */
function WorkflowsController($scope, $vamp, toastr) {
  var $ctrl = this;
  $ctrl.workflow = $scope.$parent.$parent.artifact;

  var path = '/workflows/' + $ctrl.workflow.name;

  this.peek = function () {
    $vamp.peek(path);
  };

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      $ctrl.peek();
    }
  });

  $scope.$on(path, function (e, response) {
    if (response.status === 'OK') {
      $ctrl.workflow = response.data;
    }
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'workflows:' + $ctrl.workflow.name)) {
      $ctrl.peek();
    }
  });

  this.updating = function () {
    return $ctrl.workflow.status === 'starting' || $ctrl.workflow.status === 'stopping' || $ctrl.workflow.status === 'restarting' || $ctrl.workflow.status === 'suspending';
  };

  this.start = function ($event) {
    $ctrl.update($event, 'starting');
  };

  this.suspend = function ($event) {
    $ctrl.update($event, 'suspending');
  };

  this.restart = function ($event) {
    $ctrl.update($event, 'restarting');
  };

  this.update = function ($event, status) {
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
