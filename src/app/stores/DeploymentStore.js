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

  clearCurrentAsBlueprint: function(){
    console.log('clear as blueprint');
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

      case DeploymentConstants.GET_DEPLOYMENT_METRICS_SCUR + '_SUCCESS':
        AppStore.deleteError('UNREACHABLE');
        _currentDeployment.scur = JSON.parse(payload.response.text);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_RATE + '_SUCCESS':
        AppStore.deleteError('UNREACHABLE');
        _currentDeployment.rate = JSON.parse(payload.response.text);
        break;
      case DeploymentConstants.GET_DEPLOYMENT_METRICS_SERVICE + '_SUCCESS':
        AppStore.deleteError('UNREACHABLE');
        var metrics = payload.response.body;
        
        if(!_currentDeployment.serviceMetrics)
          _currentDeployment.serviceMetrics = {};

        _.each(metrics[0].tags, function(val, key){
          if(val.indexOf('services:') === 0){
            _currentDeployment.serviceMetrics[val] = payload.response.body;
            return;
          }
        });

      case DeploymentConstants.CLEANUP_DEPLOYMENT:
        if(_deployments[payload.response.name])
          _deployments[payload.response.name].status = 'DELETING';
        break;

      case DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT + '_SUCCESS':
        _currentDeploymentAsBlueprint = payload.response.text;
        console.log('%c get as blueprint success ', 'background-color: #29BB9C; color: white;');
        //window.open().document.write('<pre><code>' + payload.response.text + '</pre></code>');
        break;

      case DeploymentConstants.UPDATE_DEPLOYMENT + '_SUCCESS':
        console.log(payload.response);
        console.log('%c updated deployment ', 'background-color: #29BB9C; color: white;');
        console.log(payload.response.text);
        break;
    }
    
    DeploymentStore.emitChange();
    return true; 
  })

});

module.exports = DeploymentStore