var AppDispatcher = require('../dispatcher/AppDispatcher');
var BreedConstants = require('../constants/BreedConstants');

var BreedActions = {

  loadBreeds: function(data) {
    AppDispatcher.handleAction({
      actionType: BreedConstants.LOAD_BREEDS,
      data: data
    })
  }

};

module.exports = BreedActions;