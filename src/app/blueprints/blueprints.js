function blueprintsController(NgTableParams, Api, Action, Popup,  $state) {
  var self = this;

  self.create = create;
  self.edit = edit;
  self.deleteIt = deleteIt;
  self.deploy = deploy;
  self.deleteNot = deleteNot;

  function deleteNot(data) {
    console.log('TESTDELETE', data)
  }

  function create() {
    $state.go('createBlueprint');
  }

  function edit() {
    console.log('Editing Blueprint pressed');
  }

  function deleteIt(data) {
    console.log('Deleting Blueprint pressed', data);
  }

  function edit() {
    console.log('Edit Bluprint pressed');
  }


  function deploy(blueprint) {
    Popup.openConfirmation('test', 'test', function() {console.log('test')});
  }



  // self.actions.push(Action.create('Create', function () {
  //   $state.go('createBlueprint');
  // }));

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

