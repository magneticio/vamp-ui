angular.module('app')
  .controller('ConfirmationController', function ($uibModalInstance, $scope, title, text, action, data, async) {
    //console.log($modalInstance);
    console.log('Data', data);

    $scope.title = title;
    $scope.text = text;
    $scope.clickAction = function() {
      return action($scope.data).then($scope.ok);
    }
    $scope.data = data;
    $scope.async = async;

    $scope.ok = function () {
      $uibModalInstance.close($scope.data);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
