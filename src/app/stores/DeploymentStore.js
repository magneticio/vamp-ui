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
var _deleting = false;

var _persistDeployments = function(response){
  var _temp = {};
  array = JSON.parse(response.text);
  _.each(array, function(obj){
    _temp[obj.name] = obj;
    _temp[obj.name].status = 'CLEAN';
  });
  _deployments = _temp;
  _deleting = false;
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
  while(metrics.length > 30){
    metrics.pop();
  }
  return metrics;
}

var DeploymentStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    if(!_deleting)
      return _deployments;
  },
  getCurrent: function() {
    return _currentDeployment;
  },
  getCurrentAsBlueprint: function(){
    return _currentDeploymentAsBlueprint;
  },
  getError: function(){
    mixpanel.track("Deployment error registered");        
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
        var errormessage = null;
        if(payload.response.status == 404)
          errormessage = payload.response.text;
        AppStore.putError('UNREACHABLE',errormessage);
        break;
      case DeploymentConstants.GET_DEPLOYMENT + '_ERROR':
        var errormessage = null;
        if(payload.response.status == 404)
          errormessage = payload.response.text;
        AppStore.putError('UNREACHABLE',errormessage);
        break;

      case DeploymentConstants.GET_DEPLOYMENT_STATUS + '_SUCCESS':
        _updateDeploymentStatus(payload.response);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_STATUS + '_UNREACHABLE':
        var errormessage = null;
        if(payload.response.status == 404)
          errormessage = payload.response.text;
        AppStore.putError('UNREACHABLE',errormessage);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_STATUS + '_ERROR':
        var errormessage = null
        if(payload.response.status == "404"){
          errormessage = payload.response.text;
        }
        AppStore.putError('UNREACHABLE',errormessage);
        break;

      case DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT + '_SUCCESS':
        _currentDeploymentAsBlueprint = payload.response.text;
        break;

      // DEPLOY
      case BlueprintConstants.DEPLOY_BLUEPRINT:
        payload.response.status = 'PENDING';
        _blueprintToDeploy = payload.response.name;
        _deployments[payload.response.name] = payload.response;
        BlueprintStore.setBlueprintStatus(_blueprintToDeploy, payload.response.status);
        break;
      case BlueprintConstants.DEPLOY_BLUEPRINT + '_SUCCESS':
        mixpanel.track("Blueprint deployed");        
        payload.response.status = 'ACCEPTED';
        BlueprintStore.setBlueprintStatus(_blueprintToDeploy, payload.response.status);
        break;
      case BlueprintConstants.DEPLOY_BLUEPRINT + '_ERROR':
        var errorMessage = JSON.parse(payload.response.text);
            errorMessage = errorMessage.message;
            payload.response.status = 'BADREQUEST';
        if(errorMessage.indexOf('The request content was malformed.') > -1)
          errorMessage = errorMessage.substring('The request content was malformed.'.length);
        BlueprintStore.setBlueprintStatus(_blueprintToDeploy, payload.response.status);
        BlueprintStore.setError(errorMessage);
        break;

      // DELETE
      case DeploymentConstants.DELETE_FULL_DEPLOYMENT + '_SUCCESS':
        var deletedDeployment = JSON.parse(payload.response.text);
        delete _deployments[deletedDeployment.name];
        break;

      // METRICS
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_STREAM:        
        var data = JSON.parse(payload.data),
            serviceName = '';

        _.each(data.tags, function(tag){
          if(tag.indexOf('services:') > -1)
            serviceName = tag.substring(9);
        }, this);

        _.each(_currentDeployment.clusters, function(cluster,key){
          _.each(cluster.services, function(service, key){
            if(service.breed.name == serviceName){
              if(!service.metrics)
                service.metrics = {};
              service.metrics[payload.metricsType] = data.value;
            }
          }, this);
        }, this);
        break;
        
      case DeploymentConstants.GET_DEPLOYMENT_ENDPOINT_RTIME + '_SUCCESS':
        AppStore.deleteError('PULSE_ERROR');
        var metrics = payload.response.body;
        if(!_.isEmpty(_currentDeployment) && !_currentDeployment.metrics){
          _currentDeployment.metrics = {};
          _currentDeployment.metrics.rate = [];
          _currentDeployment.metrics.rtime = [];
        }
        if(_currentDeployment.metrics && 'rtime' in _currentDeployment.metrics)
          _currentDeployment.metrics.rtime = metrics;
        break;
      case DeploymentConstants.GET_DEPLOYMENT_ENDPOINT_RATE + '_SUCCESS':
        AppStore.deleteError('PULSE_ERROR');
        var metrics = payload.response.body;
        if(!_.isEmpty(_currentDeployment) && !_currentDeployment.metrics){
          _currentDeployment.metrics = {};
          _currentDeployment.metrics.rate = [];
          _currentDeployment.metrics.rtime = [];
        }
        if(_currentDeployment.metrics && 'rate' in _currentDeployment.metrics)
          _currentDeployment.metrics.rate = metrics;

      // CLEANUP
      case DeploymentConstants.CLEANUP_DEPLOYMENT:
        if(_deployments[payload.response.name])
          _deployments[payload.response.name].status = 'DELETING';
        break;

      // UPDATE
      case DeploymentConstants.UPDATE_DEPLOYMENT + '_SUCCESS':
        mixpanel.track("Deployment updated trought UI");        
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