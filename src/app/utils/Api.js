var _ = require('underscore');
var Config = require('../config.js');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');

var TIMEOUT = Config.TIMEOUT;
var _pendingRequests = {};

// Helpers
function abortPendingRequests(actionType) {
  if (_pendingRequests[actionType]) {
    _pendingRequests[actionType]._callback = function(){};
    _pendingRequests[actionType].abort();
    _pendingRequests[actionType] = null;
  }
};
function makeUrl(path) {
  return Config.getApiUrl() + path;
};
function dispatch(actionType, response) {
  var payload = {actionType: actionType, response: response };

  if (response && response.endpoints) {
    response = toNew(response);
  } else if (response && response.req && response.req.method === 'GET' && (response.req.url.indexOf('deployments') > -1 || response.req.url.indexOf('blueprints') > -1)) {
    try {
         var text = JSON.parse(payload.response.text);
         if (text instanceof Array) {
           response.text = JSON.stringify(_.map(text, toOld(response)));
         } else {
           response.text = JSON.stringify(toOld(response, text));
         }
     } catch (e) {
       // yaml format
     }
  }

  AppDispatcher.dispatch(payload);
};

// workaround for new DSL

var deployments = {};

function toOld(response, blueprint) {

  // transform gateways

  var endpoints = _.map(blueprint.gateways, function(gateway, port) {
    var route = Object.keys(gateway.routes)[0].split("/")
    route.splice(0, 1);
    var target = route.join('.');
    var endpoint = {};
    endpoint[target] = port;
    return endpoint;
  });

  delete blueprint['gateways'];

  blueprint.endpoints = {};
  _.each(endpoints, function(endpoint) {
    var property = Object.keys(endpoint)[0]
    blueprint.endpoints[property] = endpoint[property];
  });

  // transform clusters

  _.each(blueprint.clusters, function(cluster, name) {

    // transform routing and servers
    var routing = cluster.routing;
    if (routing) {
      routing = routing[Object.keys(routing)[0]];
      _.each(cluster.services, function(service) {
        var name = service.breed.name ? service.breed.name : service.breed.reference;
        if (routing.routes && routing.routes[name]) {
          service.routing = routing.routes[name];
        }
        // servers
        service.servers = service.instances;
        delete service['instances'];
      });
    }
    delete cluster['routing'];

    // transform port mapping
    cluster['routes'] = cluster.port_mapping;
    delete cluster['port_mapping'];
  });

  // store if it's deployment
  if (response.req.url.indexOf('deployments') > -1) {
    var source = JSON.parse(response.text);
    if (source instanceof Array) {
      deployments[blueprint.name] = _.find(source, function(dep){ return dep.name == blueprint.name; });
    } else {
      deployments[blueprint.name] = source;
    }
  }

  return blueprint;
};
function toNew(deployment) {
  var old = deployments[deployment.name];
  if (old) {
    _.each(deployment.clusters, function(cluster, name) {
      _.each(cluster.services, function(service) {
        var oldCluster = old.clusters[name];
        var routing = oldCluster.routing[Object.keys(oldCluster.routing)[0]];

        console.log("routing: " + JSON.stringify(routing));

        routing.routes[service.breed.name] = service.routing;
      });
    });

    return old;
  }

  return deployment;
};
// \workaround

function handleResponse(actionType) {
  return function (err, res) {
    if (err && err.timeout === TIMEOUT) {
      console.log('timeout', actionType);
      handleError(actionType, res);
      dispatch(LoadStates.STATE_TIMEOUT, null);
    } else if (typeof res == "undefined" || !res.ok) {
      handleError(actionType, res);
    } else {
      dispatch(actionType + '_SUCCESS', res);
    }
  };
};
function handleError(actionType, res){
  console.log('api error', res);
  if(res){
    dispatch(actionType + '_ERROR', res);
  } else {
    dispatch(actionType + '_UNREACHABLE');
  }
};

// REST methods
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
function put(url, body, contenttype) {
  return request
    .put(url)
    .set('Content-type', contenttype)
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
function purge(body) {

  try {
    return _.omit(body, "status");
  } catch (e) {
    // ignore
  }

  try {
    return JSON.stringify(_.omit(JSON.parse(body), "status"));
  } catch (e) {
    // ignore
  }

  return body;
};

// Public methods
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
    _pendingRequests[actionType] = post(url,purge(body), contenttype).end(
      handleResponse(actionType)
    );
  },
  update: function(uri,body,actionType, contenttype) {
    contenttype = typeof contenttype !== 'undefined' ? contenttype : 'application/json';
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType,body);
    _pendingRequests[actionType] = put(url,purge(body), contenttype).end(
       handleResponse(actionType)
    );
  },
  del: function(uri,body,actionType) {
    var url = makeUrl(uri);
    abortPendingRequests(actionType);
    dispatch(actionType, body);
    _pendingRequests[actionType] = del(url,purge(body)).end(
      handleResponse(actionType)
    );
  }
};

module.exports = Api;