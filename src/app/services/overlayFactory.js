function overlayService(uiStatesFactory, overlayFactory) {
  this.activeOverlay = null;
  this.isActive = false;

  this.display = function (error) {
    this.activeOverlay = overlayFactory.get(error);
    this.isActive = true;
    uiStatesFactory.setOverlayState(true);
  };

  this.hide = function () {
    this.activeOverlay = null;
    this.isActive = false;
    uiStatesFactory.setOverlayState(false);
  };
}

function overlayFactory() {
  function get(error) {
    switch (error) {
      case 'error.disconnected':
        return {
          type: 'Error',
          template: 'app/common/templates/errors/disconnected.html'
        };
      default :
        return {
          type: 'Error',
          template: 'app/common/templates/errors/general.html'
        };
    }
  }

  return {
    get: get
  };
}

overlayFactory.$inject = [];
angular.module('vamp-ui').factory('overlayFactory', overlayFactory);

overlayService.$inject = ['uiStatesFactory', 'overlayFactory'];
angular.module('vamp-ui').service('overlayService', overlayService);
