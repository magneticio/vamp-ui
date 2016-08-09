function createBlueprintController($state, DataManager) {
  var self = this;
  self.data = {};
  self.creatingBlueprint = false;
  self.create = create;

  self.canBeParsed = true;

  function create(blueprintData) {
    self.creatingBlueprint = true;

    var blueprintsResource = DataManager.resource('blueprints');
    blueprintsResource.create(blueprintData);
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

