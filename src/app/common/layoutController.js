angular.module('app')
  .controller('layoutController', function ($scope, uiStatesFactory) {
    var $layout = this;

    $layout.uiStates = uiStatesFactory.viewStates;
    $layout.statesControl = uiStatesFactory;
  });
