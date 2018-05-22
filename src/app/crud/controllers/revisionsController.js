function revisionsController($scope, revisionsService, $stateParams, $vamp, typeConfig) {
  var $ctrl = this;

  $scope.ncyBreadcrumbIgnore = true;

  $ctrl.kind = typeConfig.type;
  $ctrl.name = $stateParams.name;
  $ctrl.revisions = revisionsService.revisions;
  $ctrl.activeRevision = revisionsService.activeRevision;

  function checkEventForData(event) {
    if (event.type === 'archive' && _.includes(event.tags, $ctrl.kind + ':' + $ctrl.name) && (_.includes(event.tags, 'archive:update') || _.includes(event.tags, 'archive:create'))) {
      revisionsService.addRevision(event);
    }
  }

  $ctrl.toggleRevisiton = function (revision) {
    if (revision.id === $ctrl.activeRevision.id) {
      revisionsService.clearSelected();
    } else {
      revisionsService.selectRevision(revision.id);
    }
  };

  $scope.$on('/events', function (e, response) {
    _.forEach(response.data, checkEventForData);
  });

  $scope.$on('/events/stream', function (e, response) {
    var event = response.data;

    checkEventForData(event);
  });

  $scope.$on('$destroy', function () {
    revisionsService.clearRevisions();
  });

  $ctrl.peek = function () {
    $vamp.emit('/events', {
      tag: [
        'archive', $ctrl.kind + ':' + $ctrl.name
      ],
      type: 'archive'
    });
  };

  $ctrl.peek();
}

revisionsController.$inject = ['$scope', 'revisionsService', '$stateParams', '$vamp', 'typeConfig'];
angular.module('vamp-ui').controller('revisionsController', revisionsController);
