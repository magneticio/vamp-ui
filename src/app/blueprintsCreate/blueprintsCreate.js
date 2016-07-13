function blueprintsCreateController(Api, Action, $state) {
  var self = this;
  self.create = create;

  function create() {
    return Api.create('blueprints', self.data).then(success);
  }

  function success () {
    $state.go('readAllBlueprints');
  }
}

angular
  .module('app')
  .component('blueprintsCreate', {
    templateUrl: 'app/blueprintsCreate/blueprintsCreate.html',
    controller: blueprintsCreateController
  });

