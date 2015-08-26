var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlueprintConstants = require('../constants/BlueprintConstants');
var Api = require('../utils/Api');

var BlueprintActions = {

  getAllBlueprints: function() {
    Api.get('/blueprints', null, BlueprintConstants.GET_ALL_BLUEPRINTS);
  },
  getBlueprint: function(blueprintName, format) {
    format = typeof format !== 'undefined' ? format : null;
    Api.get('/blueprints/' + blueprintName, null, BlueprintConstants.GET_BLUEPRINT, format);
  },  
  deployBlueprint: function(body) {
    Api.create('/deployments',body, BlueprintConstants.DEPLOY_BLUEPRINT);
  },
  createBlueprint: function(body) {
    Api.create('/blueprints',body, BlueprintConstants.CREATE_BLUEPRINT);
  },    
  updateBlueprint: function(body, blueprintName, format) {
    format = typeof format !== 'undefined' ? format : null;
    Api.update('/blueprints/' + blueprintName, body, BlueprintConstants.UPDATE_BLUEPRINT, format);
  },    
  deleteBlueprint: function(blueprint) {
    if("status" in blueprint)
      delete blueprint.status;
    Api.del('/blueprints/' + blueprint.name, blueprint, BlueprintConstants.DELETE_BLUEPRINT);
  },  

};

module.exports = BlueprintActions;