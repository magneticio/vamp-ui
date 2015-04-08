var AppDispatcher = require('../dispatcher/AppDispatcher');
var BreedConstants = require('../constants/BreedConstants');
var Api = require('./Api');

var BreedActions = {

  getAllBreeds: function() {
    Api.get('/breeds', null, BreedConstants.GET_ALL_BREEDS)
  },
    deleteBreed: function(breed) {
    Api.del('/breeds/' + breed.name, breed, BreedConstants.DELETE_BREED)
  }  
};

module.exports = BreedActions;