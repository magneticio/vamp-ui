function uiStatesFactory() {
  var viewStates = {
    main: 'grid',
    sideBar: 'expanded',
    footer: 'collapsed'
  };

  function setMainViewState(type) {
    viewStates.main = type;
  }

  function setSideBarViewState(type) {
    viewStates.sideBar = type;
  }

  function setFooterViewState(type) {
    viewStates.footer = type;
  }

  return {
    viewStates: viewStates,
    setMainViewState: setMainViewState,
    setSideBarViewState: setSideBarViewState,
    setFooterViewState: setFooterViewState
  };
}

uiStatesFactory.$inject = [];

angular.module('app').factory('uiStatesFactory', uiStatesFactory);
