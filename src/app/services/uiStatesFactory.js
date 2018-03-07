/* global Ui */
function UiStatesFactory($rootScope) {
  var STATE_ENUM = {
    EXPANDED: 1,
    COLLAPSED: 2,
    HIDDEN: 3
  };

  var viewStates = {
    main: Ui.config.view,
    left: STATE_ENUM.EXPANDED,
    right: STATE_ENUM.HIDDEN,
    infoPanel: false,
    helpPanel: false,
    configPanel: false,
    proxyPanel: '',
    footer: false,
    overlay: false
  };

  function setMainViewState(type) {
    viewStates.main = type;
    Ui.save({view: type}, $rootScope);
  }

  function setLeftPanelViewState(type) {
    viewStates.left = type;
  }

  function setRightPanelViewState(type) {
    viewStates.right = type;
  }

  function setInfoPanelViewState(type) {
    viewStates.infoPanel = type;
  }

  function setHelpPanelViewState(type) {
    viewStates.helpPanel = type;
  }

  function setConfigPanelViewState(type) {
    viewStates.configPanel = type;
  }

  function setProxyPanelViewState(type) {
    viewStates.proxyPanel = type;
  }

  function setFooterViewState(type) {
    viewStates.footer = type;
  }

  function setOverlayState(state) {
    viewStates.overlay = state;
  }

  return {
    STATE_ENUM: STATE_ENUM,
    viewStates: viewStates,
    setMainViewState: setMainViewState,
    setLeftPanelViewState: setLeftPanelViewState,
    setRightPanelViewState: setRightPanelViewState,
    setInfoPanelViewState: setInfoPanelViewState,
    setHelpPanelViewState: setHelpPanelViewState,
    setConfigPanelViewState: setConfigPanelViewState,
    setProxyPanelViewState: setProxyPanelViewState,
    setFooterViewState: setFooterViewState,
    setOverlayState: setOverlayState
  };
}

UiStatesFactory.$inject = [];

angular.module('vamp-ui').factory('uiStatesFactory', ['$rootScope', function ($rootScope) {
  return new UiStatesFactory($rootScope);
}]);
