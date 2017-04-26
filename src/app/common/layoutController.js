angular.module('vamp-ui')
  .controller('layoutController', function ($scope, uiStatesFactory) {
    var $layout = this;

    $layout.uiStates = uiStatesFactory.viewStates;
    $layout.stateEnum = uiStatesFactory.STATE_ENUM;
  });
