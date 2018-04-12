angular.module('vamp-ui')
  .controller('WorkflowController', WorkflowController);

/** @ngInject */
function WorkflowController($scope, $vamp, toastr, workflowWebPortService, uiStatesFactory, $authorization) {
  var $ctrl = this;

  var path = '/workflows/' + $scope.item.name;
  $ctrl.workflow = $scope.item;

  $ctrl.readOnly = function () {
    return $authorization.readOnly('workflows');
  };

  $scope.updating = function () {
    return $scope.item.status === 'starting' ||
      $scope.item.status === 'stopping' ||
      $scope.item.status === 'restarting' ||
      $scope.item.status === 'suspending';
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
    $vamp.httpPut(path + '/status', status, {}, 'JSON')
      .then(function () {
        toastr.success(operation + ' initiated.');
      })
      .catch(function (response) {
        if (response) {
          toastr.error(response.data.message, operation + ' failed.');
        } else {
          toastr.error('Server timeout.', operation + ' failed.');
        }
      });
  };

  $ctrl.proxy = function (instance, port, $event) {
    var path = 'proxy/workflows/' + $ctrl.workflow.name + '/instances/' + instance.name + '/ports/' + port + '/';
    path = $vamp.getNamespace() + '/' + path;
    if ($vamp.baseUrl) {
      path = window.location.protocol + '//' + $vamp.baseUrl + path;
    }
    if ($event) {
      $event.stopPropagation();
      workflowWebPortService.selectPort(path);
      uiStatesFactory.setRightPanelViewState(uiStatesFactory.STATE_ENUM.EXPANDED);
    }
    return path;
  };
}
