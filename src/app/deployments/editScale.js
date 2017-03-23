angular.module('vamp-ui').component('editScale', {
  restrict: 'E',
  templateUrl: 'app/deployments/editScale.html',
  controller: EditScale,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});

/** @ngInject */
function EditScale($scope) {
  var $ctrl = this;

  this.note = '';
  this.service = this.resolve.service;
  this.cluster = this.resolve.cluster;
  this.deployment = this.resolve.deployment;

  this.scale = angular.copy(this.service.scale);
  this.scale.memory = parseInt(this.scale.memory, 10) + ' MB';

  this.save = function () {
    $ctrl.close({$value: $ctrl.scale});
  };

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;
    if ($ctrl.scale && _.includes(event.tags, 'deployments:' + $ctrl.deployment.name) && _.includes(event.tags, 'clusters:' + $ctrl.cluster.name) && _.includes(event.tags, 'services:' + $ctrl.service.breed.name)) {
      if (_.includes(event.tags, 'synchronization:deployed')) {
        $ctrl.note = 'scale has been changed in background.';
      } else if (_.includes(event.tags, 'synchronization:undeployed')) {
        $ctrl.dismiss();
      }
    }
  });
}
