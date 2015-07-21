var Config = require('../config.js');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppStore = require('../stores/AppStore');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');

var TIMEOUT = Config.TIMEOUT;

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
    } else if (typeof res == "undefined" || !res.ok) {
      handleError(actionType, res);
      AppStore.putError('PULSE_ERROR');
    } else {
      dispatch(actionType + '_SUCCESS', res);
    }
  };
};
function handleError(actionType, res){
  console.log('pulse api error');
  if(res){
    dispatch(actionType + '_ERROR', res);
  } else {
    dispatch(actionType + '_UNREACHABLE');
  }
};

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