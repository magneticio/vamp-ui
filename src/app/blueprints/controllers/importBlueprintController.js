function importBlueprintControler($scope, $uibModalInstance, $vamp) {
  $scope.file = null;
  $scope.fileContent = null;
  $scope.validationError = false;
  var composePath = '/docker-compose';

  $scope.ok = function () {
    var filename = $scope.file.name.substring(0, $scope.file.name.lastIndexOf('.'));
    $vamp.post(composePath, $scope.fileContent, {validate_only: true, name: encodeURIComponent(filename)}, 'YAML')
      .then(
        function (response) {
          $scope.validationError = false;
          $uibModalInstance.close({blueprint: response.data});
        },
        function () {
          $scope.validationError = true;
        });
  };

  $scope.fileSelected = function () {
    if ($scope.file) {
      var reader = new FileReader();

      reader.onload = function (evt) {
        $scope.fileContent = evt.target.result;
        $scope.validationError = false;
      };
      reader.readAsBinaryString($scope.file);
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

importBlueprintControler.$inject = ['$scope', '$uibModalInstance', '$vamp'];
angular.module('vamp-ui').controller('importBlueprintControler', importBlueprintControler);

angular.module('vamp-ui').directive('fileChange', fileChange);

function fileChange() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      fileChange: '&'
    },
    link: function link(scope, element, attrs, ctrl) {
      element.on('change', onChange);

      scope.$on('destroy', function () {
        element.off('change', onChange);
      });

      function onChange() {
        if (attrs.multiple) {
          ctrl.$setViewValue(element[0].files);
        } else {
          ctrl.$setViewValue(element[0].files[0]);
        }

        scope.$apply(function () {
          scope.fileChange();
        });
      }
    }
  };
}
