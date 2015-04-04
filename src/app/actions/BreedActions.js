var AppDispatcher = require('../dispatcher/AppDispatcher');
var BreedConstants = require('../constants/BreedConstants');
var Api = require('./Api');

var BreedActions = {

  getAllBreeds: function() {
    // console.log('query sent to API')
    Api.query('/breeds', BreedConstants.GET_ALL_BREEDS)
  }
};

module.exports = BreedActions;