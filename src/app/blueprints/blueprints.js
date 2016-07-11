function blueprintsController(NgTableParams, Api, Action, $state) {
  var self = this;
  self.actions = [];

  self.actions.push(Action.create('Create', function () {
    $state.go('createBlueprint');
  }));

  function getData(params) {
    console.log(params);
    return Api.readAll('blueprints').then(function (data) {
      return data;
    });
  }

  self.tableParams = new NgTableParams({}, {getData: getData});
}

angular
  .module('app')
  .component('blueprints', {
    templateUrl: 'app/blueprints/blueprints.html',
    controller: blueprintsController
  });

