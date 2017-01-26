function uiStatesFactory() {
  var viewStates = {
    main: 'grid',
    sideBar: 'expanded',
    infoPanel: false,
    helpPanel: false,
    footer: 'collapsed'
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

  function setFooterViewState(type) {
    viewStates.footer = type;
  }

  return {
    viewStates: viewStates,
    setMainViewState: setMainViewState,
    setSideBarViewState: setSideBarViewState,
    setInfoPanelViewState: setInfoPanelViewState,
    setHelpPanelViewState: setHelpPanelViewState,
    setFooterViewState: setFooterViewState
  };
}

uiStatesFactory.$inject = [];

angular.module('app').factory('uiStatesFactory', uiStatesFactory);
