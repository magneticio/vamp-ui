/* global Environment */
angular.module('app').component('info', {
  templateUrl: 'app/info/info.html',
  controller: InfoController
});

function InfoController($rootScope, $scope, $vamp) {
  $scope.info = {};

  if ($vamp.connected()) {
    $vamp.peek('/info');
  }

  $scope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      $vamp.peek('/info');
    }
  });

  $rootScope.$watch('infoPanelActive', function (newValue) {
    $scope.infoPanelActive = newValue;
    if (!$scope.info.message) {
      $vamp.peek('/info');
    }
  });

  $scope.$on('/info', function (event, data) {
    /* eslint camelcase: ["error", {properties: "never"}] */
    data = data.data;
    if (!data.persistence || !data.key_value || !data.gateway_driver || !data.container_driver || !data.workflow_driver) {
      return;
    }

    $scope.info.message = data.message;
    $scope.info.running_since = data.running_since;
    $scope.info.version = data.version;
    $scope.info.ui_version = Environment.prototype.version();
    $scope.info.persistence = data.persistence.database.type === 'key-value' ? data.key_value.type : data.persistence.database.type;
    $scope.info.key_value_store = data.key_value.type;
    $scope.info.gateway_driver = 'haproxy ' + data.gateway_driver.marshaller.haproxy;
    $scope.info.container_driver = data.container_driver.type;
    $scope.info.workflow_driver = '';

    for (var name in data.workflow_driver) {
      if (name && data.workflow_driver.hasOwnProperty(name)) {
        $scope.info.workflow_driver += $scope.info.workflow_driver === '' ? name : ', ' + name;
      }
    }
  });
}
