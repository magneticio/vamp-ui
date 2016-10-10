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
});
