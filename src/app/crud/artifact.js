/* function baseArtifactController($scope, $vamp) {
    var vm = this;

    vm.peek = function () {
      if (this.kind) {
        var path = '/' + this.kind;
        $vamp.peek(path);
      }
    }
}

baseArtifactController.$inject = ['$scope', '$vamp'];
angular.module('app').controller('baseArtifactController', BaseGenericCtrl);*/

function ArtifactController($scope) {
  // angular.extend(this, $controller('baseArtifactController', {$scope: $scope}));
  var $ctrl = this;

  $ctrl.artifact = $scope.artifact;
  $ctrl.kind = $ctrl.artifact.kind;

  // $ctrl.peek();
}

ArtifactController.$inject = ['$scope'];
angular.module('app').controller('ArtifactController', ArtifactController);

angular.module('app')/* .controller('ArtifactController', function ($scope) {
  var $ctrl = this;

  $ctrl.artifact = $scope.artifact
  $ctrl.kind = $ctrl.artifact.kind;

})*/.factory('artifact', ['$vamp', function ($vamp) {
  return new ArtifactService($vamp);
}]);

function ArtifactService($vamp) {
  this.editor = {
    useWrapMode: false,
    showGutter: true,
    theme: 'vamp',
    mode: 'yaml',
    firstLineNumber: 1,
    onLoad: function (editor) {
      editor.focus();
      editor.$blockScrolling = 'Infinity';
    }
  };

  this.validate = _.throttle(function (path, data, validation) {
    if (validation && data && path) {
      $vamp.put(path, data, {validate_only: true}, 'JSON');
    }
  }, 500, {trailing: true, leading: false});

  this.transformErrorMessage = function (message) {
    var index = message.indexOf('Unexpected in DSL: ');
    if (index === 0) {
      var json = JSON.parse(message.substring('Unexpected in DSL: '.length));
      return 'Unexpected in DSL:\n' + JSON.stringify(json, null, 2);
    }
    return message.split('. ').join('.\n');
  };
}
