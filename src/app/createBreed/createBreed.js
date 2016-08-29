function createBreedController($state, DataManager, $mixpanel) {
  var self = this;
  self.data = {};
  self.creatingBreed = false;
  self.create = create;

  self.canBeParsed = true;

  $mixpanel.track('Create breed button clicked');

  function create(breedData) {
    self.creatingBreed = true;

    var breedsResource = DataManager.resource('breeds');
    breedsResource.create(breedData);
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

