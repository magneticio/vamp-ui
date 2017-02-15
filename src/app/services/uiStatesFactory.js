function uiStatesFactory() {
  var viewStates = {
    main: 'grid',
    sideBar: 'expanded',
    infoPanel: false,
    helpPanel: false,
    proxyPanel: '',
    footer: 'collapsed',
    overlay: false
  };

  function setMainViewState(type) {
    viewStates.main = type;
  }

  function setSideBarViewState(type) {
    viewStates.sideBar = type;
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
    setSideBarViewState: setSideBarViewState,
    setInfoPanelViewState: setInfoPanelViewState,
    setHelpPanelViewState: setHelpPanelViewState,
    setProxyPanelViewState: setProxyPanelViewState,
    setFooterViewState: setFooterViewState,
    setOverlayState: setOverlayState
  };
}

uiStatesFactory.$inject = [];

angular.module('app').factory('uiStatesFactory', uiStatesFactory);
