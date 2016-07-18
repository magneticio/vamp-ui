function updateBlueprintController(Api, $state, $timeout, toastr, $stateParams) {
  var self = this;
  self.data = {};
  self.updatingBlueprint = false;
  self.blueprintId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  Api.read('blueprints', self.blueprintId).then(blueprintLoaded);


  function update(blueprintData) {
    self.updatingBlueprint = true;

    Api.update('blueprints', self.blueprintId, blueprintData).then(blueprintUpdated, blueprintNotUpdated)
  }

  function blueprintLoaded(data) {
    self.sourceCode = YAML.stringify(data, 6);
  }

  function blueprintUpdated(data) {
      self.updatingBlueprint = false;
      toastr.success(self.blueprintId,'Updated Blueprint');
      $state.go('readAllBlueprints');
  }

  function blueprintNotUpdated(error) {
    toastr.error(error,'Could not update Blueprint');
    self.updatingBlueprint = false;
  }
}

angular
  .module('app')
  .component('updateBlueprint', {
    templateUrl: 'app/updateBlueprint/updateBlueprint.html',
    controller: updateBlueprintController
  });

