function blueprintsCreateController(Api, Action) {
  var self = this;
  self.action = Action.create('Create', createBlueprint);


  function createBlueprint(sourceCode) {
    var jsonSourceCode = YAML.parse(sourceCode);
    return Api.create('blueprints', jsonSourceCode).then(success);
  }

  function success (data) {
    console.log('Blueeeprint', data);
  }
}

angular
  .module('app')
  .component('blueprintsCreate', {
    templateUrl: 'app/blueprintsCreate/blueprintsCreate.html',
    controller: blueprintsCreateController
  });

