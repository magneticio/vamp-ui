var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var LoadStates = require("../constants/LoadStates.js");

var CHANGE_EVENT = 'change';

var _blueprints = [];

var _persistBlueprints = function(response){
      if (response != LoadStates.STATE_LOADING ) {
        _blueprints = JSON.parse(response.text)
      }
    };

var BlueprintStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    // console.log('return blueprints from store')
    return _blueprints;
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
      case 'GET_ALL_BLUEPRINTS':
        _persistBlueprints(payload.response)
        break;
    }
    BlueprintStore.emitChange();
    return true; 
  })


})

module.exports = BlueprintStore