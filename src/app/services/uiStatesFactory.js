function uiStatesFactory() {
  var viewStates = {
    main: 'grid'
  };

  function setMainViewState(type) {
    viewStates.main = type;
  }

  return {
    viewStates: viewStates,
    setMainViewState: setMainViewState
  };
}

uiStatesFactory.$inject = [];

angular.module('app').factory('uiStatesFactory', uiStatesFactory);
