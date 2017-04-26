/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
'use strict';
angular.module('vamp-ui')
  .factory('$vamp', ['$http', '$log', '$rootScope', '$websocket', '$timeout', function ($http, $log, $rootScope, $websocket, $timeout) {
    return new Vamp($http, $log, $rootScope, $websocket, $timeout);
  }])
  .run(['$vamp', function ($vamp) {
    $vamp.init();
    if (Environment.prototype.connect()) {
      $vamp.connect();
    }
  }]);

function Vamp($http, $log, $rootScope, $websocket, $timeout) {
  var $this = this;
  var stream;
  var transaction = 1;

  var apiHost;
  var namespace;

  var responseAcceptTypes = {
    JSON: 'application/json',
    YAML: 'application/x-yaml'
  };

  $this.info = {};

  var notify = function (name, value) {
    $log.debug('websocket notify: ' + name + ' :: ' + JSON.stringify(value));
    $rootScope.$broadcast(name, value);
  };

  var awaiting = [];

  var process = function (message) {
    $log.debug('websocket message: ' + message);
    var response = JSON.parse(message);

    if (response.content === 'JSON' && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
      }
    }

    if (awaiting[response.transaction]) {
      if (response.status === 'ERROR') {
        awaiting[response.transaction].reject(response);
      } else {
        awaiting[response.transaction].resolve(response);
      }

      delete awaiting[response.transaction];
    }

    var path = response.path;

    if (namespace) {
      path = path.substring(('/' + namespace).length);
    }

    notify(path, response);
  };

  this.connected = function () {
    return !_.isEmpty(stream);
  };

  this.get = function (path, params, accept) {
    return request('GET', path, params, accept);
  };

  this.post = function (path, data, params, accept) {
    return request('POST', path, data, params, accept);
  };

  this.peek = function (path, data, params, accept) {
    websocketRequest(path, 'PEEK', data, params ? params : {}, accept ? accept : 'JSON');
  };

  this.put = function (path, data, params, accept) {
    websocketRequest(path, 'PUT', data, params ? params : {}, accept ? accept : 'JSON');
  };

  this.remove = function (path, data, params, accept) {
    websocketRequest(path, 'REMOVE', data, params ? params : {}, accept ? accept : 'JSON');
  };

  this.await = function (request) {
    var current = transaction;
    awaiting[current] = {};

    var promise = new Promise(function (resolve, reject) {
      awaiting[current].reject = reject;
      awaiting[current].resolve = resolve;
      $timeout(function () {
        if (awaiting[current]) {
          awaiting[current].reject();
        }
      }, 5000);
      request();
    });

    awaiting[current].promise = promise;

    return promise;
  };

  this.init = function () {
    if (Environment.prototype.origin()) {
      this.origin = Environment.prototype.origin() + '/';
    } else {
      this.origin = window.location.host;
      this.origin += window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
    }
  };

  this.connect = function (ns) {
    if (namespace && ns === namespace) {
      return;
    }

    namespace = ns;

    var url = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    url += this.origin;
    apiHost = window.location.protocol + '//' + this.origin;

    if (namespace) {
      url += namespace + '/';
      apiHost += namespace + '/';
    }

    url += 'websocket';
    apiHost += 'api/v1';

    var websocket = function () {
      if (stream) {
        stream.close();
        stream = null;
      }

      $log.debug('websocket: ' + url);
      stream = $websocket(url);

      stream.onOpen(function () {
        $log.debug('websocket is opened');
        notify('$vamp:connection', 'opened');
      });

      stream.onClose(function () {
        if (!stream) {
          return;
        }

        $log.info('websocket closed, will try to reconnect in 5 seconds...');
        notify('$vamp:connection', 'closed');
        stream = null;
        $timeout(websocket, 5000);
      });

      stream.onMessage(function (message) {
        process(message.data);
      });
    };

    websocket();
  };

  function websocketRequest(path, action, data, params, accept) {
    if (!stream) {
      return null;
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    if (namespace) {
      path = '/' + namespace + path;
    }

    var message = {
      api: 'v1',
      path: path,
      action: action,
      accept: accept,
      content: 'JSON',
      transaction: String(transaction++),
      data: data,
      parameters: params
    };

    $log.debug('websocket send: ' + JSON.stringify(message));
    stream.send(message);
  }

  function request(method, path, data, params, accept) {
    // default return type
    accept = accept || 'JSON';

    var config = {
      method: method,
      url: apiHost + path,
      headers: {
        'Content-Type': 'application/json',
        'Accept': responseAcceptTypes[accept]
      },
      data: data,
      params: params
    };

    $log.debug('http request sent: ' + JSON.stringify(config));

    return $http(config);
  }

  $rootScope.$on('/info', function (event, data) {
    /* eslint camelcase: ["error", {properties: "never"}] */
    if (data.content !== 'JSON') {
      return;
    }
    data = data.data;
    if (!data.persistence || !data.pulse || !data.key_value || !data.gateway_driver || !data.container_driver || !data.workflow_driver) {
      return;
    }

    $this.info.message = data.message;
    $this.info.running_since = data.running_since;
    $this.info.version = data.version;
    $this.info.ui_version = Environment.prototype.version();
    $this.info.persistence = data.persistence.database.type === 'key-value' ? data.key_value.type : data.persistence.database.type;
    $this.info.pulse = data.pulse.type;
    $this.info.key_value_store = data.key_value.type;
    $this.info.container_driver = data.container_driver.type;

    $this.info.gateway_driver = '';
    var types = new Set();
    for (var gateway in data.gateway_driver.marshallers) {
      if (gateway && data.gateway_driver.marshallers.hasOwnProperty(gateway)) {
        types.add(data.gateway_driver.marshallers[gateway].type);
      }
    }
    types.forEach(function (value) {
      $this.info.gateway_driver += $this.info.gateway_driver === '' ? value : ', ' + value;
    });

    $this.info.workflow_driver = '';
    for (var workflow in data.workflow_driver) {
      if (workflow && data.workflow_driver.hasOwnProperty(workflow)) {
        $this.info.workflow_driver += $this.info.workflow_driver === '' ? workflow : ', ' + workflow;
      }
    }
  });
}
