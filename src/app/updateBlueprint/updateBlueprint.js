/* global YAML*/
function updateBlueprintController(Api, $state, DataManager, $stateParams, $mixpanel) {
  var self = this;
  self.data = {};
  self.blueprintId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  var blueprintsResource = DataManager.resource('blueprints');

  Api.read('blueprints', self.blueprintId).then(blueprintLoaded);

  $mixpanel.track('Update Blueprint button clicked');

  function update(blueprintData) {
    blueprintsResource.update(self.blueprintId, blueprintData, false, blueprintUpdated);
  }

  function blueprintUpdated() {
    $mixpanel.track('Blueprint updated');
    $state.go('readAllBlueprints');
  }

  function blueprintLoaded(response) {
    self.data = response.data;
    self.sourceCode = YAML.stringify(self.data, 20);
  }
}

angular
  .module('app')
  .component('updateBlueprint', {
    templateUrl: 'app/updateBlueprint/updateBlueprint.html',
    controller: updateBlueprintController
  });

