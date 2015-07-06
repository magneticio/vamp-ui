var _ = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var BreedConstants = require('../constants/BreedConstants');
var LoadStates = require("../constants/LoadStates.js");
var Actions = require('../actions/BreedActions');
var AppStore = require('./AppStore');

var CHANGE_EVENT = 'change';

var _breeds = {};
var _error = null;

var _persistBreeds = function(response){
  var _temp = {}
  var array = JSON.parse(response.text);
  _.each(array, function(obj){ 
    _temp[obj.name] = obj;
    _temp[obj.name].status = 'CLEAN';
  });
  _breeds = _temp;
};
var _addBreed = function(response){
  var newBreed = JSON.parse(response.text);
  _breeds[newBreed.name] = newBreed;
}

var BreedStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _breeds;
  },
  getBreed: function(name) {
    return _.findWhere(_breeds, { "name" : name });
  },
  getError: function(){
    var returnError = _error;
    _error = null;
    return returnError;
  },

  emitChange: function() {
     //console.log('emits change event from store')
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    // console.log('add change listener to store')
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    
    var action = payload.actionType;

    switch(action) {
      case BreedConstants.GET_ALL_BREEDS + '_SUCCESS':
        AppStore.deleteError('UNREACHABLE');
        _persistBreeds(payload.response)
        break;
      case BreedConstants.GET_ALL_BREEDS + '_UNREACHABLE':
        AppStore.putError('UNREACHABLE');
        break;
      case BreedConstants.GET_ALL_BREEDS + '_ERROR':
        AppStore.putError('UNREACHABLE');
        break;

      case BreedConstants.CREATE_BREED + '_SUCCESS':
        _addBreed(payload.response);
        break;
      case BreedConstants.CREATE_BREED + '_ERROR':
        var errortext = JSON.parse(payload.response.text)
        _error = errortext.message;
        break;

      case BreedConstants.DELETE_BREED:
        _breeds[payload.response.name].status = 'DELETING'         
        break;
      case BreedConstants.DELETE_BREED + '_SUCCESS':
        _breeds[payload.response.name].status = 'DELETED'         
        break;
    }

    BreedStore.emitChange();
    return true; 
  })
});

module.exports = BreedStore