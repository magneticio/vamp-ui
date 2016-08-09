function createBreedController($state, DataManager) {
  var self = this;
  self.data = {};
  self.creatingBreed = false;
  self.create = create;

  self.canBeParsed = true;

  function create(breedData) {
    self.creatingBreed = true;

    var breedsResource = DataManager.resource('breeds');
    breedsResource.create(breedData);
    $state.go('readAllBreeds');
  }
}

angular
  .module('app')
  .component('createBreed', {
    templateUrl: 'app/createBreed/createBreed.html',
    controller: createBreedController
  });

