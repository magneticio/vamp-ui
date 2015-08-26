var _ = require('underscore')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var BlueprintConstants = require('../constants/BlueprintConstants');
var LoadStates = require("../constants/LoadStates.js");
var AppStore = require('./AppStore');

var CHANGE_EVENT = 'change';

var _blueprints = {};
var _currentBlueprint = {};
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
var _persistCurrentBlueprint = function(response){
  _currentBlueprint = response.text;
}

var BlueprintStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _blueprints;
  },
  getCurrentBlueprint: function() {
    return _currentBlueprint;
  },
  getError: function(){
    var returnError = _error;
    _error = null;
    if(returnError)
      return returnError;
  },
  setError: function(message){
    mixpanel.track("Blueprint store error registered");        
    _error = message;
  },

  setBlueprintStatus: function(name, newStatus) {
    var blueprint = _.findWhere(_blueprints, { "name" : name });
    blueprint.status = newStatus;
  },

  clearCurrentBlueprint: function(){
    _currentBlueprint = {};
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
      case BlueprintConstants.GET_ALL_BLUEPRINTS + '_SUCCESS':
        AppStore.deleteError('UNREACHABLE');
        _persistBlueprints(payload.response);
        break;
      case BlueprintConstants.GET_ALL_BLUEPRINTS + '_UNREACHABLE':
        AppStore.putError('UNREACHABLE');
        break;
      case BlueprintConstants.GET_ALL_BLUEPRINTS + '_ERROR':
        AppStore.putError('UNREACHABLE');
        break;  

      case BlueprintConstants.GET_BLUEPRINT + '_SUCCESS':
        _persistCurrentBlueprint(payload.response);
        break;
      case BlueprintConstants.GET_BLUEPRINT + '_ERROR':
        var errortext = JSON.parse(payload.response.text)
        _error = errortext.message;
        break;

      // CREATE
      case BlueprintConstants.CREATE_BLUEPRINT + '_SUCCESS':
        mixpanel.track("New blueprint added");        
        var response = JSON.parse(payload.response.text),
            newBlueprintName = response.name;
        if(newBlueprintName in _blueprints){
          _error = "Blueprint with name already exists";
        } else {
          _addBlueprint(payload.response);
          _persistCurrentBlueprint(payload.response);
        }
        break;
      case BlueprintConstants.CREATE_BLUEPRINT + '_ERROR':
        console.log(payload.response);
        var errortext = JSON.parse(payload.response.text)
        _error = errortext.message;
        break;

      // UPDATE
      case BlueprintConstants.UPDATE_BLUEPRINT + '_SUCCESS':        
          _addBlueprint(payload.response);
          _persistCurrentBlueprint(payload.response);
        break;
      case BlueprintConstants.UPDATE_BLUEPRINT + '_ERROR':
        console.log(payload.response);
        var errortext = JSON.parse(payload.response.text)
        _error = errortext.message;
        break;      

      // DELETE
      case BlueprintConstants.DELETE_BLUEPRINT:
        console.log(payload.response);
        _blueprints[payload.response.name].status = 'DELETING';
        break;
      case BlueprintConstants.DELETE_BLUEPRINT + '_ERROR':
        console.log(payload.response);
        _blueprints[payload.response.name].status = 'DELETE_ERROR';
        break;                      
    }
    
    BlueprintStore.emitChange();
    return true; 
  })


})

module.exports = BlueprintStore