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

  

  // var dataset = [{ name: 'christian', age: 21 }, { name: 'anthony', age: 88 }];
  // var selfTableParams = new NgTableParams({}, { onLoad: dataset });
}

angular
  .module('app')
  .component('blueprints', {
    templateUrl: 'app/blueprints/blueprints.html',
    controller: blueprintsController
  });

