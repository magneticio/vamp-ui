/* global YAML*/
function updateWorkflowController(Api, $state, toastr, $stateParams, $mixpanel) {
  var self = this;
  self.data = {};

  self.workflowId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  Api.read('workflows', self.workflowId).then(workflowLoaded);
  $mixpanel.track('Update Workflow button clicked');
  function update(workflowData) {
    Api.update('workflows', self.workflowId, workflowData).then(workflowUpdated, workflowNotUpdated);
  }

  function workflowLoaded(response) {
    self.data = response.data;
    self.sourceCode = YAML.stringify(self.data, 20);
  }

  function workflowUpdated() {
    toastr.success(self.workflowId, 'Updated Workflow');
    $mixpanel.track('Workflow updated');
    $state.go('readAllWorkflows');
  }

  function workflowNotUpdated(error) {
    toastr.error(error, 'Could not update Workflow');
  }
}

angular
  .module('app')
  .component('updateWorkflow', {
    templateUrl: 'app/updateWorkflow/updateWorkflow.html',
    controller: updateWorkflowController
  });

