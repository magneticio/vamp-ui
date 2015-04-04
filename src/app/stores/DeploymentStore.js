var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var LoadStates = require("../constants/LoadStates.js");

var CHANGE_EVENT = 'change';

var _deployments = [];

var _persistDeployments = function(response){
      if (response != LoadStates.STATE_LOADING ) {
        _deployments = JSON.parse(response.text)
      }
    };

var DeploymentStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    // console.log('return deployments from store')
    return _deployments;
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
      case 'GET_ALL_DEPLOYMENTS':
        _persistDeployments(payload.response)
        break;
    }
    DeploymentStore.emitChange();
    return true; 
  })


})

module.exports = DeploymentStore