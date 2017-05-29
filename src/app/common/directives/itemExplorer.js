angular.module('vamp-ui').directive('itemExplorer', [function () {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      itemTypeConfig: '=',
      noDelete: '=',
      noAdd: '=',
      onView: '&',
      onDelete: '&',
      onAdd: '&'
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
  '$filter', 'filterFilter', 'toastr', 'alert', 'CRUD_CONFIG'];

function itemExplorerController($scope, $vamp, uiStatesFactory, $state, $stateParams,
  $filter, filterFilter, toastr, alert, CRUD_CONFIG) {
  var $explorer = this;

  // Init
  $explorer.itemTypeConfig = $scope.itemTypeConfig;
  $explorer.type = $explorer.itemTypeConfig.type;
  $explorer.noDelete = $scope.noDelete;
  $explorer.noAdd = $scope.noAdd;

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
    $stateParams.searchTerm = $explorer.searchTerm;
    $explorer.filteredItems = filterFilter($explorer.items, {
      name: $explorer.searchTerm
    });
    $explorer.calcPagination();
  };

  // Pagination
  $explorer.itemsPerPage = CRUD_CONFIG.ITEMS_PER_PAGE;
  $explorer.pages = 1;
  $explorer.currentPage = parseInt($stateParams.page, 10);

  $explorer.calcPagination = function () {
    var pageSum = Math.ceil($explorer.filteredItems.length / $explorer.itemsPerPage);
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

  $explorer.toggleSelection = function () {
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
    $event.stopPropagation();

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
    $scope.onView({item: item});
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
          $vamp.await(function () {
            var item = _.find(_items, function (item) {
              return item.name === name;
            });

            $scope.onDelete({item: item});
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
      }, null, 'btn-danger');
    }
  };

  function initItems() {
    angular.copy($scope.items, _items);
    angular.copy(_.orderBy(_items, 'name'), $explorer.items);
    $explorer.filteredItems = filterFilter($explorer.items, {
      name: $explorer.searchTerm
    });

    $explorer.calcPagination();
  }

  $scope.$watchCollection('items',
    function (newVal, oldVal) {
      if (newVal !== oldVal) {
        initItems();
      }
    });

  initItems();
}
