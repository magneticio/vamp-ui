var _ = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../constants/AppConstants');
var LoadStates = require("../constants/LoadStates.js");
var Actions = require('../actions/AppActions');

var CHANGE_EVENT = 'change';

var _errors = [];

// var _persistBreeds = function(response){
//   var _temp = {}
//   var array = JSON.parse(response.text);
//   _.each(array, function(obj){ 
//     _temp[obj.name] = obj;
//     _temp[obj.name].status = 'CLEAN';
//   });
//   _breeds = _temp;
// };

// var _addBreed = function(response){
//   var newBreed = JSON.parse(response.text);
//   _breeds[newBreed.name] = newBreed;
// }
var _registerError = function(actionType, message){
  _errors.push({
    'type': actionType,
    'time': Date.now(),
    'message': message,
  });
};

var AppStore = assign({}, EventEmitter.prototype,{

  getInfo: function() {
    //return _breeds;
  },
  getErrors: function(){
    return _errors;
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
      case AppConstants.GET_INFO:
        console.log('get info dispatcher');
        break;
      case AppConstants.GET_INFO + '_SUCCESS':
        console.log(payload.response);
        //_persistInfo(payload.response);
        break;
      case AppConstants.GET_INFO + '_ERROR':
        _registerError('GET_INFO', "Something went wrong. It's us, not you.");
        break;
      case AppConstants.GET_INFO + '_UNREACHABLE':
        _registerError('GET_INFO', "It's seems the backend is unreachable, are you sure it's running?");
        break; 
    }

    AppStore.emitChange();
    return true; 
  })
});

module.exports = AppStore;