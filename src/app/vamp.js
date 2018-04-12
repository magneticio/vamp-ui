/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
'use strict';
angular.module('vamp-ui')
  .factory('$vamp', ['$http', '$log', '$rootScope', function ($http, $log, $rootScope) {
    return new Vamp($http, $log, $rootScope);
  }])
  .run(['$vamp', function ($vamp) {
    $vamp.init();
  }]);

function Vamp($http, $log, $rootScope) {
  var $this = this;
  $this.info = {};

  var acceptTypes = {
    JSON: 'application/json',
    YAML: 'application/x-yaml'
  };

  var requestNamespace = null;
  var connectionNamespace = null;

  this.getNamespace = function () {
    return requestNamespace || connectionNamespace;
  };

  this.setRequestNamespace = function (namespace) {
    var changed = requestNamespace !== namespace;
    requestNamespace = namespace;
    if (changed) {
      $this.notify('$vamp:namespace', 'changed');
    }
  };

  this.setConnectionNamespace = function (namespace) {
    var changed = connectionNamespace !== namespace;
    connectionNamespace = namespace;
    if (changed) {
      $this.notify('$vamp:namespace', 'changed');
    }
  };

  this.init = function () {
    if (Environment.prototype.origin()) {
      $this.origin = Environment.prototype.origin() + '/';
    } else {
      $this.origin = window.location.host;
      $this.origin += window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
    }
  };

  this.get = function (path, params, accept) {
    return $this.request('GET', path, null, params, accept);
  };

  this.emit = function (path, params, accept) {
    return $this.request('GET', path, null, params, accept).then(function (response) {
      $this.notify(path, response);
    });
  };

  this.apiHostPath = function () {
    var baseUrl = $this.origin;
    var namespace = $this.getNamespace();
    if (namespace) {
      baseUrl += namespace + '/';
    }
    return window.location.protocol + '//' + baseUrl + 'api/v1';
  };

  this.request = function (method, path, data, params, accept) {
    return $http({
      method: method,
      url: $this.apiHostPath() + path,
      headers: {
        'Content-Type': 'application/json',
        'Accept': acceptTypes[accept || 'JSON']
      },
      data: data,
      params: params
    });
  };

  this.notify = function (name, value) {
    $log.debug('notify: ' + name + ' :: ' + JSON.stringify(value));
    $rootScope.$broadcast(name, value);
  };

  this.parseInfo = function (response) {
    // eslint camelcase: ["error", {properties: "never"}]
    if (response.content !== 'JSON') {
      return;
    }
    var info = response.data;
    $this.info.message = info.message;
    $this.info.running_since = info.running_since;
    $this.info.version = info.version;
    $this.info.ui_version = Environment.prototype.version();

    if (!info.persistence || !info.pulse || !info.key_value) {
      return;
    }

    $this.info.persistence = info.persistence.database.type === 'key-value' ? info.key_value.type : info.persistence.database.type;
    $this.info.pulse = info.pulse.type;
    $this.info.key_value_store = info.key_value.type;

    if (!info.gateway_driver || !info.container_driver || !info.workflow_driver) {
      return;
    }

    $this.info.container_driver = info.container_driver.type;

    $this.info.gateway_driver = '';
    var types = new Set();
    for (var gateway in info.gateway_driver.marshallers) {
      if (gateway && info.gateway_driver.marshallers.hasOwnProperty(gateway)) {
        types.add(info.gateway_driver.marshallers[gateway].type);
      }
    }
    types.forEach(function (value) {
      $this.info.gateway_driver += $this.info.gateway_driver === '' ? value : ', ' + value;
    });

    $this.info.workflow_driver = '';
    for (var workflow in info.workflow_driver) {
      if (workflow && info.workflow_driver.hasOwnProperty(workflow)) {
        $this.info.workflow_driver += $this.info.workflow_driver === '' ? workflow : ', ' + workflow;
      }
    }
    return $this.info;
  };
}

