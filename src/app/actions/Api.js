var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/BreedConstants');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');


var API_URL = 'http://localhost:8080/api/v1';
var TIMEOUT = 10000;

var _pendingRequests = {};


function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
        _pendingRequests[key]._callback = function(){};
        _pendingRequests[key].abort();
        _pendingRequests[key] = null;
    }
}


function makeUrl(part) {
    return API_URL + part;
}

function dispatch(key, response) {
    var payload = {actionType: key, response: response};
    AppDispatcher.dispatch(payload);
}

function handleResponse(key) {
    return function (err, res) {
        if (err && err.timeout === TIMEOUT) {
            dispatch(key, LoadStates.STATE_TIMEOUT);
        }
         else if (!res.ok) {
            dispatch(key, LoadStates.STATE_ERROR);
        } else {
            dispatch(key, res, LoadStates.STATE_SUCCES);
        }
    };
}

function get(url) {
    return request
        .get(url)
        .timeout(TIMEOUT);
    }

var Api = {
    query: function(uri,key) {
        var url = makeUrl(uri);
        abortPendingRequests(key);
        dispatch(key, LoadStates.STATE_LOADING);
        _pendingRequests[key] = get(url).end(
            handleResponse(key)
        );
    }
};

module.exports = Api;