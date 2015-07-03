var Config = require('../config.js');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');

var TIMEOUT = 10000;

var _pendingRequests = {};

function abortPendingRequests(actionType) {
  if (_pendingRequests[actionType]) {
    _pendingRequests[actionType]._callback = function(){};
    _pendingRequests[actionType].abort();
    _pendingRequests[actionType] = null;
  }
}

function makeUrl(path) {
  return Config.getApiUrl() + path;
}

function dispatch(actionType, response) {
  var payload = {actionType: actionType, response: response };
  AppDispatcher.dispatch(payload);
}


function handleResponse(actionType) {
  return function (err, res) {
    if (err && err.timeout === TIMEOUT) {
      dispatch(LoadStates.STATE_TIMEOUT, null);
    }
    else if (!res.ok) {
      dispatch(actionType + '_ERROR', null);
    } else {
      //console.log(res);
      dispatch(actionType + '_SUCCESS', res);
    }
  };
}

function post(url, body) {
  return request
    .post(url)
    .send(body)
    .timeout(TIMEOUT);
}

var PulseApi = {
  post: function(uri,body,actionType) {
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType,body);
    _pendingRequests[actionType] = post(url,body).end(
      handleResponse(actionType)
    );
  }
};

module.exports = PulseApi;