angular.module('app').component('artifact', {
  require: {
    artifacts: '^artifacts'
  },
  templateUrl: 'app/crud/artifact.html',
  bindings: {
    artifact: '<'
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
});
