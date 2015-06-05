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
  getDeploymentAsBlueprint: function(deployment) {
    Api.get('/deployments/' + deployment.name, {as_blueprint: true}, DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT);
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
  getDeploymentMetrics: function(deployment, offsetInMinutes) {
    console.log('%c Actions > Get Deployment Metrics ', 'background: #23AE8F; color: #fff');
    var req = {};
    var time = {};
    var MS_PER_MINUTE = 60000;
    var now = new Date();
    var interval = new Date(now - offsetInMinutes * MS_PER_MINUTE);

    time.from = interval.toISOString();
    time.from = '2015-02-18T04:57:56+00:00';
    time.to = now.toISOString();

    req.tags = [];
    req.tags.push(deployment.name);

    req.time = time;

    //PulseApi.post('/event/get' + name, req, DeploymentConstants.GET_DEPLOYMENT_METRICS);
  },
  putRoutingOption: function(deployment, routeOption, newValues) {
    //console.log('%c Actions > Put Routing Option ', 'background: #23AE8F; color: #fff');

    var putObject = {
      "name": deployment.name,
      "clusters": {
        "frontend": {
          "services": {
            "breed": {
              "name": "monarch_front:0.1"
            },
            "routing": {
              "weight" : 95,
              "filters": [
                {
                  "condition": "user-agent = asdf"
                },
                {
                  "condition": "Header = X-VAMP-SCALA"
                }
              ]
            }
          }
        }
      }
    }

    Api.update('/deployments/' + deployment.name, putObject, DeploymentConstants.UPDATE_DEPLOYMENT_ROUTING);
  }
};

module.exports = DeploymentActions;