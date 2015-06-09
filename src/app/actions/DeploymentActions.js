var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('underscore');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Api = require('./Api');
var PulseApi = require('./PulseApi');

var DeploymentActions = {

  getAllDeployments: function() {
    Api.get('/deployments', null, DeploymentConstants.GET_ALL_DEPLOYMENTS);
  },
  getDeployment: function(name) {
    Api.get('/deployments/' + name, null, DeploymentConstants.GET_DEPLOYMENT);
  },
  getDeploymentAsBlueprint: function(deployment, format) {
    format = typeof format !== 'undefined' ? format : null;
    Api.get('/deployments/' + deployment.name, {as_blueprint: true}, DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT, format);
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
  },
  getDeploymentMetrics: function(deployment, metricsType) {
    //console.log('%c Actions > Get Deployment Metrics: ' + metricsType.toUpperCase() + ' ', 'background: #23AE8F; color: #fff');
    var endpoint = '';
    _.each(deployment.endpoints, function(value, key){
      endpoint = value;
    }, this);
    tags = [];
    tags.push('metrics:' + metricsType);
    tags.push('routes:' + deployment.name + '_' + endpoint);
    postObject = {
      "tags" : tags,
      "timestamp" : {
        "lte" : "now"
      }
    }

    if( metricsType == 'scur'){
      PulseApi.post('/events/get', postObject, DeploymentConstants.GET_DEPLOYMENT_METRICS_SCUR);
    }
    if( metricsType == 'rate'){
      PulseApi.post('/events/get', postObject, DeploymentConstants.GET_DEPLOYMENT_METRICS_RATE);
    }
  },
  putRoutingOption: function(deployment, cluster, service, filters, weight) {
    var putRoute = '/deployments/' + deployment.name + '/clusters/' + cluster + '/services/' + service +'/routing';
    var putObject = { "weight": weight, "filters": filters };
    Api.update(putRoute, putObject, DeploymentConstants.UPDATE_DEPLOYMENT_ROUTING);
  }
};

module.exports = DeploymentActions;