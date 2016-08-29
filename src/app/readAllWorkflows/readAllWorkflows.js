function readAllWorkflowsController($state, $uibModal, DataManager, Modal, $mixpanel) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  var self = this;
  self.openDeleteModal = openDeleteModal;
  self.openDeployModal = openDeployModal;

  self.workflows = [];

  var workflowsResource = DataManager.resource('workflows');
  var deploymentsResource = DataManager.resource('deployments');

  workflowsResource.subscribe(workflowReloaded).readAll().startPolling();

  function workflowReloaded(data) {
    self.workflows = data;
  }

  function openDeployModal(workflow) {
    var resolves = {
      workflow: workflow
    };

    var modalInstance = $uibModal.open(Modal.create('deployWorkflowModal', resolves));

    modalInstance.result.then(function (data) {
      deploymentsResource.update(data.deploymentName, data.workflow);
      $state.go('readAllDeployments');
    });
  }

  function openDeleteModal(workflowId) {
    var resolves = {
      id: workflowId,
      title: 'Are you sure?',
      text: 'You are about to delete [' + workflowId + ']. Confirm the deletion.',
      buttonText: 'DELETE'
    };

    var modalInstance = $uibModal.open(Modal.create('deleteResourceModal', resolves));
    $mixpanel.track('Delete Workflow button clicked');

    modalInstance.result.then(function (id) {
      workflowsResource.remove(id);
      $mixpanel.track('Workflow removed');
    });
  }
}

angular
  .module('app')
  .component('readAllWorkflows', {
    templateUrl: 'app/readAllWorkflows/readAllWorkflows.html',
    controller: readAllWorkflowsController
  });

