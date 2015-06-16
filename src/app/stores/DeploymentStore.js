var _ = require('underscore')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var LoadStates = require("../constants/LoadStates.js");
var BlueprintConstants = require('../constants/BlueprintConstants');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Actions = require('../actions/DeploymentActions');

var CHANGE_EVENT = 'change';

var _deployments = {};
var _currentDeployment = {};
var _currentDeploymentMetrics = {};

var _persistDeployments = function(response){
  var _temp = {};
  array = JSON.parse(response.text);
  _.each(array, function(obj){
    _temp[obj.name] = obj;
    _temp[obj.name].status = 'CLEAN';
  });

  _deployments = _temp;
};

var _persistCurrentDeployment = function(response){
  _currentDeployment = JSON.parse(response.text)
};

var _eraseCurrentDeployment = function() {
  _currentDeployment = {};
};  

var DeploymentStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _deployments;
  },

  getCurrent: function() {
    return _currentDeployment;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {

    var action = payload.actionType;

    switch(action) {
      case DeploymentConstants.GET_ALL_DEPLOYMENTS + '_SUCCESS':
        _persistDeployments(payload.response);
        break;

      case DeploymentConstants.GET_DEPLOYMENT + '_SUCCESS':
        _persistCurrentDeployment(payload.response);
        break;

      case BlueprintConstants.DEPLOY_BLUEPRINT:
        payload.response.status = 'DIRTY';
        _deployments[payload.response.name] = payload.response;
        break;  

      case DeploymentConstants.CLEANUP_DEPLOYMENT:
        console.log('depl is: ' + payload);
        _deployments[payload.response.name].status = 'DELETING';
        break;

      case DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT + '_SUCCESS':
        window.open().document.write('<pre><code>' + payload.response.text + '</pre></code>');
        break;        

      case DeploymentConstants.GET_DEPLOYMENT_METRICS_SCUR + '_SUCCESS':
        _currentDeployment.scur = JSON.parse(payload.response.text);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_RATE + '_SUCCESS':
        _currentDeployment.rate = JSON.parse(payload.response.text);
        break;
    }
    
    DeploymentStore.emitChange();
    return true; 
  })

});

module.exports = DeploymentStore