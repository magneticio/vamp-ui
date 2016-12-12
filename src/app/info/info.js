/* global Environment,Help */
angular.module('app').component('info', {
  templateUrl: 'app/info/info.html',
  controller: InfoController
});

function InfoController($rootScope, $scope, $vamp) {
  var $ctrl = this;
  $scope.info = {};
  $scope.helpDescription = '';
  $scope.helpLinks = [];

  var showI = false;
  var showH = false;

  $ctrl.showInfo = function () {
    return showI;
  };

  $ctrl.showHelp = function () {
    return showH;
  };

  this.closePanel = function () {
    $rootScope.infoPanelActive = false;
    $rootScope.helpPanelActive = false;
  };

  $rootScope.$on('$stateChangeStart',
    function (event, toState) {
      var path = toState.url.substring(1);
      var last = path.indexOf('/');
      if (last !== -1) {
        path = path.substring(0, last);
      }

      if (Help.prototype.entries()[path]) {
        $scope.helpDescription = Help.prototype.entries()[path].description;
        $scope.helpLinks = Help.prototype.entries()[path].links;
      } else {
        $scope.helpDescription = Help.prototype.entries().default.description;
        $scope.helpLinks = Help.prototype.entries().default.links;
      }
    }
  );

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
    if ($scope.infoPanelActive) {
      showI = true;
      showH = false;
    }
    if (!$scope.info.message) {
      $vamp.peek('/info');
    }
  });

  $rootScope.$watch('helpPanelActive', function (newValue) {
    $scope.helpPanelActive = newValue;
    if ($scope.helpPanelActive) {
      showH = true;
      showI = false;
    }
  });

  $scope.$on('/info', function (event, data) {
    /* eslint camelcase: ["error", {properties: "never"}] */
    data = data.data;
    if (!data.persistence || !data.pulse || !data.key_value || !data.gateway_driver || !data.container_driver || !data.workflow_driver) {
      return;
    }

    $scope.info.message = data.message;
    $scope.info.running_since = data.running_since;
    $scope.info.version = data.version;
    $scope.info.ui_version = Environment.prototype.version();
    $scope.info.persistence = data.persistence.database.type === 'key-value' ? data.key_value.type : data.persistence.database.type;
    $scope.info.pulse = data.pulse.type;
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
