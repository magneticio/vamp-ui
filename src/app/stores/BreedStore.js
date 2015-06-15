var _ = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var BreedConstants = require('../constants/BreedConstants');
var LoadStates = require("../constants/LoadStates.js");
var Actions = require('../actions/BreedActions');

var CHANGE_EVENT = 'change';

var _breeds = {};

var _persistBreeds = function(response){
  var _temp = {}

  array = JSON.parse(response.text);
  _.each(array, function(obj){ 
    _temp[obj.name] = obj
    _temp[obj.name].status = 'CLEAN'
  });

  _breeds = _temp
};

var BreedStore = assign({}, EventEmitter.prototype,{

  getAll: function() {
    return _breeds;
  },

  getBreed: function(name) {
    if(_.isEmpty(_breeds)){
      console.log('breedstore: should wait');
    }
    return _.findWhere(_breeds, { "name" : name });
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
    var action = payload.actionType;
    switch(action) {
      case 'GET_ALL_BREEDS_SUCCESS':
        _persistBreeds(payload.response)
        break;
      case 'POST_BREED':
        _breeds[payload.response.name] = payload.response;
        break;
      case 'DELETE_BREED':
        _breeds[payload.response.name].status = 'DELETING'         
        break;
    }
    BreedStore.emitChange();
    return true; 
  })


})

module.exports = BreedStore