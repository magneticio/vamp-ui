function createBlueprintController($state, DataManager, $mixpanel) {
  var self = this;
  self.data = {};
  self.creatingBlueprint = false;
  self.create = create;

  self.canBeParsed = true;

  $mixpanel.track('Create blueprint button clicked');

  function create(blueprintData) {
    self.creatingBlueprint = true;

    var blueprintsResource = DataManager.resource('blueprints');
    blueprintsResource.create(blueprintData);
    $mixpanel.track('New blueprint added');
    $state.go('readAllBlueprints');

    // Api.create('blueprints', blueprintData).then(blueprintCreated, blueprintNotCreated);
  }
}

angular
  .module('app')
  .component('createBlueprint', {
    templateUrl: 'app/createBlueprint/createBlueprint.html',
    controller: createBlueprintController
  });

