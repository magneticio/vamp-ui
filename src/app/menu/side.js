/* global Help, Ui */
angular.module('vamp-ui').component('side', {
  templateUrl: 'app/menu/templates/side.html',
  controller: SideController
});

function SideController($sce, $scope, $rootScope, $vamp, uiStatesFactory, $state, toastr) {
  var $ctrl = this;
  $scope.info = $vamp.info;
  $scope.help = {
    title: '',
    description: '',
    links: []
  };

  if ($rootScope.session) {
    $scope.role = $rootScope.session.user.role;
  }

  $ctrl.pin = false;
  $ctrl.uiStates = uiStatesFactory.viewStates;

  $ctrl.config = Ui.config;

  $ctrl.trust = function (src) {
    return $sce.trustAsResourceUrl(src);
  };

  $ctrl.closePanel = function () {
    uiStatesFactory.setInfoPanelViewState(false);
    uiStatesFactory.setHelpPanelViewState(false);
    uiStatesFactory.setConfigPanelViewState(false);
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

  $ctrl.saveConfig = function () {
    if (Ui.save()) {
      toastr.success('Configuration has been saved!');
    } else {
      toastr.error('Configuration cannot be saved!');
    }
  };
}
