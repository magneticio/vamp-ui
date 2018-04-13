/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
'use strict';
angular.module('vamp-ui')
  .factory('$info', ['$http', '$log', '$rootScope', function ($http, $log, $rootScope) {
    return new VampInfo($http, $log, $rootScope);
  }]);

function VampInfo($http, $log, $rootScope) {
  var $this = this;
  $this.info = {};

  this.updateInfo = function (info) {
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
