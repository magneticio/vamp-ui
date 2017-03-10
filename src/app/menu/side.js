/* global Help */
angular.module('app').component('side', {
  templateUrl: 'app/menu/side.html',
  controller: SideController
});

function SideController($sce, $scope, $rootScope, $location, $vamp, uiStatesFactory) {
  var $ctrl = this;
  $scope.info = $vamp.info;
  $scope.help = {
    title: '',
    description: '',
    links: []
  };

  $ctrl.pin = false;
  $ctrl.uiStates = uiStatesFactory.viewStates;

  $ctrl.trust = function (src) {
    return $sce.trustAsResourceUrl(src);
  };

  $ctrl.closePanel = function () {
    uiStatesFactory.setInfoPanelViewState(false);
    uiStatesFactory.setHelpPanelViewState(false);
    uiStatesFactory.setProxyPanelViewState('');
  };

  $rootScope.$on('$stateChangeSuccess',
    function () {
      var path = $location.url().substring(1);
      var last = path.indexOf('/');
      if (last !== -1) {
        path = path.substring(0, last);
      }

      // handling qs params
      var qs = path.indexOf('?');
      if (qs !== -1) {
        path = path.substring(0, qs);
      }

      if (Help.prototype.entries()[path]) {
        $scope.help.title = path;
        $scope.help.description = Help.prototype.entries()[path].description;
        $scope.help.links = Help.prototype.entries()[path].links;
      } else {
        $scope.help.title = 'help';
        $scope.help.description = Help.prototype.entries().default.description;
        $scope.help.links = Help.prototype.entries().default.links;
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
}
