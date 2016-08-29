function createWorkflowController($state, DataManager, $mixpanel) {
  var self = this;
  self.data = {};
  self.creatingWorkflow = false;
  self.create = create;

  self.canBeParsed = true;

  $mixpanel.track('Create workflow button clicked');

  function create(workflowData) {
    self.creatingWorkflow = true;

    var workflowsResource = DataManager.resource('workflows');
    workflowsResource.create(workflowData);
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

