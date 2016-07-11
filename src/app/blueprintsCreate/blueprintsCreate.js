function blueprintsCreateController(Api, Action, $state) {
  var self = this;
  self.action = Action.createAsync('Create', createBlueprint);

  function createBlueprint(data) {
    console.log('Daaata', data);

    return Api.create('blueprints', data).then(success);
  }

  function success (data) {
    $state.go('readAllBlueprints');
  }
}

angular
  .module('app')
  .component('blueprintsCreate', {
    templateUrl: 'app/blueprintsCreate/blueprintsCreate.html',
    controller: blueprintsCreateController
  });

