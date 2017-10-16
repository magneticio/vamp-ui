/* global Help */
angular.module('vamp-ui').component('side', {
  templateUrl: 'app/menu/side.html',
  controller: SideController
});

function SideController($sce, $scope, $rootScope, $vamp, uiStatesFactory, $state) {
  var $ctrl = this;
  $scope.info = $vamp.info;
  $scope.help = {
    title: '',
    description: '',
    links: []
  };

  if($rootScope.session) {
    $scope.role = $rootScope.session.user.role;
  }

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
    function (event, toState, toParams) {
      var isAdminState = $state.includes('admin');
      var path;

      if (isAdminState) {
        path = toState.name.substring(toState.name.lastIndexOf('.') + 1);
      } else {
        path = toParams.kind;
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

  $scope.$on('/info', function () {
    $scope.info = $vamp.info;
  });

  var path = ($state.params && $state.params.kind) || '';

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
