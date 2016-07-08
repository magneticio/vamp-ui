function blueprintsController(NgTableParams, Api) {
  var self = this;
  self.actions = [];

  // var dataset = [{ name: 'christian', age: 21 }, { name: 'anthony', age: 88 }];

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

  console.log('Dataaa', getData());

  self.tableParams = new NgTableParams({}, {getData: getData});
}

angular
  .module('app')
  .component('blueprints', {
    templateUrl: 'app/blueprints/blueprints.html',
    controller: blueprintsController
  });

