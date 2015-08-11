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
  cleanUpCurrent: function(deployment) {
    var payload = {actionType: DeploymentConstants.CLEANUP_DEPLOYMENT , response: deployment };
    AppDispatcher.dispatch(payload);
  },

  // EVENTS Stream
  openEventsStream: function(){
    SSE.open();
  },
  closeEventsStream: function(){
    SSE.close();
  },


  // METRICS
  getDeploymentMetrics: function(deployment, metricsType, service, cluster) {
    var endpoint = null,
        tags = [],
        req = {};

    // TODO: only 1 endpoint is supported at this moment, make fix for this in the future
    _.each(deployment.endpoints, function(value, key){
      if(service) {
        endpoint = cluster.port
      } else {
        portAndProtocolArray = value.split("/");
        endpoint = portAndProtocolArray[0];
      } 
    }, this);

    if(cluster) { 
      tags.push('routes:' + deployment.name + '_' + cluster.name + '_' + endpoint) 
    } else {
      tags.push('routes:' + deployment.name + '_' + endpoint, 'route');
    }

    metricsType ? tags.push('metrics:' + metricsType) : tags.push('metrics');
    if(service) { tags.push('services:' + service, 'service') }

    req = {
      "tags" : tags,
      "timestamp" : {
        "lte" : "now"
      }
    }

    if( service ){
      //console.log(JSON.stringify(req));
      PulseApi.post('/events/get', req, DeploymentConstants.GET_DEPLOYMENT_METRICS_SERVICE);
      return;
    }
    if( metricsType == 'rtime'){
      PulseApi.post('/events/get', req, DeploymentConstants.GET_DEPLOYMENT_METRICS_RTIME);
      return;
    }
    if( metricsType == 'rate'){
      PulseApi.post('/events/get', req, DeploymentConstants.GET_DEPLOYMENT_METRICS_RATE);
      return;
    }
  },
};

module.exports = DeploymentActions;