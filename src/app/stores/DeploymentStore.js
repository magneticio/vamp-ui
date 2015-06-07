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
}        

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
        _persistDeployments(payload.response)
        break;

      case DeploymentConstants.GET_DEPLOYMENT + '_SUCCESS':
        _persistCurrentDeployment(payload.response)
        break;

      case BlueprintConstants.DEPLOY_BLUEPRINT:
        payload.response.status = 'DIRTY'
        _deployments[payload.response.name] = payload.response
        break;  

      case DeploymentConstants.CLEANUP_DEPLOYMENT:
        console.log('depl is: ' + payload)
        _deployments[payload.response.name].status = 'DELETING'

      case DeploymentConstants.UPDATE_DEPLOYMENT_ROUTING + '_SUCCESS':
      console.log(payload.response);
        //_persistCurrentDeployment(payload.response)
        break;                          
    }
    DeploymentStore.emitChange();
    return true; 
  })


})

module.exports = DeploymentStore