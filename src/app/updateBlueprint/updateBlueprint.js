/* global YAML*/
function updateBlueprintController(Api, $state, DataManager, $stateParams) {
  var self = this;
  self.data = {};
  self.updatingBlueprint = false;
  self.blueprintId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  var blueprintsResource = DataManager.resource('blueprints');

  Api.read('blueprints', self.blueprintId).then(blueprintLoaded);

  function update(blueprintData) {
    self.updatingBlueprint = true;
    blueprintsResource.update(self.blueprintId, blueprintData);
    $state.go('readAllBlueprints');
  }

  function blueprintLoaded(response) {
    var data = response.data;
    self.sourceCode = YAML.stringify(data, 6);
  }
}

angular
  .module('app')
  .component('updateBlueprint', {
    templateUrl: 'app/updateBlueprint/updateBlueprint.html',
    controller: updateBlueprintController
  });

