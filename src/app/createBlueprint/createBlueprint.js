function createBlueprintController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('createBlueprint', {
    templateUrl: 'app/createBlueprint/createBlueprint.html',
    controller: createBlueprintController
  });

