function updateBlueprintController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('updateBlueprint', {
    templateUrl: 'app/updateBlueprint/updateBlueprint.html',
    controller: updateBlueprintController
  });

