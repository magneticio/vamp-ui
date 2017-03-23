function uiStatesFactory() {
  var viewStates = {
    main: 'grid',
    left: true,
    right: false,
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
