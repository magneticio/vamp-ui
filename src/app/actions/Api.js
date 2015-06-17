var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');

var API_URL = 'http://192.168.59.103:8080/api/v1';
var TIMEOUT = 10000;

var _pendingRequests = {};

function abortPendingRequests(actionType) {
  if (_pendingRequests[actionType]) {
    _pendingRequests[actionType]._callback = function(){};
    _pendingRequests[actionType].abort();
    _pendingRequests[actionType] = null;
  }
}

function makeUrl(part) {
  return API_URL + part;
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
      dispatch(actionType + '_ERROR', res);
    } else {
      dispatch(actionType + '_SUCCESS', res);
    }
  };
};

function get(url,params,accept) {
  return request
    .get(url)
    .accept(accept)
    .query(params)
    .timeout(TIMEOUT);
};
function post(url, body, contenttype) {
  return request
    .post(url)
    .set('Content-type', contenttype)
    .send(body)
    .timeout(TIMEOUT);
};
function put(url, body) {
  //console.log('putting to:' + url + '   ' + JSON.stringify(body,null,2))
  return request
    .put(url)
    .send(body)
    .timeout(TIMEOUT);
};
function del(url,body) {
  if(body !== null) {
    return request
      .del(url)
      .set('Content-type', 'application/json')
      .send(body)
      .timeout(TIMEOUT);
  } else {
    return request
      .del(url)
      .timeout(TIMEOUT);
  }
};  

var Api = {
  get: function(uri,params,actionType,accept) {
    accept = typeof accept !== 'undefined' ? accept : null;
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType, LoadStates.STATE_LOADING);
    _pendingRequests[actionType] = get(url,params,accept).end(
      handleResponse(actionType)
    );
  },
  create: function(uri,body,actionType, contenttype) {
    contenttype = typeof contenttype !== 'undefined' ? contenttype : 'application/json';
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType,body);
    _pendingRequests[actionType] = post(url,body, contenttype).end(
      handleResponse(actionType)
    );
  },
  update: function(uri,body,actionType) {
    console.log('update');
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType,body);
    _pendingRequests[actionType] = put(url,body).end(
       handleResponse(actionType)
    );
  },
  del: function(uri,body,actionType) {
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType, body);
    _pendingRequests[actionType] = del(url,body).end(
      handleResponse(actionType)
    );
  }  
};

module.exports = Api;