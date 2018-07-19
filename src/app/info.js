/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
'use strict';
angular.module('vamp-ui')
  .factory('$vampInfo', [function () {
    return new VampInfo();
  }]);

function VampInfo() {
  var $this = this;
  $this.info = {};

  this.updateInfo = function (info) {
    $this.info.message = info.message;
    $this.info.running_since = info.running_since;
    $this.info.version = info.version;
    $this.info.ui_version = Environment.prototype.version();

    if (info.token_expires >= 0) {
      var today = new Date();
      var expiryDate = new Date($this.info.token_expires * 1000);
      var miliseconds = expiryDate.getTime() - today.getTime();
      $this.info.days_till_evaluation_expires = info.token_expires === 0 ? 0 : Math.ceil(miliseconds / (1000 * 60 * 60 * 24));
      $this.info.token_expires = info.token_expires;
      console.log($this.info);
    }

    if (!info.persistence || !info.pulse || !info.key_value) {
      return $this.info;
    }

    $this.info.persistence = info.persistence.database.type === 'key-value' ? info.key_value.type : info.persistence.database.type;
    $this.info.pulse = info.pulse.type;
    $this.info.key_value_store = info.key_value.type;

    if (!info.gateway_driver || !info.container_driver || !info.workflow_driver) {
      return $this.info;
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
