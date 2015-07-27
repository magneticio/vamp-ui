var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('underscore');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Api = require('./Api');
var PulseApi = require('./PulseApi');

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
  updateDeployment: function(name, body) {
    Api.update('/deployments/' + name, body, DeploymentConstants.UPDATE_DEPLOYMENT, 'application/x-yaml');
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



  // METRICS
  getDeploymentMetrics: function(deployment, metricsType, service, cluster) {
    var endpoint = null,
        tags = [],
        req = {};

    // TODO: only 1 endpoint is supported at this moment, make fix for this in the future
    _.each(deployment.endpoints, function(value, key){
        service ? endpoint = cluster.port : endpoint = value;
    }, this);

    cluster ? tags.push('routes:' + deployment.name + '_' + cluster.name + '_' + endpoint) : tags.push('routes:' + deployment.name + '_' + endpoint)
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
  putRoutingOption: function(deployment, cluster, service, filters, weight) {
    var putRoute = '/deployments/' + deployment.name + '/clusters/' + cluster + '/services/' + service +'/routing';
    var putObject = { "weight": weight, "filters": filters };
    Api.update(putRoute, putObject, DeploymentConstants.UPDATE_DEPLOYMENT_ROUTING);
  }
};

module.exports = DeploymentActions;