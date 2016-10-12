angular.module('app').component('artifact', {
  require: {
    artifacts: '^artifacts'
  },
  templateUrl: 'app/crud/artifact.html',
  bindings: {
    artifact: '<'
  },
  transclude: {
    body: '?div'
  },
  controller: function () {
    var $ctrl = this;

    this.hover = false;

    this.hoverIn = function () {
      $ctrl.hover = true;
    };

    this.hoverOut = function () {
      $ctrl.hover = false;
    };
  }
}).controller('ArtifactsController', function ($scope) {
  this.kind = $scope.$parent.$parent.$ctrl.kind;
  this.artifact = $scope.$parent.$parent.artifact;
}).factory('artifact', ['$vamp', function ($vamp) {
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
}
