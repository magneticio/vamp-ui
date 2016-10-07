/* global Environment */
angular.module('app').component('info', {
  templateUrl: 'app/info/info.html',
  controller: InfoController
});

function InfoController($rootScope, $scope, vamp) {
  $rootScope.$on('vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      vamp.peek('/info');
    }
  });

  $rootScope.$watch('infoPanelActive', function (newValue) {
    $scope.infoPanelActive = newValue;
  });

  $rootScope.$on('/info', function (event, data) {
    /* eslint camelcase: ["error", {properties: "never"}] */
    data = data.data;
    if (!data.persistence || !data.key_value || !data.gateway_driver || !data.container_driver || !data.workflow_driver) {
      return;
    }

    var info = {};
    info.message = data.message;
    info.running_since = data.running_since;
    info.version = data.version;
    info.ui_version = Environment.prototype.version();
    info.persistence = data.persistence.database.type;
    info.key_value_store = data.key_value.type;
    info.gateway_driver = 'haproxy ' + data.gateway_driver.marshaller.haproxy;
    info.container_driver = data.container_driver.type;
    info.workflow_driver = '';

    for (var name in data.workflow_driver) {
      if (name && data.workflow_driver.hasOwnProperty(name)) {
        info.workflow_driver += info.workflow_driver === '' ? name : ', ' + name;
      }
    }

    $scope.info = info;
  });
}
