var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');

var API_URL = 'http://localhost:8083/api/v1';
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
            dispatch(actionType + '_ERROR', null);
        } else {
            dispatch(actionType + '_SUCCESS', res);
        }
    };
}

function post(url, body) {

    console.log('posting to:' + url + '   ' + JSON.stringify(body,null,2))

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
