function createWorkflowController($state, DataManager, $mixpanel) {
  var self = this;
  self.data = {};
  self.create = create;

  self.canBeParsed = true;

  $mixpanel.track('Create workflow button clicked');

  function create(workflowData) {
    var workflowsResource = DataManager.resource('workflows');
    workflowsResource.create(workflowData, workflowCreated);
  }

  function workflowCreated() {
    $mixpanel.track('Workflow created');
    $state.go('readAllWorkflows');
  }
}

angular
  .module('app')
  .component('createWorkflow', {
    templateUrl: 'app/createWorkflow/createWorkflow.html',
    controller: createWorkflowController
  });

