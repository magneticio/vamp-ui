var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlueprintConstants = require('../constants/BlueprintConstants');
var Api = require('./Api');

var BlueprintActions = {

  getAllBlueprints: function() {
    Api.get('/blueprints', null, BlueprintConstants.GET_ALL_BLUEPRINTS)
  },
  getBlueprint: function(blueprint) {
    Api.get('/blueprints/' + blueprints.name, null, BlueprintConstants.GET_BLUEPRINT)
  },  
  deployBlueprint: function(body) {
    console.log('in deploy action')
    Api.create('/deployments',body, BlueprintConstants.DEPLOY_BLUEPRINT)
  },
  createBlueprint: function(body) {
    Api.create('/blueprints',body, BlueprintConstants.CREATE_BLUEPRINT)
  },    
  deleteBlueprint: function(blueprint) {
    Api.del('/blueprints/' + blueprint.name, blueprint, BlueprintConstants.DELETE_BLUEPRINT)
  },  

};

module.exports = BlueprintActions;