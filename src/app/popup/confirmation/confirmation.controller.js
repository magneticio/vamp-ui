angular.module('app')
  .controller('ConfirmationController', function ($uibModalInstance, $scope, title, text, action) {
    //console.log($modalInstance);
    console.log('Title', title);

    $scope.title = title;
    $scope.text = text;
    $scope.action = action;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
