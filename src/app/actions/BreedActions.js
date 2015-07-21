var AppDispatcher = require('../dispatcher/AppDispatcher');
var BreedConstants = require('../constants/BreedConstants');
var Api = require('./Api');

var BreedActions = {

  getAllBreeds: function() {
    Api.get('/breeds', null, BreedConstants.GET_ALL_BREEDS);
  },
  getBreed: function(breedName, format) {
    format = typeof format !== 'undefined' ? format : null;
    Api.get('/breeds/' + breedName, null, BreedConstants.GET_BREED, format);
	},
	createBreed: function(body) {
    Api.create('/breeds', body, BreedConstants.CREATE_BREED, 'application/x-yaml');
	},
  deleteBreed: function(breed) {
    Api.del('/breeds/' + breed.name, breed, BreedConstants.DELETE_BREED);
  }  
};

module.exports = BreedActions;