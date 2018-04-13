/* global Ui */
angular.module('vamp-ui').directive('itemExplorer', [function () {
  return {
    restrict: 'E',
    scope: {
      total: '=',
      items: '=',
      itemTypeConfig: '=',
      noDelete: '=',
      noAdd: '=',
      addCaption: '=',
      customSearch: '=',
      onView: '&',
      onDelete: '&',
      onAdd: '&',
      onSearch: '&'
    },
    transclude: {
      buttonsSlot: '?buttons'
    },
    link: function (scope, element, attrs, ctrl, transclude) {
      transclude(function (clone) {
        if (clone.length) {
          $(element).find('div[ng-transclude="buttonsSlot"]').replaceWith(clone);
        } else {
          element.remove();
        }
      }, null, 'buttonsSlot');
    },
    controller: itemExplorerController,
    controllerAs: '$explorer',
    templateUrl: 'app/common/templates/itemExplorer.html'
  };
}]);

itemExplorerController.$inject = ['$scope', '$vamp', 'uiStatesFactory', '$state', '$stateParams',
  '$filter', 'filterFilter', 'toastr', 'alert', '$authorization'
];

function itemExplorerController($scope, $vamp, uiStatesFactory, $state, $stateParams,
                                $filter, filterFilter, toastr, alert, $authorization) {
  var $explorer = this;
  var readOnly = $authorization.readOnly($scope.itemTypeConfig.kind);

  // Init
  $explorer.itemTypeConfig = $scope.itemTypeConfig;
  $explorer.type = $explorer.itemTypeConfig.type;
  $explorer.noDelete = $scope.noDelete || readOnly;
  $explorer.noAdd = $scope.noAdd || readOnly;
  $explorer.readOnly = readOnly;
  $explorer.addCaption = $scope.addCaption || 'Add';

  if (!$explorer.path) {
    $explorer.path = $explorer.itemTypeConfig.path;
  }

  var _items = [];
  $explorer.items = [];
  $explorer.filteredItems = [];

  // View toggle
  $explorer.viewStates = uiStatesFactory.viewStates;
  $explorer.toggleView = function (type) {
    uiStatesFactory.setMainViewState(type);
  };

  // Search
  $explorer.searchTerm = $stateParams.searchTerm;
  $explorer.onSearchTermChange = function () {
    if ($scope.customSearch) {
      $scope.onSearch({
        term: $explorer.searchTerm
      });
      $explorer.calcPagination();
    } else {
      $stateParams.searchTerm = $explorer.searchTerm;
      $explorer.filteredItems = filterFilter($explorer.items, {
        name: $explorer.searchTerm
      });
      $explorer.calcPagination();
    }
  };

  // Pagination
  $explorer.pages = 1;
  $explorer.itemsPerPage = Ui.config.itemsPerPage;
  $explorer.currentPage = parseInt($stateParams.page, 10);

  $scope.$on('/vamp/settings/update', function () {
    $explorer.itemsPerPage = Ui.config.itemsPerPage;
    $explorer.calcPagination();
    $state.go('.', {page: 1}, {reload: true});
  });

  $explorer.calcPagination = function () {
    var pageSum = Math.ceil($explorer.total / $explorer.itemsPerPage);
    $explorer.pages = pageSum === 0 ? 1 : pageSum;
  };

  $explorer.nextPage = function () {
    if ($explorer.currentPage < $explorer.pages) {
      $state.go('.', {
        page: $explorer.currentPage + 1
      });
    }
  };

  $explorer.previousPage = function () {
    if ($explorer.currentPage > 1) {
      $state.go('.', {
        page: $explorer.currentPage - 1
      });
    }
  };

  $explorer.goToPage = function (n) {
    $state.go('.', {
      page: n
    });
  };

  $explorer.getPages = function (n) {
    return Array.apply(null, {
      length: n
    }).map(Number.call, Number);
  };

  $explorer.getCurrentPageStartingIndex = function () {
    var index = $explorer.currentPage - 2;

    if ($explorer.pages <= 5 || $explorer.currentPage < 2) {
      index = 0;
    } else if ($explorer.currentPage >= $explorer.pages - 2) {
      index = $explorer.pages - 5;
    }

    return index;
  };

  // Item selections
  $explorer.selected = [];

  $explorer.toggleSelection = function ($event) {
    $event.stopPropagation();
    $event.preventDefault();
    var all = $explorer.isSelectedAll();
    $explorer.selected.length = 0;
    if (!all) {
      _.forEach($explorer.filteredItems, function (a) {
        $explorer.selected.push(a);
      });
    }
  };

  $explorer.isSelectedAll = function () {
    return $explorer.items.length > 0 && $explorer.items.length === $explorer.selected.length;
  };

  $explorer.isSelectedAny = function () {
    return $explorer.selected.length > 0;
  };

  $explorer.isSelected = function (item) {
    return _.find($explorer.selected, function (a) {
      return a.name === item.name;
    });
  };

  $explorer.updateSelection = function ($event, item) {
    if ($explorer.viewStates.main === 'table') {
      $event.stopPropagation();
      $event.preventDefault();
    }

    if ($explorer.isSelected(item)) {
      _.remove($explorer.selected, function (a) {
        return a.name === item.name;
      });

      $($event.target).find('input[type=checkbox]').prop('checked', false);
    } else {
      $explorer.selected.push(item);
      $($event.target).find('input[type=checkbox]').prop('checked', true);
    }
  };

  // Operations
  $explorer.add = function () {
    $scope.onAdd({});
  };

  $explorer.view = function (item) {
    $scope.onView({
      item: item
    });
  };

  $explorer.delete = function (item) {
    alert.show('Warning', 'Are you sure you want to delete: ' + item.name + '?', 'Delete', 'Cancel', function () {
      $scope.onDelete({item: item})
        .then(function () {
          toastr.success('\'' + item.name + '\' has been successfully deleted.');
          $vamp.emit(item.kind);
        })
        .catch(function (response) {
          if (response) {
            toastr.error(response.data.message, 'Deletion of \'' + item.name + '\' failed.');
          } else {
            toastr.error('Server timeout.', 'Deletion of \'' + item.name + '\' failed.');
          }
        });
    }, null, 'btn-danger');
  };

  $explorer.deleteSelected = function () {
    var names = _.map(_.sortBy($explorer.selected, ['name']), function (a) {
      return a.name;
    });

    var bracketNames = _.map(names, function (name) {
      return '\'' + name + '\'';
    });

    if ($explorer.isSelectedAny()) {
      alert.show('Warning', 'Are you sure you want to delete: ' + bracketNames.join(', ') + '?', 'Delete', 'Cancel', function () {
        $explorer.selected.length = 0;
        _.forEach(names, function (name) {
          var item = _.find(_items, function (item) {
            return item.name === name;
          });
          if (!item) {
            return;
          }
          $scope.onDelete({item: item})
            .then(function () {
              toastr.success('\'' + name + '\' has been successfully deleted.');
              $vamp.emit(item.kind);
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

  function initItems() {
    $explorer.total = $scope.total || 0;
    angular.copy($scope.items, _items);
    angular.copy(_.orderBy(_items, 'name'), $explorer.items);
    if ($scope.customSearch) {
      $explorer.filteredItems = $explorer.items;
    } else {
      $explorer.filteredItems = filterFilter($explorer.items, {
        name: $explorer.searchTerm
      });
    }
    $explorer.calcPagination();
  }

  $scope.$watchCollection('items',
    function (newVal, oldVal) {
      if (newVal !== oldVal) {
        initItems();
      }
    });

  if ($scope.customSearch && $explorer.searchTerm) {
    $scope.onSearch({
      term: $explorer.searchTerm
    });
    $explorer.calcPagination();
  }

  initItems();
}
