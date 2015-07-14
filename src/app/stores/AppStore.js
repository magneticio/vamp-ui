var _ = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../constants/AppConstants');
var LoadStates = require("../constants/LoadStates.js");
var Actions = require('../actions/AppActions');

var CHANGE_EVENT = 'change';

var _info = {},
    _errors = {};

// var _persistBreeds = function(response){
//   var _temp = {}
//   var array = JSON.parse(response.text);
//   _.each(array, function(obj){ 
//     _temp[obj.name] = obj;
//     _temp[obj.name].status = 'CLEAN';
//   });
//   _breeds = _temp;
// };

var _registerError = function(errorType, message, artefactType){
  if(errorType == 'UNREACHABLE')
    message = "It seems the backend is unreachable, are you sure it's running?";

  _errors[errorType] = {
    'type': errorType,
    'time': Date.now(),
    'message': message,
    'artefact': artefactType
  };
};

var AppStore = assign({}, EventEmitter.prototype,{

  getInfo: function() {
    return _info;
  },
  getErrors: function(){
    return _errors;
  },
  putError: function(errorType, message){
    _registerError(errorType, message);
  },
  deleteError: function(errorType){
    if(_errors[errorType])
      delete _errors[errorType];
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
      case AppConstants.GET_INFO + '_SUCCESS':
        _info = JSON.parse(payload.response.text);
        AppStore.deleteError('GET_INFO');
        break;
      case AppConstants.GET_INFO + '_ERROR':
        console.log('info error');
        _registerError('GET_INFO', "Something went wrong. It's us, not you.");
        break;
      case AppConstants.GET_INFO + '_UNREACHABLE':
        _registerError('UNREACHABLE');
        break; 
    }

    AppStore.emitChange();
    return true; 
  })
});

module.exports = AppStore;