function createBreedController($state, DataManager, $mixpanel) {
  var self = this;
  self.canBeParsed = true;
  self.data = {};
  self.create = create;

  $mixpanel.track('Create breed button clicked');

  function create(breedData) {
    var breedsResource = DataManager.resource('breeds');
    breedsResource.create(breedData, breedCreated);
  }

  function breedCreated() {
    $mixpanel.track('Breed created');
    $state.go('readAllBreeds');
  }
}

angular
  .module('app')
  .component('createBreed', {
    templateUrl: 'app/createBreed/createBreed.html',
    controller: createBreedController
  });

