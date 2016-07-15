angular.module('app')
  .controller('ConfirmationController', function ($uibModalInstance, $scope, title, text, action, data, inputs, async) {
    //console.log($modalInstance);
    console.log('Data', inputs);

    $scope.title = title;
    $scope.text = text;
    $scope.inputs = inputs;
    $scope.clickAction = function() {

      return action($scope.data, $scope.inputs).then($scope.ok);
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
