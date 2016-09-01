/* global YAML*/
function updateBreedController(Api, $state, toastr, $stateParams, $mixpanel) {
  var self = this;
  self.data = {};
  
  self.breedId = $stateParams.id;
  self.update = update;

  self.canBeParsed = true;

  Api.read('breeds', self.breedId).then(breedLoaded);

  $mixpanel.track('Update Breeds button clicked');
  function update(breedData) {
    Api.update('breeds', self.breedId, breedData).then(breedUpdated, breedNotUpdated);
  }

  function breedLoaded(response) {
    self.data = response.data;
    self.sourceCode = YAML.stringify(self.data, 20);
  }

  function breedUpdated() {
    toastr.success(self.breedId, 'Updated Breed');
    $mixpanel.track('Breed updated');

    $state.go('readAllBreeds');
  }

  function breedNotUpdated(error) {
    toastr.error(error, 'Could not update Breed');
  }
}

angular
  .module('app')
  .component('updateBreed', {
    templateUrl: 'app/updateBreed/updateBreed.html',
    controller: updateBreedController
  });

