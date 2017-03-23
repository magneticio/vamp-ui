function actionMenuController($scope) {
  $scope.isOpen = false;

  $scope.close = function () {
    $scope.isOpen = false;
  };
}

actionMenuController.$inject = ['$scope'];
angular.module('vamp-ui').controller('actionMenuController', actionMenuController);
