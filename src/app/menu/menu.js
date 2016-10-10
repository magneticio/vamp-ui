/* global Artifacts */
/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('app').component('menu', {
  templateUrl: 'app/menu/menu.html',
  controller: MenuController
});

function MenuController($rootScope, $scope, $interval, $vamp) {
  var $ctrl = this;

  // menu

  this.artifacts = Artifacts.prototype.all();

  this.isActive = function (artifact) {
    return $ctrl.active ? $ctrl.active.startsWith(artifact.kind) : false;
  };

  $scope.$on('$stateChangeSuccess', function (event, state) {
    $ctrl.active = state.name;
  });

  // info panel

  this.toggleInfoPanel = function () {
    $rootScope.infoPanelActive = !$rootScope.infoPanelActive;
  };

  // jvm metrics

  var polling;

  this.connected = false;

  function info() {
    $vamp.peek('/info', '', {on: 'jvm'});
  }

  function start() {
    info();
    if (!polling) {
      polling = $interval(info, 15000);
    }
    $ctrl.connected = true;
  }

  function stop() {
    $ctrl.connected = false;
    $interval.cancel(polling);
    polling = undefined;
  }

  if ($vamp.connected()) {
    start();
  }

  $scope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      start();
    } else {
      stop();
    }
  });

  $scope.$on('/info', function (event, data) {
    var info = data.data;
    $ctrl.jvm = {
      systemLoad: info.jvm['operating_system']['system_load_average'],
      heapCurrent: info.jvm.memory.heap.used / (1024 * 1024),
      heapMax: info.jvm.memory.heap.max / (1024 * 1024)
    };
  });
}
