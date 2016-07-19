function createBlueprintController(Api, $state, toastr) {
  var self = this;
  self.data = {};
  self.creatingBlueprint = false;
  self.create = create;

  self.canBeParsed = true;

  function create(blueprintData) {
    self.creatingBlueprint = true;

    Api.create('blueprints', blueprintData).then(blueprintCreated, blueprintNotCreated)
  }

  function blueprintCreated(data) {
      self.creatingBlueprint = false;
      toastr.success(data[1].name,'Created Blueprint');
      $state.go('readAllBlueprints');
  }

  function blueprintNotCreated(error) {
    toastr.error(error, 'Could not create Blueprint');
    self.creatingBlueprint = false;
  }
  
}

angular
  .module('app')
  .component('createBlueprint', {
    templateUrl: 'app/createBlueprint/createBlueprint.html',
    controller: createBlueprintController
  });

