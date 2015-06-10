var _ = require('underscore')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var LoadStates = require("../constants/LoadStates.js");

var CHANGE_EVENT = 'change';

var _blueprints = {};

var _persistBlueprints = function(response){
  var _temp = {}
  array = JSON.parse(response.text)
  _.each(array, function(obj){ 
    _temp[obj.name] = obj
    _temp[obj.name].status = 'CLEAN'
  });
  _blueprints = _temp
};

var _addBlueprint = function(response,id,status){
        _blueprints[id] = response
    };    

var BlueprintStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _blueprints;
  },

  getBlueprint: function(name) {
    return _.each(_blueprints, function(obj){ _.findWhere(obj, { "name" : name })})
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
      case 'GET_ALL_BLUEPRINTS_SUCCESS':
        _persistBlueprints(payload.response)
        break;
      case 'CREATE_BLUEPRINT':
        payload.response.status = 'DIRTY'
        _blueprints[payload.response.name] = payload.response
        break;
      case 'CREATE_BLUEPRINT_SUCCESS':
        _blueprints[payload.response.body.name].status = 'CLEAN'
        break;
      case 'DELETE_BLUEPRINT':
        _blueprints[payload.response.name].status = 'DELETING'                    
    }
    BlueprintStore.emitChange();
    return true; 
  })


})

module.exports = BlueprintStore