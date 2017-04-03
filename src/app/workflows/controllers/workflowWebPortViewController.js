function workflowWebPortViewController($scope, uiStatesFactory, workflowWebPortService) {
  var $ctrl = this;
  $scope.ncyBreadcrumbIgnore = true;

  $ctrl.webport = workflowWebPortService.webport;
  $ctrl.viewStates = uiStatesFactory.viewStates;
  $ctrl.close = function () {
    uiStatesFactory.setRightPanelViewState(uiStatesFactory.STATE_ENUM.HIDDEN);
  };

  $scope.$on('$destroy', function () {
    uiStatesFactory.setRightPanelViewState(uiStatesFactory.STATE_ENUM.HIDDEN);
  });
}

workflowWebPortViewController.$inject = ['$scope', 'uiStatesFactory', 'workflowWebPortService'];
angular.module('vamp-ui').controller('workflowWebPortViewController', workflowWebPortViewController);
