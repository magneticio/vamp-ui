/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
'use strict';

angular.module('app').factory('vamp', ['$log', '$rootScope', '$websocket', '$timeout', function ($log, $rootScope, $websocket, $timeout) {
  return new Vamp($log, $rootScope, $websocket, $timeout);
}]);

function Vamp($log, $rootScope, $websocket, $timeout) {
  var stream;
  var transaction = 0;

  var process = function (message) {
    $log.debug('websocket message: ' + message);
    var response = JSON.parse(message);
    $rootScope.$emit(response.path, JSON.parse(response.data));
  };

  this.peek = function (path, params) {
    if (!stream) {
      return;
    }

    stream.send({
      api: 'v1',
      path: path,
      action: 'PEEK',
      accept: 'JSON',
      content: 'JSON',
      transaction: String(transaction++),
      data: "",
      parameters: params ? params : {}
    });
  };

  this.init = function () {
    var websocket = function () {
      var url = 'ws://' + Environment.prototype.origin() + '/websocket';
      $log.debug('websocket: ' + url);

      stream = $websocket(url);

      stream.onOpen(function () {
        $log.debug('websocket is opened');
        $rootScope.$emit('vamp:connection', 'opened');
      });

      stream.onClose(function () {
        $log.info('websocket closed, will try to reconnect in 5 seconds...');
        $rootScope.$emit('vamp:connection', 'closed');
        stream = null;
        $timeout(websocket, 5000);
      });

      stream.onMessage(function (message) {
        process(message.data);
      });
    };

    websocket();
  };
}

angular.module('app').run(["vamp", function (vamp) {
  vamp.init();
}]);
