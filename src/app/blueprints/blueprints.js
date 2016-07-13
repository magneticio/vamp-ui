function blueprintsController(NgTableParams, Api,  $state, $interval) {
  var self = this;

  self.create = create;
  self.edit = edit;
  self.deleteIt = deleteIt;
  self.deploy = deploy;

  function create() {
    $state.go('createBlueprint');
  }

  function deleteIt(data) {
    console.log(data);
    return Api.delete('blueprints', data.name).then(refresh);
  }

  function edit() {
    console.log('Edit Bluprint pressed');
  }


  function deploy(blueprint) {
    console.log('Deploying blueprint', blueprint);
  }

  function getData(params) {
    return Api.readAll('blueprints').then(function (data) {
      return data;
    });
  }

  self.tableParams = new NgTableParams({}, {getData: getData});

  function refresh() {
    self.tableParams.reload()
  }


  $interval(refresh, 5000);
}

angular
  .module('app')
  .component('blueprints', {
    templateUrl: 'app/blueprints/blueprints.html',
    controller: blueprintsController
  });

