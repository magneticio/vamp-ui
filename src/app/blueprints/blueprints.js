function blueprintsController(NgTableParams, Api, Action) {
  var self = this;
  self.actions = [];

  self.actions.push(Action.create('Create', function () {
    alert('test')
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

