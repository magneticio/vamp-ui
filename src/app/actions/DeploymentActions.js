  var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('underscore');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Api = require('./Api');

var DeploymentActions = {

  getAllDeployments: function() {
    Api.get('/deployments', null, DeploymentConstants.GET_ALL_DEPLOYMENTS)
  },
  getDeployment: function(name) {
    Api.get('/deployments/' + name, null, DeploymentConstants.GET_DEPLOYMENT)
  },
  getDeploymentAsBlueprint: function(deployment) {
    Api.get('/deployments/' + deployment.name, {as_blueprint: true}, DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT)
  },       
  deleteFullDeployment: function(deployment) {
    var deplAsBlueprint = {}
    var name = deployment.name
    deplAsBlueprint.name = name
    deplAsBlueprint.clusters = _.mapObject(deployment.clusters,function(val,key){ return {services: _.map(val.services,function(service){ return _.omit(service, ['state','servers','scale'])})}});
    Api.del('/deployments/' + name, deplAsBlueprint, DeploymentConstants.DELETE_FULL_DEPLOYMENT);
  },
  cleanUpCurrent: function(deployment) {
    var payload = {actionType: DeploymentConstants.CLEANUP_DEPLOYMENT , response: deployment };
    AppDispatcher.dispatch(payload);
  }
};

module.exports = DeploymentActions;