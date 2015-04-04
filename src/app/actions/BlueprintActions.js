var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlueprintConstants = require('../constants/BlueprintConstants');
var Api = require('./Api');

var BlueprintActions = {

  getAllBlueprints: function() {
    // console.log('query sent to API')
    Api.query('/blueprints', BlueprintConstants.GET_ALL_BLUEPRINTS)
  }
};

module.exports = BlueprintActions;