var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('underscore');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Api = require('../utils/Api');
var SSE = require('../utils/SSE');
var PulseApi = require('../utils/PulseApi');

var DeploymentActions = {

  // GET
  getAllDeployments: function() {
    Api.get('/deployments', null, DeploymentConstants.GET_ALL_DEPLOYMENTS);
  },
  getDeployment: function(name) {
    Api.get('/deployments/' + name, null, DeploymentConstants.GET_DEPLOYMENT);
  },
  getDeploymentStatus: function(name) {
    Api.get('/deployments/' + name, null, DeploymentConstants.GET_DEPLOYMENT_STATUS);
  },
  getDeploymentAsBlueprint: function(deployment, format) {
    format = typeof format !== 'undefined' ? format : null;
    Api.get('/deployments/' + deployment.name, {as_blueprint: true}, DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT, format);
  },

  // UPDATE
  updateDeployment: function(name, body, format) {
    format = typeof format !== 'undefined' ? format : null;
    Api.update('/deployments/' + name, body, DeploymentConstants.UPDATE_DEPLOYMENT, format);
  },


  // DELETE
  deleteFullDeployment: function(deployment) {
    var req = {};
    req.name = deployment.name;
    req.body = JSON.stringify(_.omit(deployment, "status"));
    
    Api.del('/deployments/' + req.name, req.body, DeploymentConstants.DELETE_FULL_DEPLOYMENT);
  },
  deleteService: function(deploymentName, breedName) {
    req = {
      "name": deploymentName,
      "clusters": { "frontend": { "services": [{ "breed": {"ref": breedName }}]}}
    };
    Api.del('/deployments/' + deploymentName, req, DeploymentConstants.DELETE_SERVICE);
  },
  cleanUpCurrent: function(deployment) {
    var payload = {actionType: DeploymentConstants.CLEANUP_DEPLOYMENT , response: deployment };
    AppDispatcher.dispatch(payload);
  },

  // EVENTS Stream
  openEventsStream: function(deploymentName, metrics){
    SSE.open.apply(this, arguments);
  },
  closeEventsStream: function(){
    SSE.close();
  },


  // METRICS
  getEndpointMetrics: function(deployment, metricTypes) {
    var endpoint = null,
        tags = [],
        req = {};

    // TODO: only 1 endpoint is supported at this moment, make fix for this in the future
    _.each(deployment.endpoints, function(value, key){
        portAndProtocolArray = value.split("/");
        endpoint = portAndProtocolArray[0];
    }, this);
    
    tags.push('gateways', 'gateways:' + (deployment.name + '_' + endpoint + '____').replace(/\W+/g, '_'));
    tags.push('metrics');
    tags.push('metrics:responseTime');

    req = {
      "tags" : tags,
      "timestamp" : {"lte" : "now"}
    }
    PulseApi.post('/events/get', req, DeploymentConstants.GET_DEPLOYMENT_ENDPOINT_RTIME);
    
    req.tags.pop();
    req.tags.push('metrics:rate');
    PulseApi.post('/events/get', req, DeploymentConstants.GET_DEPLOYMENT_ENDPOINT_RATE);
  },
};

module.exports = DeploymentActions;