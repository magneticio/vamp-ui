angular.module('app').component('header', {
  templateUrl: 'app/common/header.html',
  bindings: {
    title: '@',
    clazz: '@'
  },
  transclude: {
    controls: '?controls',
    message: '?message',
    buttons: '?buttons'
  },
  controller: function ($scope, $rootScope) {
    var $ctrl = this;

    $ctrl.toggleInfoPanel = function () {
      if ($rootScope.helpPanelActive) {
        $rootScope.infoPanelActive = true;
        $rootScope.helpPanelActive = false;
      } else {
        $rootScope.infoPanelActive = !$rootScope.infoPanelActive;
        if ($rootScope.infoPanelActive) {
          $rootScope.helpPanelActive = false;
        }
      }
    };

    // help panel

    $ctrl.toggleHelpPanel = function () {
      if ($rootScope.infoPanelActive) {
        $rootScope.helpPanelActive = true;
        $rootScope.infoPanelActive = false;
      } else {
        $rootScope.helpPanelActive = !$rootScope.helpPanelActive;
        if ($rootScope.helpPanelActive) {
          $rootScope.infoPanelActive = false;
        }
      }
    };
  }
});
