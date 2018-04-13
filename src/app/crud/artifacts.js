BaseArtifactsController.$inject = ['$ctrl', '$scope', 'artifactsMetadata', '$vamp', 'uiStatesFactory', '$state', '$stateParams',
  '$filter', 'filterFilter', 'toastr', 'alert'];

function BaseArtifactsController($ctrl, $scope, artifactsMetadata, $vamp, uiStatesFactory,
                                 $state, $stateParams, $filter, filterFilter, toastr, alert) {
  $ctrl.searchTerm = $stateParams.searchTerm;
  $ctrl.initialized = false;
  $ctrl.kind = $stateParams.kind;
  if (!$ctrl.path) {
    $ctrl.path = '/' + $ctrl.kind;
  }

  $ctrl.artifactsMetadata = artifactsMetadata;
  $ctrl.artifacts = [];
  $ctrl.filteredArtifacts = filterFilter($ctrl.artifacts, {name: $ctrl.searchTerm});

  $ctrl.peek = function () {
    $vamp.emit($ctrl.path);
  };

  $ctrl.onSearchTermChange = function () {
    $stateParams.searchTerm = $ctrl.searchTerm;
    $ctrl.filteredArtifacts = filterFilter($ctrl.artifacts, {name: $ctrl.searchTerm});
    $ctrl.calcPagination();
  };

  $scope.$on($ctrl.path, function (e, response) {
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.artifacts);
    $ctrl.filteredArtifacts = filterFilter($ctrl.artifacts, {name: $ctrl.searchTerm});

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

  $ctrl.itemsPerPage = 20;
  $ctrl.pages = 1;
  $ctrl.currentPage = parseInt($stateParams.page, 10);

  $ctrl.calcPagination = function () {
    var pageSum = Math.ceil($ctrl.filteredArtifacts.length / $ctrl.itemsPerPage);
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
      _.forEach($ctrl.filteredArtifacts, function (a) {
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

    if ($ctrl.isSelected(artifact)) {
      _.remove($ctrl.selected, function (a) {
        return a.name === artifact.name;
      });

      $($event.target).find('input[type=checkbox]').prop('checked', false);
    } else {
      $ctrl.selected.push(artifact);
      $($event.target).find('input[type=checkbox]').prop('checked', true);
    }
  };

  // operations

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.view = function (artifact) {
    $state.go('.one', {name: artifact.name});
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
          var artifact = _.find($ctrl.artifacts, function (artifact) {
            return artifact.name === name;
          });
          $vamp.delete($ctrl.path + '/' + name, angular.toJson(artifact))
            .then(function () {
              toastr.success('\'' + name + '\' has been successfully deleted.');
              $ctrl.peek();
            })
            .catch(function (response) {
              if (response) {
                toastr.error(response.data.message, 'Deletion of \'' + name + '\' failed.');
              } else {
                toastr.error('Server timeout.', 'Deletion of \'' + name + '\' failed.');
              }
            });
        });
      }, null, 'btn-danger');
    }
  };

  $ctrl.peek();
}

angular.module('vamp-ui').controller('BaseArtifactsController', BaseArtifactsController);

ArtifactsController.$inject = ['$scope', 'artifactsMetadata', '$controller'];

function ArtifactsController(
  $scope, artifactsMetadata, $controller) {
  var $ctrl = this;
  $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope, artifactsMetadata: artifactsMetadata});
}

angular.module('vamp-ui').controller('ArtifactsController', ArtifactsController);