/*
function Vamp($http, $log, $rootScope, $websocket, $timeout, $q) {
  var $this = this;
  var stream;
  var connections = [];
  var transaction = 1;
  var responseAcceptTypes = {
    JSON: 'application/json',
    YAML: 'application/x-yaml'
  };

  $this.info = {};

  var requestNamespace = null;
  var connectionNamespace = null;

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
      } catch (e) {}
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

    if (connectionNamespace && path.startsWith('/' + connectionNamespace + '/')) {
      path = path.substring(('/' + connectionNamespace).length);
    }

    if (requestNamespace && path.startsWith('/' + requestNamespace + '/')) {
      path = path.substring(('/' + requestNamespace).length);
    }

    notify(path, response);
  };

  this.getRequestNamespace = function () {
    return requestNamespace;
  };

  this.setRequestNamespace = function (namespace) {
    var changed = requestNamespace !== namespace;
    requestNamespace = namespace;
    if (changed) {
      notify('$vamp:namespace', 'changed');
    }
  };

  this.getConnectionNamespace = function () {
    return connectionNamespace;
  };

  this.setConnectionNamespace = function (namespace) {
    var changed = connectionNamespace !== namespace;
    connectionNamespace = namespace;
    if (changed) {
      notify('$vamp:namespace', 'changed');
    }
  };

  this.apiHostPath = function () {
    var baseUrl = this.origin;

    if (requestNamespace) {
      baseUrl += requestNamespace + '/';
    } else if (connectionNamespace) {
      baseUrl += connectionNamespace + '/';
    }

    return window.location.protocol + '//' + baseUrl + 'api/v1';
  };

  this.connected = function () {
    return !_.isEmpty(stream);
  };

  this.get = function (path, params, accept) {
    return request('GET', path, null, params, accept);
  };

  this.post = function (path, data, params, accept) {
    return request('POST', path, data, params, accept);
  };

  this.httpPut = function (path, data, params, accept) {
    return request('PUT', path, data, params, accept);
  };

  this.delete = function (path, data, params, accept) {
    return request('DELETE', path, data, params, accept);
  };

  this.peek = function (path, data, params, accept, ns) {
    websocketRequest(path, 'PEEK', data, params ? params : {}, accept ? accept : 'JSON', ns ? ns : requestNamespace);
  };

  this.put = function (path, data, params, accept, ns) {
    websocketRequest(path, 'PUT', data, params ? params : {}, accept ? accept : 'JSON', ns ? ns : requestNamespace);
  };

  this.remove = function (path, data, params, accept, ns) {
    websocketRequest(path, 'REMOVE', data, params ? params : {}, accept ? accept : 'JSON', ns ? ns : requestNamespace);
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
      }, 20000);
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

  this.connect = function () {
    var baseUrl = this.origin;

    if (connectionNamespace) {
      baseUrl += connectionNamespace + '/';
    }

    var ws = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    ws += baseUrl + 'websocket';

    var websocket = function () {
      if (stream) {
        stream.close(true);
        stream = null;
      }

      $log.debug('websocket: ' + ws);
      stream = $websocket(ws);

      stream.onOpen(function (ev) {
        connections.push(ev.target.url);
        $log.debug('websocket is opened');
        notify('$vamp:connection', 'opened');
      });

      stream.onClose(function (forcedClose) {
        if (!connections) {
          return;
        }
        stream = null;
        if (!forcedClose) {
          var retryPeriod = 3; // seconds
          $log.info('websocket closed, will try to reconnect in ' + retryPeriod + ' seconds...');
          notify('$vamp:connection', 'closed');
          $timeout(websocket, retryPeriod * 1000);
        }
      });

      stream.onMessage(function (message) {
        process(message.data);
      });
    };

    websocket();
  };

  this.disconnect = function () {
    if (stream) {
      connections.length = 0;
      // force closing
      stream.close(true);
      stream = null;
    }
    connectionNamespace = requestNamespace = null;
  };

  function websocketRequest(path, action, data, params, accept, namespace) {
    if (!stream) {
      return null;
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    if (namespace) {
      path = '/' + namespace + path;
    } else if (requestNamespace) {
      path = '/' + requestNamespace + path;
    } else if (connectionNamespace) {
      path = '/' + connectionNamespace + path;
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
      url: $this.apiHostPath() + path,
      headers: {
        'Content-Type': 'application/json',
        'Accept': responseAcceptTypes[accept]
      },
      data: data,
      params: params
    };

    $log.debug('http request sent: ' + JSON.stringify(config));

    return $http(config).then(function (message) {
      if (message.data) {
        notify(path, message);
      }
      return $q(function (resolve, reject) {
        if (message) {
          resolve(message);
        } else {
          reject();
        }
      });
    });
  }

  $rootScope.$on('/info', function (event, data) {
    // eslint camelcase: ["error", {properties: "never"}]
    if (data.content !== 'JSON') {
      return;
    }
    data = data.data;

    $this.info.message = data.message;
    $this.info.running_since = data.running_since;
    $this.info.version = data.version;
    $this.info.ui_version = Environment.prototype.version();

    if (!data.persistence || !data.pulse || !data.key_value) {
      return;
    }

    $this.info.persistence = data.persistence.database.type === 'key-value' ? data.key_value.type : data.persistence.database.type;
    $this.info.pulse = data.pulse.type;
    $this.info.key_value_store = data.key_value.type;

    if (!data.gateway_driver || !data.container_driver || !data.workflow_driver) {
      return;
    }

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
*/
