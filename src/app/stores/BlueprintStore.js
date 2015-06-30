var _ = require('underscore')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var BlueprintConstants = require('../constants/BlueprintConstants');
var LoadStates = require("../constants/LoadStates.js");

var CHANGE_EVENT = 'change';

var _blueprints = {};
var _error = null;

var _persistBlueprints = function(response){
  var _temp = {}
  var array = JSON.parse(response.text)
  _.each(array, function(obj){ 
    _temp[obj.name] = obj
    _temp[obj.name].status = 'CLEAN'
  });
  _blueprints = _temp
};

// var _addBlueprint = function(response,id,status){
//     _blueprints[id] = response
// };
var _addBlueprint = function(response){
  var newBlueprint = JSON.parse(response.text);
  _blueprints[newBlueprint.name] = newBlueprint;
}

var BlueprintStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _blueprints;
  },
  getBlueprint: function(name) {
    return _.findWhere(_blueprints, { "name" : name });
  },
  getError: function(){
    var returnError = _error;
    _error = null;
    return returnError;
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
      case BlueprintConstants.GET_ALL_BLUEPRINTS + '_SUCCESS':
        _persistBlueprints(payload.response)
        break;

      // case BlueprintConstants.CREATE_BLUEPRINT:
      //   payload.response.status = 'DIRTY'
      //   _blueprints[payload.response.name] = payload.response
      //   break;
      case BlueprintConstants.CREATE_BLUEPRINT + '_SUCCESS':
        console.log('created');
        _addBlueprint(payload.response);
        break;
      case BlueprintConstants.CREATE_BLUEPRINT + '_ERROR':
        var errortext = JSON.parse(payload.response.text)
        _error = errortext.message;
        break;

      case BlueprintConstants.DELETE_BLUEPRINT:
        _blueprints[payload.response.name].status = 'DELETING'                    
    }
    
    BlueprintStore.emitChange();
    return true; 
  })


})

module.exports = BlueprintStore