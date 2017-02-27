function revisionsController($scope, revisionsService, $stateParams, $vamp) {
  var $ctrl = this;

  $ctrl.kind = $stateParams.kind;
  $ctrl.name = $stateParams.name;
  $ctrl.revisions = revisionsService.revisions;
  $ctrl.activeRevision = revisionsService.activeRevision;

  $ctrl.toggleRevisiton = function (revision) {
    if (revision.id !== $ctrl.activeRevision.id) {
      revisionsService.selectRevision(revision.id);
    } else {
      revisionsService.clearSelected();
    }
  };

  $scope.$on('/events', function (e, response) {
    _.forEach(response.data, function (event) {
      if (event.type === 'archive' && _.includes(event.tags, $ctrl.kind + ':' + $ctrl.name) && (_.includes(event.tags, 'archive:update') || _.includes(event.tags, 'archive:create'))) {
        revisionsService.addRevision(event);
      }
    });
  });

  $scope.$on('$destroy', function() {
    revisionsService.clearRevisions();
  });
}

revisionsController.$inject = ['$scope', 'revisionsService', '$stateParams', '$vamp'];
angular.module('app').controller('revisionsController', revisionsController);
