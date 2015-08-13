var _ = require('underscore')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var LoadStates = require("../constants/LoadStates.js");
var BlueprintConstants = require('../constants/BlueprintConstants');
var DeploymentConstants = require('../constants/DeploymentConstants');
var BlueprintStore = require('../stores/BlueprintStore');
var Actions = require('../actions/DeploymentActions');
var AppStore = require('./AppStore');

var CHANGE_EVENT = 'change';

var _deployments = {};
var _currentDeployment = {};
var _currentDeploymentMetrics = {};
var _blueprintToDeploy = '';
var _currentDeploymentAsBlueprint = null;
var _error = null;

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
var _updateDeploymentStatus = function(response){
  var newDeployment = JSON.parse(response.text);
  _currentDeployment.clusters = newDeployment.clusters;
};
var removeDuplicateMetrics = function(metrics){
  var usedObjects = {};
  for (var i=metrics.length - 1;i>=0;i--) {
    var so = JSON.stringify(metrics[i]);
    if (usedObjects[so]) {
      metrics.splice(i, 1);
    } else {
      usedObjects[so] = true;          
    }
  }
  return metrics;
}

var DeploymentStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _deployments;
  },
  getCurrent: function() {
    return _currentDeployment;
  },
  getCurrentAsBlueprint: function(){
    return _currentDeploymentAsBlueprint;
  },
  getError: function(){
    var returnError = _error;
    _error = null;
    return returnError;
  },

  clearCurrentAsBlueprint: function(){
    _currentDeploymentAsBlueprint = null;
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

      // GET
      case DeploymentConstants.GET_ALL_DEPLOYMENTS + '_SUCCESS':
        AppStore.deleteError('UNREACHABLE');
        _persistDeployments(payload.response);
        break;
      case DeploymentConstants.GET_ALL_DEPLOYMENTS + '_UNREACHABLE':
        AppStore.putError('UNREACHABLE');
        break;
      case DeploymentConstants.GET_ALL_DEPLOYMENTS + '_ERROR':
        AppStore.putError('UNREACHABLE');
        break;

      case DeploymentConstants.GET_DEPLOYMENT + '_SUCCESS':
        _persistCurrentDeployment(payload.response);
        break;
      case DeploymentConstants.GET_DEPLOYMENT + '_UNREACHABLE':
        AppStore.putError('UNREACHABLE');
        break;
      case DeploymentConstants.GET_DEPLOYMENT + '_ERROR':
        AppStore.putError('UNREACHABLE');
        break;

      case DeploymentConstants.GET_DEPLOYMENT_STATUS + '_SUCCESS':
        _updateDeploymentStatus(payload.response);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_STATUS + '_UNREACHABLE':
        AppStore.putError('UNREACHABLE');
        break;
      case DeploymentConstants.GET_DEPLOYMENT_STATUS + '_ERROR':
        AppStore.putError('UNREACHABLE');
        break;

      case DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT + '_SUCCESS':
        _currentDeploymentAsBlueprint = payload.response.text;
        console.log('%c get as blueprint success ', 'background-color: #29BB9C; color: white;');
        break;

      // DEPLOY
      case BlueprintConstants.DEPLOY_BLUEPRINT:
        payload.response.status = 'PENDING';
        _blueprintToDeploy = payload.response.name;
        _deployments[payload.response.name] = payload.response;
        BlueprintStore.setBlueprintStatus(_blueprintToDeploy, payload.response.status);
        break;
      case BlueprintConstants.DEPLOY_BLUEPRINT + '_SUCCESS':
        payload.response.status = 'ACCEPTED';
        BlueprintStore.setBlueprintStatus(_blueprintToDeploy, payload.response.status);
        break;
      case BlueprintConstants.DEPLOY_BLUEPRINT + '_ERROR':
        console.log('%c deploying ERROR ', 'background-color: red; color: white;');
        break;

      // DELETE
      case DeploymentConstants.DELETE_FULL_DEPLOYMENT + '_SUCCESS':
        var deletedDeployment = JSON.parse(payload.response.text);
        delete _deployments[deletedDeployment.name];
        break;

      // METRICS
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_STREAM:
        console.log('stream!');
        //_currentDeployment.rtime = JSON.parse(payload.response.text);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_RATE + '_SUCCESS':
        AppStore.deleteError('PULSE_ERROR');
        var metrics = payload.response.body;

        if(!_currentDeployment.metrics){
          _currentDeployment.metrics = {};
          _currentDeployment.metrics.rate = [];
          _currentDeployment.metrics.rtime = [];
        }
        
        if(metrics[0] && 'tags' in metrics[0]){
          _.each(metrics, function(val, key){
            if(val.tags.indexOf('metrics:rate') > -1){
              _currentDeployment.metrics.rate.unshift({"value": val.value, "timestamp": val.timestamp });
              _currentDeployment.metrics.rate = removeDuplicateMetrics(_currentDeployment.metrics.rate);
            }          
            if(val.tags.indexOf('metrics:rtime') > -1){
              _currentDeployment.metrics.rtime.unshift({"value": val.value, "timestamp": val.timestamp });
              _currentDeployment.metrics.rtime = removeDuplicateMetrics(_currentDeployment.metrics.rtime);
            }
          });
        }
        break;
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_SERVICE + '_SUCCESS':
        AppStore.deleteError('PULSE_ERROR');
        var metrics = payload.response.body;

        if(!_currentDeployment.serviceMetrics)
          _currentDeployment.serviceMetrics = {};

        if(metrics[0] && 'tags' in metrics[0]){
          _.each(metrics[0].tags, function(val, key){
            if(val.indexOf('services:') === 0){
              _currentDeployment.serviceMetrics[val] = payload.response.body;
              return;
            }
          });
        }
        break;

      // CLEANUP
      case DeploymentConstants.CLEANUP_DEPLOYMENT:
        if(_deployments[payload.response.name])
          _deployments[payload.response.name].status = 'DELETING';
        break;

      // UPDATE
      case DeploymentConstants.UPDATE_DEPLOYMENT + '_SUCCESS':
        _currentDeploymentAsBlueprint = null;
        break;
      case DeploymentConstants.UPDATE_DEPLOYMENT + '_ERROR':
        var errortext = JSON.parse(payload.response.text)
        _error = errortext.message;
        break;
    }
    
    DeploymentStore.emitChange();
    return true; 
  })

});

module.exports = DeploymentStore