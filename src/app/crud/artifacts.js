angular.module('app').directive('artifacts', function () {
  return {
    scope: {
      kind: '@'
    },
    restrict: 'E',
    controller: "@",
    name: "withController",
    controllerAs: '$artifacts',
    templateUrl: 'app/crud/artifacts.html'/* ,
    transclude: {
      gridItem: 'div'
    },
    replace: true*/
  };
});

BaseArtifactsController.$inject = ['$ctrl', '$scope', '$vamp', 'uiStatesFactory', '$state', '$stateParams',
  '$filter', '$location', 'toastr', 'alert'];

function BaseArtifactsController($ctrl, $scope, $vamp, uiStatesFactory,
  $state, $stateParams, $filter, $location, toastr, alert) {
  $ctrl.searchTerm = "";
  $ctrl.initialized = false;
  $ctrl.kind = $scope.kind;
  if (!$ctrl.path) {
    $ctrl.path = '/' + $ctrl.kind;
  }

  $ctrl.artifacts = [];
  $ctrl.peek = function () {
    $vamp.peek($ctrl.path);
  };

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      $ctrl.peek();
    }
  });

  $scope.$on($ctrl.path, function (e, response) {
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.artifacts);

    if ($ctrl.onDataResponse) {
      $ctrl.onDataResponse(response.data);
    }

    $ctrl.calcPagination();
    $ctrl.initialized = true;
  });

  $scope.$on('/events/stream', function (e, response) {
    if ($ctrl.onStreamEvent) {
      $ctrl.onStreamEvent(response);
    }

    if ((_.includes(response.data.tags, 'archive') ||
          _.includes(response.data.tags, 'deployed') ||
          _.includes(response.data.tags, 'undeployed')) && _.includes(response.data.tags, $ctrl.kind)) {
      $ctrl.peek();
    }
  });

  $ctrl.viewStates = uiStatesFactory.viewStates;
  $ctrl.toggleView = function (type) {
    uiStatesFactory.setMainViewState(type);
  };

  $ctrl.artifactData = $state.$current.data;

  $ctrl.itemsPerPage = 20;
  $ctrl.pages = 1;
  $ctrl.currentPage = parseInt($stateParams.page, 10);

  $ctrl.calcPagination = function () {
    var pageSum = Math.ceil($ctrl.artifacts.length / $ctrl.itemsPerPage);
    $ctrl.pages = pageSum === 0 ? 1 : pageSum;
  };

  $ctrl.nextPage = function () {
    if ($ctrl.currentPage < $ctrl.pages) {
      $state.go('.', {page: $ctrl.currentPage + 1});
    }
  };

  $ctrl.previousPage = function () {
    if ($ctrl.currentPage > 1) {
      $state.go('.', {page: $ctrl.currentPage - 1});
    }
  };

  $ctrl.goToPage = function (n) {
    $state.go('.', {page: n});
  };

  $ctrl.getPages = function (n) {
    return Array.apply(null, {length: n}).map(Number.call, Number);
  };

  $ctrl.getCurrentPageStartingIndex = function () {
    var index = $ctrl.currentPage - 2;

    if ($ctrl.pages <= 5 || $ctrl.currentPage < 2) {
      index = 0;
    } else if ($ctrl.currentPage >= $ctrl.pages - 2) {
      index = $ctrl.pages - 5;
    }

    return index;
  };

  // selections

  $ctrl.selected = [];

  $ctrl.toggleSelection = function () {
    var all = $ctrl.isSelectedAll();
    $ctrl.selected.length = 0;
    if (!all) {
      _.forEach($ctrl.artifacts, function (a) {
        $ctrl.selected.push(a);
      });
    }
  };

  $ctrl.isSelectedAll = function () {
    return $ctrl.artifacts.length > 0 && $ctrl.artifacts.length === $ctrl.selected.length;
  };

  $ctrl.isSelectedAny = function () {
    return $ctrl.selected.length > 0;
  };

  $ctrl.isSelected = function (artifact) {
    return _.find($ctrl.selected, function (a) {
      return a.name === artifact.name;
    });
  };

  $ctrl.updateSelection = function ($event, artifact) {
    $event.stopPropagation();
    _.remove($ctrl.selected, function (a) {
      return a.name === artifact.name;
    });
    if ($event.target.checked) {
      $ctrl.selected.push(artifact);
    }
  };

  // operations

  $ctrl.add = function () {
    $location.path($ctrl.kind + '/add');
  };

  $ctrl.view = function (artifact) {
    $location.path($ctrl.kind + '/view/' + $filter('encodeName')(artifact.name));
  };

  $ctrl.deleteSelected = function () {
    var names = _.map(_.sortBy($ctrl.selected, ['name']), function (a) {
      return a.name;
    });

    var bracketNames = _.map(names, function (name) {
      return '\'' + name + '\'';
    });

    if ($ctrl.isSelectedAny()) {
      alert.show('Warning', 'Are you sure you want to delete: ' + bracketNames.join(', ') + '?', 'Delete', 'Cancel', function () {
        $ctrl.selected.length = 0;

        _.forEach(names, function (name) {
          $vamp.await(function () {
            var artifact = _.find($ctrl.artifacts, function (artifact) {
              return artifact.name === name;
            });
            $vamp.remove($ctrl.path + '/' + name, angular.toJson(artifact));
          }).then(function () {
            toastr.success('\'' + name + '\' has been successfully deleted.');
          }).catch(function (response) {
            if (response) {
              toastr.error(response.data.message, 'Deletion of \'' + name + '\' failed.');
            } else {
              toastr.error('Server timeout.', 'Deletion of \'' + name + '\' failed.');
            }
          });
        });
      });
    }
  };

  $ctrl.peek();
}

ArtifactsController.$inject = ['$scope', '$controller'];
function ArtifactsController(
  $scope, $controller) {
  var $ctrl = this;
  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope});
}

angular.module('app').controller('BaseArtifactsController', BaseArtifactsController);
angular.module('app').controller('ArtifactsController', ArtifactsController);
