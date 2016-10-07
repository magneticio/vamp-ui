/* global Artifacts */
/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('app').component('menu', {
  templateUrl: 'app/menu/menu.html',
  controller: MenuController
});

function MenuController($rootScope, $interval, vamp) {
  var self = this;

  // menu

  this.artifacts = Artifacts.prototype.all();

  this.isActive = function (artifact) {
    return self.active ? self.active === artifact.kind : false;
  };

  $rootScope.$on('$stateChangeStart', stateChanged);

  function stateChanged(event, state) {
    self.active = state.name;
  }

  // info panel

  this.toggleSettings = function () {
    $rootScope.infoPanelActive = !$rootScope.infoPanelActive;
  };

  // jvm metrics

  var polling;

  this.connected = false;

  function info() {
    vamp.peek('/info', {on: 'jvm'});
  }

  $rootScope.$on('vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      info();
      if (!polling) {
        polling = $interval(info, 3600000);
      }
      self.connected = true;
    } else {
      self.connected = false;
      $interval.cancel(polling);
      polling = undefined;
    }
  });

  $rootScope.$on('/info', function (event, info) {
    self.jvm = {
      systemLoad: info.jvm['operating_system']['system_load_average'],
      heapCurrent: info.jvm.memory.heap.used / (1024 * 1024),
      heapMax: info.jvm.memory.heap.max / (1024 * 1024)
    };
  });
}
