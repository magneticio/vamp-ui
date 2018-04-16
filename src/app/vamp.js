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

  var throttle = {};

  var acceptTypes = {
    JSON: 'application/json',
    YAML: 'application/x-yaml'
  };

  $this.requestNamespace = null;
  $this.connectionNamespace = null;

  this.namespacePath = function () {
    var namespace = $this.requestNamespace || $this.connectionNamespace;
    return namespace ? namespace + '/' : '';
  };

  this.setRequestNamespace = function (namespace) {
    var changed = $this.requestNamespace !== namespace;
    $this.requestNamespace = namespace;
    if (changed) {
      $this.notify('$vamp:namespace', 'changed');
    }
  };

  this.setConnectionNamespace = function (namespace) {
    var changed = $this.connectionNamespace !== namespace;
    $this.connectionNamespace = namespace;
    if (changed) {
      $this.notify('$vamp:namespace', 'changed');
    }
  };

  this.init = function () {
    if ($this.origin) {
      return;
    }
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

  this.emit = function (path, params, error) {
    return $this.get(path, params)
      .then(function (response) {
        $this.notify(path.indexOf('/') === 0 ? path : '/' + path, response);
      })
      .catch(function (response) {
        if (error) {
          error(response);
        }
      });
  };

  this.post = function (path, data, params, accept) {
    return $this.request('POST', path, data, params, accept);
  };

  this.put = function (path, data, params, accept) {
    return $this.request('PUT', path, data, params, accept);
  };

  this.delete = function (path, data, params, accept) {
    return $this.request('DELETE', path, data, params, accept);
  };

  this.validate = function (path, data) {
    if (path.split('/').length > 2) {
      return $this.put(path, data, {validate_only: true}, 'JSON');
    }
    return $this.post(path, data, {validate_only: true}, 'JSON');
  };

  this.apiHostPath = function () {
    return window.location.protocol + '//' + $this.origin + $this.namespacePath() + 'api/v1';
  };

  this.request = function (method, path, data, params, accept) {
    var options = {
      method: method,
      url: $this.apiHostPath() + (path.indexOf('/') === 0 ? path : '/' + path),
      headers: {
        'Content-Type': 'application/json',
        'Accept': acceptTypes[accept || 'JSON'] || acceptTypes.JSON
      },
      data: data,
      params: params || {}
    };

    if (method === 'GET') {
      var key = JSON.stringify(options);
      throttle[key] = throttle[key] || _.throttle(function () {
        return $http(options);
      }, 1000, {
        leading: true,
        trailing: false
      });
      return throttle[key]();
    }

    return $http(options);
  };

  this.notify = function (name, value) {
    $log.debug('notify: ' + name + ' :: ' + JSON.stringify(value));
    $rootScope.$broadcast(name, value);
  };
}
