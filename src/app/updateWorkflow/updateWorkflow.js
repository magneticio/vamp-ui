/* global YAML*/
function updateWorkflowController(Api, $state, toastr, $stateParams) {
  var self = this;
  self.data = {};
  self.updatingWorkflow = false;
  self.workflowId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  Api.read('workflows', self.workflowId).then(workflowLoaded);

  function update(workflowData) {
    self.updatingWorkflow = true;

    Api.update('workflows', self.workflowId, workflowData).then(workflowUpdated, workflowNotUpdated);
  }

  function workflowLoaded(response) {
    var data = response.data;
    self.sourceCode = YAML.stringify(data, 6);
  }

  function workflowUpdated() {
    self.updatingWorkflow = false;
    toastr.success(self.workflowId, 'Updated Workflow');
    $state.go('readAllWorkflows');
  }

  function workflowNotUpdated(error) {
    toastr.error(error, 'Could not update Workflow');
    self.updatingWorkflow = false;
  }
}

angular
  .module('app')
  .component('updateWorkflow', {
    templateUrl: 'app/updateWorkflow/updateWorkflow.html',
    controller: updateWorkflowController
  });

