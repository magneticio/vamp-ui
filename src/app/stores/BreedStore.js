var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var LoadStates = require("../constants/LoadStates.js");

var CHANGE_EVENT = 'change';

var _breeds = [];

var _persistBreeds = function(response){
      if (response != LoadStates.STATE_LOADING ) {
        _breeds = JSON.parse(response.text)
      }
    };

var BreedStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    // console.log('return breeds from store')
    return _breeds;
  },

  emitChange: function() {
    // console.log('emits change event from store')
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
    // console.log('register store with Dispatcher')
    var action = payload.actionType;
    switch(action) {
      case 'GET_ALL_BREEDS':
        _persistBreeds(payload.response)
        break;
    }
    BreedStore.emitChange();
    return true; 
  })


})

module.exports = BreedStore