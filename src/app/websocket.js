/* eslint camelcase: ["error", {properties: "never"}] */
'use strict';
angular.module('vamp-ui')
  .factory('$vampWebsocket', ['$vamp', '$websocket', '$timeout', '$log', function ($vamp, $websocket, $timeout, $log) {
    return new VampWebsocket($vamp, $websocket, $timeout, $log);
  }]);

function VampWebsocket($vamp, $websocket, $timeout, $log) {
  var stream;
  var transaction = 0;
  var connections = [];

  this.connected = function () {
    return Boolean(stream);
  };

  this.connect = function () {
    if (!$vamp.origin) {
      $vamp.init();
    }
    var baseUrl = $vamp.origin;

    if ($vamp.connectionNamespace) {
      baseUrl += $vamp.connectionNamespace + '/';
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
        $vamp.notify('$vamp:websocket', 'opened');
      });

      stream.onClose(function (forcedClose) {
        if (!connections) {
          return;
        }
        stream = null;
        if (!forcedClose) {
          var retryPeriod = 3; // seconds
          $log.debug('websocket closed, will try to reconnect in ' + retryPeriod + ' seconds...');
          $vamp.notify('$vamp:websocket', 'closed');
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
      stream = undefined;
    }
  };

  this.emit = function (path) {
    if (!stream) {
      return null;
    }
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    if ($vamp.requestNamespace) {
      path = '/' + $vamp.requestNamespace + path;
    } else if ($vamp.connectionNamespace) {
      path = '/' + $vamp.connectionNamespace + path;
    }
    var message = {
      api: 'v1',
      path: path,
      action: 'PEEK',
      accept: 'JSON',
      content: 'JSON',
      transaction: String(transaction++),
      data: '',
      parameters: {}
    };

    $log.debug('websocket send: ' + JSON.stringify(message));
    stream.send(message);
  };

  function process(message) {
    $log.debug('websocket message: ' + message);
    var response = JSON.parse(message);

    if (response.content === 'JSON' && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
      }
    }

    var path = response.path;

    if ($vamp.connectionNamespace && path.startsWith('/' + $vamp.connectionNamespace + '/')) {
      path = path.substring(('/' + $vamp.connectionNamespace).length);
    }

    if ($vamp.requestNamespace && path.startsWith('/' + $vamp.requestNamespace + '/')) {
      path = path.substring(('/' + $vamp.requestNamespace).length);
    }

    $vamp.notify(path, response);
  }
}
