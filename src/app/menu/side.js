/* global Help, Ui, Environment */
angular.module('vamp-ui').component('side', {
  templateUrl: 'app/menu/templates/side.html',
  controller: SideController
});

function SideController($sce, $scope, $rootScope, $vamp, $vampInfo, uiStatesFactory, $state, toastr, toastrConfig) {
  var $ctrl = this;
  $scope.info = $vampInfo.info;
  $scope.help = {
    title: '',
    description: '',
    links: []
  };

  if ($rootScope.session && $rootScope.session.user) {
    $scope.role = $rootScope.session.user.role;
  }

  $ctrl.pin = false;
  $ctrl.uiStates = uiStatesFactory.viewStates;

  $ctrl.config = angular.copy(Ui.config);
  $ctrl.defaultConfig = Ui.defaultConfig;
  $ctrl.evaluation = Environment.prototype.evaluation();

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
      $ctrl.config = angular.copy(Ui.config);
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

  $scope.$on('/info', function (event, response) {
    $scope.info = $vampInfo.updateInfo(response.data);
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
    if (Ui.save($ctrl.config, $rootScope)) {
      $rootScope.$broadcast('/vamp/settings/update');
      angular.extend(toastrConfig, {
        autoDismiss: true,
        timeOut: 1000 * Ui.config.toastTimeout,
        extendedTimeOut: 0,
        allowHtml: false,
        closeButton: true,
        tapToDismiss: true,
        positionClass: 'toast-top-right',
        preventOpenDuplicates: true
      });
      toastr.success('Configuration has been saved!');
    } else {
      toastr.error('Configuration cannot be saved!');
    }
    $ctrl.config = angular.copy(Ui.config);
  };

  $vamp.emit('/info');
}
