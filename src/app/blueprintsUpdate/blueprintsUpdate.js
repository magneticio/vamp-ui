function blueprintsUpdateController(Api, $stateParams, $state) {
  var self = this;
  self.save = save;

  Api.read('blueprints', $stateParams.id).then(success);

  function success(data) {
    self.data = data;
    self.sourceCode = YAML.stringify(data, 8);
  }

  function save(blueprint) {
    return Api.update('blueprints', blueprint.name, blueprint).then(blueprintUpdated);
  }

  function blueprintUpdated() {
    $state.go('readAllBlueprints');
  }

}

angular
  .module('app')
  .component('blueprintsUpdate', {
    templateUrl: 'app/blueprintsUpdate/blueprintsUpdate.html',
    controller: blueprintsUpdateController
  });

