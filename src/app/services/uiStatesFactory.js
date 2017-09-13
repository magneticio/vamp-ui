function uiStatesFactory() {
  var STATE_ENUM = {
    EXPANDED: 1,
    COLLAPSED: 2,
    HIDDEN: 3
  };

  var viewStates = {
    main: 'grid',
    left: STATE_ENUM.EXPANDED,
    right: STATE_ENUM.HIDDEN,
    infoPanel: false,
    helpPanel: false,
    proxyPanel: '',
    footer: false,
    overlay: false
  };

  function setMainViewState(type) {
    viewStates.main = type;
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
    setProxyPanelViewState: setProxyPanelViewState,
    setFooterViewState: setFooterViewState,
    setOverlayState: setOverlayState
  };
}

uiStatesFactory.$inject = [];

angular.module('vamp-ui').factory('uiStatesFactory', uiStatesFactory);
