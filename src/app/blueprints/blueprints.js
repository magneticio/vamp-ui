function blueprintsController(NgTableParams, Api) {
  var self = this;
  self.actions = [];

  self.actions.push(createAction('Create', function () {
    alert('test')
  }));

  function createAction(text, onClick, icon) {
    return {
      text: text,
      onClick: onClick,
      icon: icon || undefined
    }
  }

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

