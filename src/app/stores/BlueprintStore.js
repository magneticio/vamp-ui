var _ = require('underscore')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var BlueprintConstants = require('../constants/BlueprintConstants');
var LoadStates = require("../constants/LoadStates.js");
var AppStore = require('./AppStore');

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

  setBlueprintStatus: function(name, newStatus) {
    var blueprint = _.findWhere(_blueprints, { "name" : name });
    console.log('%c before: ', 'background-color: #3498DB; color: white;', blueprint);
    blueprint.status = newStatus;
    console.log('%c after: ', 'background-color: #3498DB; color: white;', blueprint);
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
        AppStore.deleteError('UNREACHABLE');
        _persistBlueprints(payload.response);
        break;
      case BlueprintConstants.GET_ALL_BLUEPRINTS + '_UNREACHABLE':
        AppStore.putError('UNREACHABLE');
        break;
      // case BlueprintConstants.CREATE_BLUEPRINT:
      //   payload.response.status = 'DIRTY'
      //   _blueprints[payload.response.name] = payload.response
      //   break;
      case BlueprintConstants.CREATE_BLUEPRINT + '_SUCCESS':
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