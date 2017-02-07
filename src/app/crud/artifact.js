function ArtifactController($scope) {
  var $ctrl = this;

  $ctrl.artifact = $scope.artifact;
  $ctrl.kind = $ctrl.artifact.kind;
}

ArtifactController.$inject = ['$scope'];
angular.module('app').controller('ArtifactController', ArtifactController);

angular.module('app').factory('artifact', ['$vamp', function ($vamp) {
  return new ArtifactService($vamp);
}]);

function ArtifactService($vamp) {
  this.editor = {
    useWrapMode: true,
    showGutter: true,
    theme: 'vamp',
    mode: 'yaml',
    firstLineNumber: 1,
    useSoftTabs: true,
    advanced: {
      tabSize: 2,
      maxLines: Infinity
    },
    onLoad: function () {
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
