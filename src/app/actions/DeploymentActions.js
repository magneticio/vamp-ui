var AppDispatcher = require('../dispatcher/AppDispatcher');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Api = require('./Api');

var DeploymentActions = {

  getAllDeployments: function() {
    // console.log('query sent to API')
    Api.query('/deployments', DeploymentConstants.GET_ALL_DEPLOYMENTS)
  }
};

module.exports = DeploymentActions;