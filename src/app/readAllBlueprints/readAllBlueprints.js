function readAllBlueprintsController(Api, NgTableParams, $interval) {
  var self = this;

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
  .component('readAllBlueprints', {
    templateUrl: 'app/readAllBlueprints/readAllBlueprints.html',
    controller: readAllBlueprintsController
  });

