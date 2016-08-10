function createWorkflowController($state, DataManager) {
  var self = this;
  self.data = {};
  self.creatingWorkflow = false;
  self.create = create;

  self.canBeParsed = true;

  function create(workflowData) {
    self.creatingWorkflow = true;

    var workflowsResource = DataManager.resource('workflows');
    workflowsResource.create(workflowData);
    $state.go('readAllWorkflows');
  }
}

angular
  .module('app')
  .component('createWorkflow', {
    templateUrl: 'app/createWorkflow/createWorkflow.html',
    controller: createWorkflowController
  });

