function deleteResourceModal($scope, $uibModalInstance, id, title, text, buttonText) {
  $scope.blueprintName = id;
  $scope.title = title;
  $scope.text = text;
  $scope.buttonText = buttonText ? buttonText : 'DELETE';

  console.log(id);
  console.log(title);
  console.log(text);
  console.log(buttonText);

  $scope.ok = function () {
    $uibModalInstance.close(id);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

angular
  .module('app')
  .controller('deleteResourceModal', deleteResourceModal);

