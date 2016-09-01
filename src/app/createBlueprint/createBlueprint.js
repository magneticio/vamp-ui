function createBlueprintController($state, DataManager, $mixpanel) {
  var self = this;
  self.data = {};
  self.canBeParsed = true;

  self.create = create;

  $mixpanel.track('Create blueprint button clicked');

  function create(blueprintData) {
    var blueprintsResource = DataManager.resource('blueprints');
    blueprintsResource.create(blueprintData, blueprintCreated);
  }

  function blueprintCreated() {
    $mixpanel.track('New blueprint added');
    $state.go('readAllBlueprints');
  }
}

angular
  .module('app')
  .component('createBlueprint', {
    templateUrl: 'app/createBlueprint/createBlueprint.html',
    controller: createBlueprintController
  });

