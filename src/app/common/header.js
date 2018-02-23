angular.module('vamp-ui').component('header', {
  templateUrl: 'app/common/header.html',
  controller: function ($scope, $rootScope, uiStatesFactory) {
    var $ctrl = this;

    $ctrl.uiStates = uiStatesFactory.viewStates;

    $ctrl.toggleInfoPanel = function () {
      if ($ctrl.uiStates.helpPanel || $ctrl.uiStates.configPanel) {
        uiStatesFactory.setHelpPanelViewState(false);
        uiStatesFactory.setConfigPanelViewState(false);
        uiStatesFactory.setProxyPanelViewState('');
        uiStatesFactory.setInfoPanelViewState(true);
      } else {
        uiStatesFactory.setInfoPanelViewState(!$ctrl.uiStates.infoPanel);
        if ($ctrl.uiStates.infoPanel) {
          uiStatesFactory.setHelpPanelViewState(false);
          uiStatesFactory.setConfigPanelViewState(false);
          uiStatesFactory.setProxyPanelViewState('');
        }
      }
    };

    // help panel

    $ctrl.toggleHelpPanel = function () {
      if ($ctrl.uiStates.infoPanel || $ctrl.uiStates.configPanel) {
        uiStatesFactory.setInfoPanelViewState(false);
        uiStatesFactory.setConfigPanelViewState(false);
        uiStatesFactory.setProxyPanelViewState('');
        uiStatesFactory.setHelpPanelViewState(true);
      } else {
        uiStatesFactory.setHelpPanelViewState(!$ctrl.uiStates.helpPanel);
        if ($ctrl.uiStates.helpPanel) {
          uiStatesFactory.setInfoPanelViewState(false);
          uiStatesFactory.setConfigPanelViewState(false);
          uiStatesFactory.setProxyPanelViewState('');
        }
      }
    };

    // config panel

    $ctrl.toggleConfigPanel = function () {
      if ($ctrl.uiStates.infoPanel || $ctrl.uiStates.helpPanel) {
        uiStatesFactory.setInfoPanelViewState(false);
        uiStatesFactory.setConfigPanelViewState(true);
        uiStatesFactory.setProxyPanelViewState('');
        uiStatesFactory.setHelpPanelViewState(false);
      } else {
        uiStatesFactory.setConfigPanelViewState(!$ctrl.uiStates.configPanel);
        if ($ctrl.uiStates.configPanel) {
          uiStatesFactory.setInfoPanelViewState(false);
          uiStatesFactory.setHelpPanelViewState(false);
          uiStatesFactory.setProxyPanelViewState('');
        }
      }
    };
  }
});
