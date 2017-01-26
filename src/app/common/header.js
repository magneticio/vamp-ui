angular.module('app').component('header', {
  templateUrl: 'app/common/header.html',
  bindings: {
    title: '@',
    clazz: '@'
  },
  transclude: {
    main: '?main',
    controls: '?controls',
    buttons: '?buttons'
  },
  controller: function ($scope, $rootScope, uiStatesFactory) {
    var $ctrl = this;

    $ctrl.uiStates = uiStatesFactory.viewStates;

    $ctrl.toggleInfoPanel = function () {
      if ($ctrl.uiStates.helpPanel) {
        uiStatesFactory.setHelpPanelViewState(false);
        uiStatesFactory.setInfoPanelViewState(true);
      } else {
        uiStatesFactory.setInfoPanelViewState(!$ctrl.uiStates.infoPanel);
        if ($ctrl.uiStates.infoPanel) {
          uiStatesFactory.setHelpPanelViewState(false);
        }
      }
    };

    // help panel

    $ctrl.toggleHelpPanel = function () {
      if ($ctrl.uiStates.infoPanel) {
        uiStatesFactory.setInfoPanelViewState(false);
        uiStatesFactory.setHelpPanelViewState(true);
      } else {
        uiStatesFactory.setHelpPanelViewState(!$ctrl.uiStates.helpPanel);
        if ($ctrl.uiStates.helpPanel) {
          uiStatesFactory.setInfoPanelViewState(false);
        }
      }
    };
  }
});
